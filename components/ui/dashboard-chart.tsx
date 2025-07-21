'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface DashboardChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  type?: 'bar' | 'line' | 'pie';
  showTrend?: boolean;
  trendValue?: number;
  trendDirection?: 'up' | 'down';
}

export function DashboardChart({
  title,
  description,
  data,
  type = 'bar',
  showTrend = false,
  trendValue,
  trendDirection = 'up'
}: DashboardChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>{title}</span>
          </span>
          {showTrend && trendValue && (
            <div className="flex items-center space-x-1 text-sm">
              {trendDirection === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}>
                {trendValue}%
              </span>
            </div>
          )}
        </CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.value}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    item.color || 'bg-primary'
                  }`}
                  style={{
                    width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface MonthlyChartProps {
  data: Array<{ month: string; count: number }>;
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = data.map(item => ({
    label: item.month,
    value: item.count,
    color: 'bg-blue-500'
  }));

  return (
    <DashboardChart
      title="Monthly Contributions"
      description="Form submissions over the last 6 months"
      data={chartData}
      type="bar"
      showTrend={true}
      trendValue={data.length > 1 ? 
        Math.round(((data[data.length - 1]?.count || 0) - (data[data.length - 2]?.count || 0)) / (data[data.length - 2]?.count || 1) * 100) : 0
      }
      trendDirection={data.length > 1 && (data[data.length - 1]?.count || 0) > (data[data.length - 2]?.count || 0) ? 'up' : 'down'}
    />
  );
}

interface DiseaseChartProps {
  data: Array<{ name: string; count: number }>;
}

export function DiseaseChart({ data }: DiseaseChartProps) {
  const chartData = data.map(item => ({
    label: item.name,
    value: item.count,
    color: 'bg-green-500'
  }));

  return (
    <DashboardChart
      title="Top Diseases"
      description="Most frequently studied conditions"
      data={chartData}
      type="bar"
    />
  );
} 