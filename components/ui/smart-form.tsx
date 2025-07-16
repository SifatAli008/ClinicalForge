import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface SmartFormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  helpText?: string;
  defaultValue?: any;
}

interface SmartFormProps {
  title: string;
  description?: string;
  fields: SmartFormField[];
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  className?: string;
  loading?: boolean;
}

export function SmartForm({
  title,
  description,
  fields,
  onSubmit,
  onCancel,
  submitText = "Submit",
  cancelText = "Cancel",
  className,
  loading = false
}: SmartFormProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateField = (field: SmartFormField, value: any): string => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (field.type === 'number' && value) {
      const numValue = Number(value);
      if (field.validation?.min && numValue < field.validation.min) {
        return `${field.label} must be at least ${field.validation.min}`;
      }
      if (field.validation?.max && numValue > field.validation.max) {
        return `${field.label} must be at most ${field.validation.max}`;
      }
    }

    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field: SmartFormField) => {
    const value = formData[field.name] || field.defaultValue || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-semibold">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={cn(
                "h-11 text-base",
                error ? "border-red-500 ring-red-500" : "focus:ring-primary"
              )}
            />
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {field.helpText && !error && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-semibold">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select 
              value={value} 
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              <SelectTrigger className={cn(
                "h-11 text-base",
                error ? "border-red-500 ring-red-500" : "focus:ring-primary"
              )}>
                <SelectValue placeholder={field.placeholder || "Select an option"} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {field.helpText && !error && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-semibold">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={cn(
                "text-base",
                error ? "border-red-500 ring-red-500" : "focus:ring-primary"
              )}
            />
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            {field.helpText && !error && (
              <p className="text-sm text-muted-foreground">{field.helpText}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id={field.name}
              checked={value}
              onChange={(e) => handleInputChange(field.name, e.target.checked)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <Label htmlFor={field.name} className="text-sm font-semibold">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {error && (
              <p className="text-sm text-red-600 font-medium ml-7">{error}</p>
            )}
            {field.helpText && !error && (
              <p className="text-sm text-muted-foreground ml-7">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn("clinical-card", className)}>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base leading-relaxed">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                {renderField(field)}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-3 pt-6">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="h-11 px-6 text-base font-semibold"
              >
                {cancelText}
              </Button>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="h-11 px-8 text-base font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                submitText
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 