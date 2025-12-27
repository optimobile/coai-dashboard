import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { ComplianceTrendChart } from "@/components/analytics/ComplianceTrendChart";
import { MetricsCard } from "@/components/analytics/MetricsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface Metrics {
  averageScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  compliantCount: number;
  nonCompliantCount: number;
  trendDirection: "improving" | "declining" | "stable";
}

interface FrameworkComparison {
  framework: string;
  averageScore: number;
  systemsAssessed: number;
  compliantPercentage: number;
}

export const Analytics: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => translations[language][key] || key;

  const [isLoading, setIsLoading] = useState(true);
  const [selectedFramework, setSelectedFramework] = useState("EU AI Act");
  const [metrics, setMetrics] = useState<Metrics>({
    averageScore: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    compliantCount: 0,
    nonCompliantCount: 0,
    trendDirection: "stable",
  });
  const [frameworkComparison, setFrameworkComparison] = useState<FrameworkComparison[]>([]);
  const [trendData, setTrendData] = useState([]);

  // Mock data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Mock metrics
      setMetrics({
        averageScore: 78,
        highRiskCount: 5,
        mediumRiskCount: 12,
        lowRiskCount: 23,
        compliantCount: 28,
        nonCompliantCount: 12,
        trendDirection: "improving",
      });

      // Mock framework comparison
      setFrameworkComparison([
        {
          framework: "EU AI Act",
          averageScore: 82,
          systemsAssessed: 15,
          compliantPercentage: 87,
        },
        {
          framework: "NIST AI RMF",
          averageScore: 76,
          systemsAssessed: 12,
          compliantPercentage: 75,
        },
        {
          framework: "TC260",
          averageScore: 71,
          systemsAssessed: 10,
          compliantPercentage: 60,
        },
      ]);

      // Mock trend data
      setTrendData([
        { date: "2024-01-01", score: 72 },
        { date: "2024-01-08", score: 74 },
        { date: "2024-01-15", score: 75 },
        { date: "2024-01-22", score: 77 },
        { date: "2024-01-29", score: 78 },
      ]);

      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedFramework]);

  const getTrendColor = (trend: string) => {
    if (trend === "improving") return "success";
    if (trend === "declining") return "danger";
    return "default";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("analytics")}</h1>
          <p className="text-muted-foreground mt-1">{t("complianceTrends")}</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedFramework} onValueChange={setSelectedFramework}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EU AI Act">EU AI Act</SelectItem>
              <SelectItem value="NIST AI RMF">NIST AI RMF</SelectItem>
              <SelectItem value="TC260">TC260</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title={t("averageScore")}
          value={metrics.averageScore}
          unit="%"
          trend={metrics.trendDirection === "improving" ? "up" : metrics.trendDirection === "declining" ? "down" : "stable"}
          trendValue={5}
          icon={<TrendingUp className="w-4 h-4" />}
          color={getTrendColor(metrics.trendDirection) as any}
          isLoading={isLoading}
        />
        <MetricsCard
          title={t("highRisk")}
          value={metrics.highRiskCount}
          icon={<AlertTriangle className="w-4 h-4" />}
          color="danger"
          isLoading={isLoading}
        />
        <MetricsCard
          title={t("compliant")}
          value={metrics.compliantCount}
          icon={<CheckCircle className="w-4 h-4" />}
          color="success"
          isLoading={isLoading}
        />
        <MetricsCard
          title={t("nonCompliant")}
          value={metrics.nonCompliantCount}
          icon={<Clock className="w-4 h-4" />}
          color="warning"
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Trend */}
        <ComplianceTrendChart
          data={trendData.map((item) => ({
            date: item.date,
            score: item.score,
            framework: selectedFramework,
            systemCount: 1,
          }))}
          isLoading={isLoading}
          chartType="area"
        />

        {/* Framework Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>{t("framework")}</CardTitle>
            <CardDescription>Average compliance scores by framework</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frameworkComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="framework" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="averageScore" fill="hsl(var(--primary))" name={t("averageScore")} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{t("riskDistribution")}</CardTitle>
          <CardDescription>Distribution of systems by risk level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{metrics.highRiskCount}</div>
              <div className="text-sm text-muted-foreground mt-1">{t("highRisk")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{metrics.mediumRiskCount}</div>
              <div className="text-sm text-muted-foreground mt-1">{t("mediumRisk")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.lowRiskCount}</div>
              <div className="text-sm text-muted-foreground mt-1">{t("lowRisk")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button>{t("generateReport")}</Button>
        <Button variant="outline">{t("export")}</Button>
      </div>
    </div>
  );
};
