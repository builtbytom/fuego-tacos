# Image Optimization Solutions for TinaCMS/Astro

## Overview
This document provides implementation solutions for automatically optimizing images in your TinaCMS/Astro setup to prevent clients from uploading large, unoptimized images.

## Solution Options

### 1. Custom TinaCMS Media Store with Sharp (Recommended)

This solution creates a custom media store that intercepts uploads and optimizes them before saving.

#### Implementation Steps:

1. **Install Dependencies**
```bash
npm install sharp
```

2. **Create Custom Media Store** (`tina/media-store.ts`)
```typescript
import { Media, MediaList, MediaListOptions, MediaStore, MediaUploadOptions } from 'tinacms';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

export class OptimizedMediaStore implements MediaStore {
  accept = 'image/*';
  private publicFolder: string;
  private mediaRoot: string;

  constructor(publicFolder: string, mediaRoot: string) {
    this.publicFolder = publicFolder;
    this.mediaRoot = mediaRoot;
  }

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const uploadedMedia: Media[] = [];

    for (const file of files) {
      const optimizedMedia = await this.optimizeAndSaveImage(file);
      uploadedMedia.push(optimizedMedia);
    }

    return uploadedMedia;
  }

  private async optimizeAndSaveImage(file: MediaUploadOptions): Promise<Media> {
    const buffer = Buffer.from(await file.file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.filename.replace(/[^a-z0-9.-]/gi, '-').toLowerCase();
    const nameWithoutExt = path.parse(sanitizedName).name;
    
    // Define optimization settings
    const sizes = [
      { width: 1920, suffix: '' }, // Original size (max width)
      { width: 1200, suffix: '-lg' },
      { width: 768, suffix: '-md' },
      { width: 480, suffix: '-sm' }
    ];

    // Create optimized versions
    const uploadPath = path.join(this.publicFolder, this.mediaRoot);
    await fs.mkdir(uploadPath, { recursive: true });

    let mainFilePath = '';
    
    for (const size of sizes) {
      // Skip if image is smaller than target size
      if (metadata.width && metadata.width < size.width) continue;

      // WebP version
      const webpFilename = `${nameWithoutExt}${size.suffix}-${timestamp}.webp`;
      const webpPath = path.join(uploadPath, webpFilename);
      
      await sharp(buffer)
        .resize(size.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: 85 })
        .toFile(webpPath);

      // JPEG fallback for main image only
      if (size.suffix === '') {
        const jpegFilename = `${nameWithoutExt}-${timestamp}.jpg`;
        const jpegPath = path.join(uploadPath, jpegFilename);
        
        await sharp(buffer)
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(jpegPath);
          
        mainFilePath = `/${this.mediaRoot}/${jpegFilename}`;
      }
    }

    // Create a low-quality placeholder
    const placeholderFilename = `${nameWithoutExt}-placeholder-${timestamp}.webp`;
    const placeholderPath = path.join(uploadPath, placeholderFilename);
    
    await sharp(buffer)
      .resize(20)
      .blur(10)
      .webp({ quality: 20 })
      .toFile(placeholderPath);

    return {
      id: `${timestamp}-${sanitizedName}`,
      type: 'file',
      directory: this.mediaRoot,
      filename: path.basename(mainFilePath),
      src: mainFilePath
    };
  }

  async delete(media: Media): Promise<void> {
    const filePath = path.join(this.publicFolder, media.src || '');
    try {
      await fs.unlink(filePath);
      // Also delete related optimized versions
      const dir = path.dirname(filePath);
      const baseName = path.parse(media.filename).name;
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        if (file.includes(baseName)) {
          await fs.unlink(path.join(dir, file));
        }
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  async list(options: MediaListOptions = {}): Promise<MediaList> {
    const mediaPath = path.join(this.publicFolder, this.mediaRoot);
    
    try {
      const files = await fs.readdir(mediaPath);
      const items: Media[] = [];
      
      // Filter to only show main images (not variants)
      const mainImages = files.filter(f => 
        !f.includes('-sm') && 
        !f.includes('-md') && 
        !f.includes('-lg') && 
        !f.includes('-placeholder') &&
        f.endsWith('.jpg')
      );
      
      for (const filename of mainImages) {
        items.push({
          id: filename,
          type: 'file',
          directory: this.mediaRoot,
          filename: filename,
          src: `/${this.mediaRoot}/${filename}`
        });
      }
      
      const offset = options.offset || 0;
      const limit = options.limit || 50;
      const paginatedItems = items.slice(offset, offset + limit);
      
      return {
        items: paginatedItems,
        offset,
        limit,
        totalCount: items.length
      };
    } catch (error) {
      return {
        items: [],
        offset: 0,
        limit: 50,
        totalCount: 0
      };
    }
  }

  previewSrc(src: string): string {
    // Try to return WebP version for preview
    const parsed = path.parse(src);
    const webpVersion = `${parsed.dir}/${parsed.name}.webp`;
    return webpVersion;
  }
}
```

