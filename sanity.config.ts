import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

import { schemaTypes, singletonTypes } from './sanity/schemas';
import { structure } from './sanity/structure';
import { apiVersion, dataset, projectId } from './sanity/env';

export default defineConfig({
  name: 'wildher-cms',
  title: 'WildHer Adventures CMS',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    // Prevent users from creating multiple documents of a singleton type
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Hide "Duplicate" and "Delete" actions on singleton documents
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) =>
            ['publish', 'discardChanges', 'restore'].includes(action || '')
          )
        : input,
  },
});
