import { StackbitConfig } from '@stackbit/types';

const config: StackbitConfig = {
  stackbitVersion: '~0.6.0',
  ssgName: 'nextjs',
  nodeVersion: '16',
  contentSources: [
    {
      type: 'git',
      rootPath: 'content',
      contentDirs: ['pages'],
      models: [
        {
          name: 'Page',
          type: 'page',
          urlPath: '/{slug}',
          fields: [
            { 
              name: 'title', 
              type: 'string', 
              required: true,
              inlineEditable: true
            },
            { 
              name: 'slug', 
              type: 'string', 
              required: true 
            },
            { 
              name: 'content', 
              type: 'markdown',
              inlineEditable: true
            }
          ]
        }
      ]
    }
  ],
  preview: {
    inlineEditing: true
  }
};

export default config; 