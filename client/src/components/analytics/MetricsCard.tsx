import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface MetricsCardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: number;
  icon?: React.ReactNode;
  color?: "default" | "success" | "warning" | "danger";
  isLoading?: boolean;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  unit = "",
  trend,
  trendValue = 0,
  icon,
  color = "default",
  isLoading = false,
}) => {
  const { language } = useLanguage();
  const t = (key: string) => translations[language][key] || key;

  const colorClasses = {
    default: "text-foreground",
    success: "text-green-600 dark:text-green-400",
    warning: "text-yellow-600 dark:text-yellow-400",
    danger: "text-red-600 dark:text-red-400",
  };

  const bgColorClasses = {
    default: "bg-muted",
    success: "bg-green-100 dark:bg-green-950",
    warning: "bg-yellow-100 dark:bg-yellow-950",
    danger: "bg-red-100 dark:bg-red-950",
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    const iconProps = { className: "w-4 h-4" };
    if (trend === "up") return <ArrowUp {...iconProps} className={`${iconProps.className} text-green-600`} />;
    if (trend === "down") return <ArrowDown {...iconProps} className={`${iconProps.className} text-red-600`} />;
    return <TrendingUp {...iconProps} className={`${iconProps.className} text-blue-600`} />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-8 bg-muted rounded w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${bgColorClasses[color]}`}>
          {icon || <CheckCircle className={`w-4 h-4 ${colorClasses[color]}`} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className={`text-2xl font-bold ${colorClasses[color]}`}>
            {value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </div>
          {trend && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-xs text-muted-foreground">{trendValue}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
