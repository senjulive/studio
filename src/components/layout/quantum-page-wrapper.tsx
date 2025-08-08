'use client';

import { ReactNode } from 'react';

interface QuantumPageWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function QuantumPageWrapper({ 
  children, 
  title, 
  description, 
  className = ''
}: QuantumPageWrapperProps) {
  return (
    <div 
      className={`min-h-full ${className}`}
      style={{
        background: 'var(--qn-darker)',
        color: 'var(--qn-light)',
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(110, 0, 255, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, rgba(0, 247, 255, 0.1) 0%, transparent 20%)
        `
      }}
    >
      {title && (
        <div className="mb-6">
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(90deg, var(--qn-primary), var(--qn-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            {title}
          </h1>
          {description && (
            <p style={{
              color: 'var(--qn-secondary)',
              fontSize: '16px',
              opacity: '0.9'
            }}>
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
