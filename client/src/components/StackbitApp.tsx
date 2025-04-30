import React from 'react';
import { StackbitProvider } from '@stackbit/components';
import { GitContentSource } from '@stackbit/cms-git';

const contentSource = new GitContentSource({
  rootPath: process.cwd(),
  contentDirs: ['content'],
  models: {
    Page: {
      type: 'page',
      urlPath: '/{slug}',
      filePath: 'content/pages/{slug}.md',
      fields: [
        { name: 'title', type: 'string', required: true },
        { name: 'layout', type: 'string', required: true },
        { name: 'sections', type: 'list', items: { type: 'model', models: ['HeroSection', 'FeaturesSection'] } }
      ]
    }
  }
});

interface StackbitAppProps {
  children: React.ReactNode;
}

export function StackbitApp({ children }: StackbitAppProps) {
  return (
    <StackbitProvider contentSource={contentSource}>
      {children}
    </StackbitProvider>
  );
} 