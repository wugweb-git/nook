import React from 'react';
import { useDocument, useField } from '@stackbit/components';

interface InlineEditableProps {
  fieldName: string;
  modelName: string;
  children: React.ReactNode;
}

export function InlineEditable({ fieldName, modelName, children }: InlineEditableProps) {
  const { document } = useDocument({ modelName });
  const { value, update } = useField(fieldName);

  if (!document) return null;

  return (
    <div
      data-sb-field-path={fieldName}
      onClick={(e) => {
        e.preventDefault();
        update(value);
      }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );
} 