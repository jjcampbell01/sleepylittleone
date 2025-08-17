import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info, AlertTriangle, CheckCircle } from 'lucide-react';

interface SleepScienceInsightProps {
  title: string;
  content: string;
  type?: 'info' | 'warning' | 'success';
  compact?: boolean;
}

export function SleepScienceInsight({ 
  title, 
  content, 
  type = 'info', 
  compact = false 
}: SleepScienceInsightProps) {
  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle
  };
  
  const colors = {
    info: 'text-blue-600 bg-blue-50 border-blue-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    success: 'text-green-600 bg-green-50 border-green-200'
  };
  
  const IconComponent = icons[type];
  const colorClasses = colors[type];
  
  if (compact) {
    return (
      <div className={`flex items-start gap-2 p-3 rounded-lg border ${colorClasses}`}>
        <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-medium">{title}</p>
          <p className="mt-1 opacity-90">{content}</p>
        </div>
      </div>
    );
  }
  
  return (
    <Card className={`border ${colorClasses.split(' ')[2]}`}>
      <CardContent className={`p-4 ${colorClasses}`}>
        <div className="flex items-start gap-3">
          <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="mt-1 text-sm opacity-90">{content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}