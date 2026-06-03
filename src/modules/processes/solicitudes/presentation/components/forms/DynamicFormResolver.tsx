import React from 'react';
import { FormAcometida } from './FormAcometida';
import { FormSuspension } from './FormSuspension';

interface DynamicFormResolverProps {
  categoria: string;
  data: any;
  onChange: (data: any) => void;
  errors?: Record<string, string>;
}

export const DynamicFormResolver: React.FC<DynamicFormResolverProps> = ({
  categoria,
  data,
  onChange,
  errors
}) => {
  switch (categoria) {
    case 'nueva_acometida':
    case 'alcantarillado':
      return <FormAcometida data={data} onChange={onChange} errors={errors} />;

    case 'suspension':
      return <FormSuspension data={data} onChange={onChange} errors={errors} />;

    default:
      return (
        <div
          style={{
            padding: 'var(--spacing-lg)',
            background: 'var(--surface-hover)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <p>No hay campos adicionales requeridos para este trámite.</p>
        </div>
      );
  }
};
