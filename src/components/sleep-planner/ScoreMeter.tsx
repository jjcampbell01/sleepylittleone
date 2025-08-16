import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ScoreMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreMeter({ score, size = 'md' }: ScoreMeterProps) {
  const isMobile = useIsMobile();
  const responsiveSize = isMobile && size === 'lg' ? 'md' : size;
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32', 
    lg: 'w-40 h-40'
  };
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;

  return (
    <div className="flex flex-col items-center">
    <div className={cn("relative", sizeClasses[responsiveSize])}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-muted/20"
          />
          
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={cn("stop-opacity-100", getProgressColor(score).split(' ')[0].replace('from-', 'stop-'))} />
              <stop offset="100%" className={cn("stop-opacity-100", getProgressColor(score).split(' ')[1].replace('to-', 'stop-'))} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={cn("font-bold", textSizes[responsiveSize], getScoreColor(score))}>
            {score}
          </div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <div className={cn("font-semibold", getScoreColor(score))}>
          {getScoreLabel(score)}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Sleep Readiness Index
        </div>
      </div>
    </div>
  );
}