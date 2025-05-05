import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { AlertTriangle } from 'lucide-react';

interface AlertProps {
  title?: string;
  children: ReactNode;
  variant?: 'warning' | 'error' | 'info' | 'success';
  className?: string;
  icon?: ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ 
  title, 
  children, 
  variant = 'warning',
  className,
  icon = <AlertTriangle className="w-5 h-5" />
}) => {
  const variantStyles = {
    warning: 'bg-warning-50 text-warning-800 border-warning-300',
    error: 'bg-danger-50 text-danger-800 border-danger-300',
    info: 'bg-primary-50 text-primary-800 border-primary-300',
    success: 'bg-success-50 text-success-800 border-success-300',
  };

  return (
    <div className={clsx(
      'p-4 mb-4 border rounded-lg flex',
      variantStyles[variant],
      className
    )}>
      <div className="mr-3 mt-0.5">
        {icon}
      </div>
      <div>
        {title && <h3 className="font-semibold mb-1">{title}</h3>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};