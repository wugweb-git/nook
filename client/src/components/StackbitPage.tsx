import React from 'react';
import { useDocument } from '@stackbit/components';
import { InlineEditable } from './InlineEditable';

interface StackbitPageProps {
  slug: string;
}

export function StackbitPage({ slug }: StackbitPageProps) {
  const { document, isLoading } = useDocument({
    modelName: 'Page',
    filter: { slug }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!document) {
    return <div>Page not found</div>;
  }

  return (
    <div>
      <InlineEditable fieldName="title" modelName="Page">
        <h1>{document.title}</h1>
      </InlineEditable>
      <InlineEditable fieldName="content" modelName="Page">
        <div dangerouslySetInnerHTML={{ __html: document.content }} />
      </InlineEditable>
    </div>
  );
} 