import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface LegalFlagBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low';
  riskScore?: number;
  className?: string;
  showScore?: boolean;
}

export function LegalFlagBadge({
  severity,
  riskScore,
  className = '',
  showScore = true,
}: LegalFlagBadgeProps) {
  const getSeverityConfig = (sev: string) => {
    switch (sev) {
      case 'critical':
        return {
          bg: 'bg-red-100 dark:bg-red-900/30',
          text: 'text-red-800 dark:text-red-200',
          border: 'border-red-300 dark:border-red-700',
          icon: AlertCircle,
          label: 'Critical',
        };
      case 'high':
        return {
          bg: 'bg-orange-100 dark:bg-orange-900/30',
          text: 'text-orange-800 dark:text-orange-200',
          border: 'border-orange-300 dark:border-orange-700',
          icon: AlertTriangle,
          label: 'High',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-800 dark:text-yellow-200',
          border: 'border-yellow-300 dark:border-yellow-700',
          icon: Info,
          label: 'Medium',
        };
      case 'low':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-800 dark:text-green-200',
          border: 'border-green-300 dark:border-green-700',
          icon: CheckCircle,
          label: 'Low',
        };
      default:
        return {
          bg: 'bg-gray-100 dark:bg-gray-900/30',
          text: 'text-gray-800 dark:text-gray-200',
          border: 'border-gray-300 dark:border-gray-700',
          icon: Info,
          label: 'Unknown',
        };
    }
  };

  const config = getSeverityConfig(severity);
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <Icon size={16} className="flex-shrink-0" />
      <span className="font-medium text-sm">{config.label}</span>
      {showScore && riskScore !== undefined && (
        <span className="ml-1 text-xs font-semibold">{riskScore}%</span>
      )}
    </div>
  );
}
