import {
  defineStackbitConfig,
  getLocalizedFieldForLocale,
  SiteMapEntry
} from "@stackbit/types";
import { GitContentSource } from "@stackbit/cms-git";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "nextjs",
  nodeVersion: "18",
  preview: {
    workingBranch: "preview",
    runnableDirectory: "client",
    visualEditorLandingPage: "index.html"
  },
  contentSources: [
    new GitContentSource({
      rootPath: __dirname,
      contentDirs: ["content"],
      models: [
        {
          name: "Page",
          type: "page",
          filePath: "content/pages/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "layout", type: "string", required: true },
            { name: "pageId", type: "string", hidden: true },
            { name: "sections", type: "list", items: { type: "model", models: ["Hero", "Features", "Testimonials", "Contact"] } }
          ]
        },
        {
          name: "BlogPost",
          type: "page",
          filePath: "content/blog/{slug}.json",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "date", type: "date", required: true },
            { name: "author", type: "string", required: true },
            { name: "pageId", type: "string", hidden: true },
            { name: "content", type: "markdown", required: true },
            { name: "tags", type: "list", items: { type: "string" } }
          ]
        },
        {
          name: "Hero",
          type: "object",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "subtitle", type: "string" },
            { name: "image", type: "image" },
            { name: "cta", type: "model", models: ["Button"] }
          ]
        },
        {
          name: "Features",
          type: "object",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "items", type: "list", items: { type: "model", models: ["Feature"] } }
          ]
        },
        {
          name: "Feature",
          type: "object",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "description", type: "string" },
            { name: "icon", type: "string" }
          ]
        },
        {
          name: "Testimonials",
          type: "object",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "items", type: "list", items: { type: "model", models: ["Testimonial"] } }
          ]
        },
        {
          name: "Testimonial",
          type: "object",
          fields: [
            { name: "quote", type: "string", required: true },
            { name: "author", type: "string", required: true },
            { name: "role", type: "string" },
            { name: "image", type: "image" }
          ]
        },
        {
          name: "Contact",
          type: "object",
          fields: [
            { name: "title", type: "string", required: true },
            { name: "description", type: "string" },
            { name: "form", type: "model", models: ["ContactForm"] }
          ]
        },
        {
          name: "ContactForm",
          type: "object",
          fields: [
            { name: "fields", type: "list", items: { type: "model", models: ["FormField"] } },
            { name: "submitButton", type: "model", models: ["Button"] }
          ]
        },
        {
          name: "FormField",
          type: "object",
          fields: [
            { name: "name", type: "string", required: true },
            { name: "label", type: "string", required: true },
            { name: "type", type: "enum", options: ["text", "email", "textarea"], required: true },
            { name: "required", type: "boolean" }
          ]
        },
        {
          name: "Button",
          type: "object",
          fields: [
            { name: "text", type: "string", required: true },
            { name: "url", type: "string" },
            { name: "variant", type: "enum", options: ["primary", "secondary", "outline"], required: true }
          ]
        }
      ]
    })
  ],
  assetsConfig: {
    bynder: {
      portalUrl: "https://your-portal.bynder.com",
      apiToken: process.env.BYNDER_API_TOKEN
    }
  },
  modelExtensions: [
    {
      name: "Page",
      type: "page",
      urlPath: "/{slug}",
      fields: [{ name: "pageId", type: "string", hidden: true }]
    },
    {
      name: "BlogPost",
      type: "page",
      urlPath: "/blog/{slug}",
      fields: [{ name: "pageId", type: "string", hidden: true }]
    }
  ],
  async onContentCreate({ object, model }) {
    if (model.type !== "page") {
      return object;
    }
    // For pages that already have a pageId field, use that value; if not, generate one
    const hasPageIdField = !!model.fields?.find(
      field => field.name === "pageId"
    );
    if (hasPageIdField && !object.pageId) {
      object.pageId = Date.now().toString();
    }
    return object;
  },
  siteMap: ({ documents, models }) => {
    const pageModels = models.filter(m => m.type === "page").map(m => m.name);
    return documents
      .filter(d => pageModels.includes(d.modelName))
      .map(document => {
        const slugField = document.fields.slug?.type === "slug"
          ? document.fields.slug
          : undefined;
        const pageIdField = document.fields.pageId?.type === "string"
          ? document.fields.pageId
          : undefined;

        const slug = getLocalizedFieldForLocale(slugField);
        const pageId = getLocalizedFieldForLocale(pageIdField);

        if (!slug?.value || !pageId?.value) return null;

        const urlPath = document.modelName === "BlogPost"
          ? `/blog/${slug.value.replace(/^\/+/, "")}`
          : `/${slug.value.replace(/^\/+/, "")}`;

        return {
          stableId: pageId.value,
          urlPath,
          document,
          isHomePage: urlPath === "/"
        };
      })
      .filter(Boolean) as SiteMapEntry[];
  },
  preview: {
    inlineEditing: true
  }
});
