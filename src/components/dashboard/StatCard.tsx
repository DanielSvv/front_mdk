import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
    neutral?: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className 
}) => {
  return (
    <div className={clsx('stat-card', className)}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-600">{icon}</div>}
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {trend && (
        <p 
          className={clsx(
            'text-sm flex items-center',
            trend.positive && 'text-success-500',
            trend.neutral && 'text-gray-500',
            !trend.positive && !trend.neutral && 'text-danger-500'
          )}
        >
          {trend.positive ? (
            <span className="mr-1">↑</span>
          ) : trend.neutral ? (
            <span className="mr-1">→</span>
          ) : (
            <span className="mr-1">↓</span>
          )}
          {trend.value}
        </p>
      )}
    </div>
  );
};