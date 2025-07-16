import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass';
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
}

export function EnhancedCard({
  title,
  description,
  children,
  className,
  variant = 'default',
  icon,
  badge,
  onClick
}: EnhancedCardProps) {
  const baseClasses = "transition-all duration-300 hover:shadow-xl";
  
  const variantClasses = {
    default: "bg-card border border-border",
    gradient: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border border-blue-200 dark:border-blue-800",
    glass: "backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border border-white/20 dark:border-gray-700/20"
  };

  const cardClasses = cn(
    baseClasses,
    variantClasses[variant],
    onClick && "cursor-pointer hover:scale-105",
    className
  );

  return (
    <Card className={cardClasses} onClick={onClick}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {icon}
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-2 text-base leading-relaxed">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {badge && (
            <div className="flex-shrink-0">
              {badge}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className
}: StatCardProps) {
  return (
    <EnhancedCard
      title={title}
      description={description}
      className={className}
      variant="glass"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              {icon}
            </div>
          )}
          <div>
            <div className="text-3xl font-bold text-foreground">{value}</div>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span>{trend.isPositive ? '↗' : '↘'}</span>
                <span>{Math.abs(trend.value)}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </EnhancedCard>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  onClick
}: FeatureCardProps) {
  return (
    <EnhancedCard
      title={title}
      description={description}
      className={cn("text-center", className)}
      variant="default"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          {icon}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </EnhancedCard>
  );
} 