3. **Update TinaCMS Configuration** (`tina/config.ts`)
```typescript
import { defineConfig } from "tinacms";
import { OptimizedMediaStore } from "./media-store";

export default defineConfig({
  // ... existing config
  
  media: {
    loadCustomStore: async () => {
      const store = new OptimizedMediaStore("public", "uploads");
      return store;
    },
  },
  
  // ... rest of config
});
```

### 2. Astro Build-Time Optimization (Alternative)

Use Astro's built-in image optimization for images already uploaded.

1. **Install Astro Image Integration**
```bash
npm install @astrojs/image sharp
```

2. **Update Astro Config** (`astro.config.mjs`)
```javascript
import { defineConfig } from 'astro/config';
import image from '@astrojs/image';

export default defineConfig({
  output: 'static',
  integrations: [
    image({
      serviceEntryPoint: '@astrojs/image/sharp',
      cacheDir: './.astro/image',
      logLevel: 'debug',
    })
  ]
});
```

3. **Create Image Component** (`src/components/OptimizedImage.astro`)
```astro
---
import { Image } from 'astro:assets';

export interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  class?: string;
}

const { src, alt, width, height, loading = 'lazy', class: className } = Astro.props;

// Handle TinaCMS uploaded images
const imageSrc = src.startsWith('/') ? `.${src}` : src;
---

<picture>
  <source 
    type="image/webp" 
    srcset={`${imageSrc}?w=480&f=webp 480w, ${imageSrc}?w=768&f=webp 768w, ${imageSrc}?w=1200&f=webp 1200w`}
    sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"
  />
  <img 
    src={imageSrc}
    alt={alt}
    width={width}
    height={height}
    loading={loading}
    class={className}
  />
</picture>
```

### 3. Serverless Function Approach (For Dynamic Sites)

Create an API endpoint that handles image optimization on-the-fly.

1. **Create API Route** (`src/pages/api/image.ts`)
```typescript
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export const GET: APIRoute = async ({ params, request }) => {
  const url = new URL(request.url);
  const imagePath = url.searchParams.get('src');
  const width = parseInt(url.searchParams.get('w') || '0');
  const format = url.searchParams.get('f') || 'jpeg';
  
  if (!imagePath) {
    return new Response('Image path required', { status: 400 });
  }
  
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const imageBuffer = await fs.readFile(fullPath);
    
    let transform = sharp(imageBuffer);
    
    if (width > 0) {
      transform = transform.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    let outputBuffer: Buffer;
    let contentType: string;
    
    switch (format) {
      case 'webp':
        outputBuffer = await transform.webp({ quality: 85 }).toBuffer();
        contentType = 'image/webp';
        break;
      case 'avif':
        outputBuffer = await transform.avif({ quality: 80 }).toBuffer();
        contentType = 'image/avif';
        break;
      default:
        outputBuffer = await transform.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
        contentType = 'image/jpeg';
    }
    
    return new Response(outputBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    return new Response('Image not found', { status: 404 });
  }
};
```

## Comparison of Solutions

| Solution | Pros | Cons | Best For |
|----------|------|------|----------|
| Custom Media Store | - Automatic optimization on upload<br>- Transparent to users<br>- No monthly fees<br>- Full control | - More complex setup<br>- Requires server processing | Static sites with CMS editors |
| Astro Build-Time | - Simple setup<br>- Uses Astro's built-in features<br>- Great performance | - Only optimizes at build time<br>- Doesn't prevent large uploads | Sites rebuilt frequently |
| Serverless Function | - On-demand optimization<br>- Flexible sizing | - Requires server/serverless environment<br>- Processing overhead | Dynamic sites with varied image needs |

## Recommended Implementation

For your use case, I recommend **Solution 1: Custom TinaCMS Media Store** because:

1. **Automatic**: Optimizes images immediately upon upload
2. **Transparent**: Clients don't need to know about optimization
3. **Comprehensive**: Creates multiple sizes and formats automatically
4. **Cost-effective**: No monthly fees or external services required
5. **Storage-efficient**: Prevents large files from being stored

## Additional Optimizations

### 1. File Size Validation
Add to your custom media store:
```typescript
// In the persist method
if (file.file.size > 10 * 1024 * 1024) { // 10MB limit
  throw new Error('File size exceeds 10MB limit. Please use a smaller image.');
}
```

### 2. Smart Format Selection
```typescript
// Detect if image has transparency
const hasAlpha = metadata.channels === 4;
const outputFormat = hasAlpha ? 'png' : 'jpeg';
```

### 3. Progressive Enhancement
Use the placeholder image for lazy loading:
```html
<img 
  src="image-placeholder.webp" 
  data-src="image.jpg"
  loading="lazy"
  class="lazyload"
/>
```

## Installation Guide

1. Choose your preferred solution
2. Install required dependencies
3. Implement the code changes
4. Test with various image sizes and formats
5. Monitor storage usage and performance

## Maintenance

- Regularly clean up unused optimized variants
- Monitor Sharp for updates and security patches
- Consider implementing image CDN for high-traffic sites
- Add logging to track optimization performance

This solution ensures your clients can upload images without worrying about optimization, while your site maintains excellent performance and reasonable storage usage.