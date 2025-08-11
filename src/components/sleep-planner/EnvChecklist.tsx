import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Thermometer, Moon, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  roomTemp: number;
  roomLight: string;
  noiseLevel: string;
  routine: string[];
  consistencyRating: number;
}

interface EnvChecklistProps {
  formData: FormData;
}

export function EnvChecklist({ formData }: EnvChecklistProps) {
  const checks = [
    {
      label: 'Room Temperature',
      icon: Thermometer,
      status: formData.roomTemp >= 18 && formData.roomTemp <= 22 ? 'good' : 'warning',
      value: `${formData.roomTemp}°C`,
      tip: 'Ideal range: 18-20°C'
    },
    {
      label: 'Room Lighting',
      icon: Moon,
      status: formData.roomLight === 'blackout' ? 'good' : formData.roomLight === 'dim' ? 'warning' : 'poor',
      value: formData.roomLight?.replace('-', ' ') || 'Not set',
      tip: 'Blackout curtains recommended'
    },
    {
      label: 'Noise Level',
      icon: Volume2,
      status: formData.noiseLevel === 'white-noise' ? 'good' : formData.noiseLevel === 'silent' ? 'warning' : 'poor',
      value: formData.noiseLevel?.replace('-', ' ') || 'Not set',
      tip: 'White noise helps mask sudden sounds'
    },
    {
      label: 'Bedtime Routine',
      icon: CheckCircle,
      status: formData.routine.length >= 3 ? 'good' : formData.routine.length >= 1 ? 'warning' : 'poor',
      value: `${formData.routine.length} elements`,
      tip: 'Aim for 3-5 consistent routine elements'
    },
    {
      label: 'Consistency',
      icon: CheckCircle,
      status: formData.consistencyRating >= 7 ? 'good' : formData.consistencyRating >= 5 ? 'warning' : 'poor',
      value: `${formData.consistencyRating}/10`,
      tip: 'Consistency is key for sleep success'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'poor':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Environment Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {checks.map((check, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
              <check.icon className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{check.label}</span>
                  {getStatusIcon(check.status)}
                </div>
                <div className={cn("text-sm", getStatusColor(check.status))}>
                  {check.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {check.tip}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="text-sm text-center">
            <span className="font-medium">
              {checks.filter(c => c.status === 'good').length}/{checks.length}
            </span>
            <span className="text-muted-foreground ml-1">
              optimal conditions met
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}