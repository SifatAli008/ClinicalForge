'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react';

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
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm">{description}</CardDescription>
              )}
            </div>
          </div>
          {showTrend && trendValue && (
            <div className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
              {trendDirection === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${
                trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendValue}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="space-y-2 group/item">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium truncate">{item.label}</span>
                  <span className="text-muted-foreground font-semibold">{item.value}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-700 ease-out ${
                      item.color || 'bg-gradient-to-r from-primary to-primary/80'
                    }`}
                    style={{
                      width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                      transform: 'translateX(-100%)',
                      animation: 'slideIn 0.7s ease-out forwards',
                      animationDelay: `${index * 0.1}s`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-2">No data available</p>
            <p className="text-sm text-muted-foreground">
              Data will appear here once available
            </p>
          </div>
        )}
      </CardContent>
      <style jsx>{`
        @keyframes slideIn {
          to {
            transform: translateX(0);
          }
        }
      `}</style>
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
    color: 'bg-gradient-to-r from-blue-500 to-blue-600'
  }));

  const calculateTrend = () => {
    if (data.length < 2) return { value: 0, direction: 'up' as const };
    
    const lastMonth = data[data.length - 1]?.count || 0;
    const previousMonth = data[data.length - 2]?.count || 0;
    
    if (previousMonth === 0) return { value: 0, direction: 'up' as const };
    
    const trendValue = Math.round(((lastMonth - previousMonth) / previousMonth) * 100);
    return {
      value: Math.abs(trendValue),
      direction: trendValue >= 0 ? 'up' as const : 'down' as const
    };
  };

  const trend = calculateTrend();

  return (
    <DashboardChart
      title="Monthly Contributions"
      description="Form submissions over the last 6 months"
      data={chartData}
      type="bar"
      showTrend={true}
      trendValue={trend.value}
      trendDirection={trend.direction}
    />
  );
}

interface DiseaseChartProps {
  data: Array<{ name: string; count: number }>;
}

export function DiseaseChart({ data }: DiseaseChartProps) {
  const chartData = data.map((item, index) => {
    const colors = [
      'bg-gradient-to-r from-green-500 to-green-600',
      'bg-gradient-to-r from-blue-500 to-blue-600',
      'bg-gradient-to-r from-purple-500 to-purple-600',
      'bg-gradient-to-r from-orange-500 to-orange-600',
      'bg-gradient-to-r from-red-500 to-red-600'
    ];
    
    return {
      label: item.name,
      value: item.count,
      color: colors[index % colors.length]
    };
  });

  return (
    <DashboardChart
      title="Top Diseases"
      description="Most frequently studied conditions"
      data={chartData}
      type="bar"
    />
  );
} 