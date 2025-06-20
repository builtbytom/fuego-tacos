import { defineConfig } from "tinacms";

const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID, // Get this from tina.io
  token: process.env.TINA_TOKEN, // Get this from tina.io
  
  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  
  cmsCallback: (cms) => {
    // Optionally add plugins or customize TinaCMS here
    return cms;
  },
  
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  
  schema: {
    collections: [
      {
        name: "menu",
        label: "Menu Items",
        path: "src/content/menu",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "Category",
            options: ["tacos", "sides", "drinks", "desserts"],
            required: true,
          },
          {
            type: "number",
            name: "price",
            label: "Price",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "image",
            label: "Image",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured Item",
          },
          {
            type: "boolean",
            name: "spicy",
            label: "Spicy",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "specials",
        label: "Daily Specials",
        path: "src/content/specials",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "dayOfWeek",
            label: "Day of Week",
            options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            required: true,
          },
          {
            type: "number",
            name: "price",
            label: "Price",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "image",
            label: "Image",
          },
        ],
      },
      {
        name: "pages",
        label: "Pages",
        path: "src/content/pages",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "settings",
        label: "Site Settings",
        path: "src/content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "restaurantName",
            label: "Restaurant Name",
            required: true,
          },
          {
            type: "string",
            name: "tagline",
            label: "Tagline",
          },
          {
            type: "string",
            name: "phone",
            label: "Phone Number",
          },
          {
            type: "string",
            name: "address",
            label: "Address",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "hours",
            label: "Hours",
            fields: [
              {
                type: "string",
                name: "monday",
                label: "Monday",
              },
              {
                type: "string",
                name: "tuesday",
                label: "Tuesday",
              },
              {
                type: "string",
                name: "wednesday",
                label: "Wednesday",
              },
              {
                type: "string",
                name: "thursday",
                label: "Thursday",
              },
              {
                type: "string",
                name: "friday",
                label: "Friday",
              },
              {
                type: "string",
                name: "saturday",
                label: "Saturday",
              },
              {
                type: "string",
                name: "sunday",
                label: "Sunday",
              },
            ],
          },
        ],
      },
    ],
  },
});