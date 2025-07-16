import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSummaryItem {
  label: string;
  value: string | number | null;
  type?: 'text' | 'number' | 'status';
  status?: 'complete' | 'incomplete' | 'optional';
}

interface DataSummaryProps {
  title: string;
  description?: string;
  items: DataSummaryItem[];
  className?: string;
  showProgress?: boolean;
}

export function DataSummary({
  title,
  description,
  items,
  className,
  showProgress = true
}: DataSummaryProps) {
  const completedItems = items.filter(item => item.value !== null && item.value !== '').length;
  const totalItems = items.length;
  const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'incomplete':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'optional':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (item: DataSummaryItem) => {
    if (item.value !== null && item.value !== '') {
      return <Badge variant="secondary" className="text-green-700 bg-green-100">Complete</Badge>;
    }
    if (item.status === 'optional') {
      return <Badge variant="outline" className="text-blue-600">Optional</Badge>;
    }
    return <Badge variant="destructive">Required</Badge>;
  };

  return (
    <Card className={cn("clinical-card", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm mt-1">
                {description}
              </CardDescription>
            )}
          </div>
          {showProgress && (
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completedItems}/{totalItems}</div>
              <div className="text-sm text-muted-foreground">Fields completed</div>
            </div>
          )}
        </div>
        {showProgress && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                {item.status && getStatusIcon(item.status)}
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.value !== null && item.value !== '' 
                      ? item.value.toString() 
                      : 'Not provided'
                    }
                  </div>
                </div>
              </div>
              {getStatusBadge(item)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickSummaryProps {
  data: Record<string, any>;
  requiredFields: string[];
  optionalFields?: string[];
  className?: string;
}

export function QuickSummary({
  data,
  requiredFields,
  optionalFields = [],
  className
}: QuickSummaryProps) {
  const allFields = [...requiredFields, ...optionalFields];
  
  const items: DataSummaryItem[] = allFields.map(field => ({
    label: field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    value: data[field] || null,
    status: optionalFields.includes(field) ? 'optional' : 'complete'
  }));

  const completedRequired = requiredFields.filter(field => data[field]).length;
  const totalRequired = requiredFields.length;

  return (
    <DataSummary
      title="Data Summary"
      description={`${completedRequired}/${totalRequired} required fields completed`}
      items={items}
      className={className}
      showProgress={false}
    />
  );
} 