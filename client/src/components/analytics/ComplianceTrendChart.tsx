import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface TrendData {
  date: string;
  score: number;
  framework: string;
  systemCount: number;
}

interface ComplianceTrendChartProps {
  data: TrendData[];
  isLoading?: boolean;
  chartType?: "line" | "area";
}

export const ComplianceTrendChart: React.FC<ComplianceTrendChartProps> = ({
  data,
  isLoading = false,
  chartType = "line",
}) => {
  const { language } = useLanguage();
  const t = (key: string) => translations[language][key] || key;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("complianceTrends")}</CardTitle>
          <CardDescription>{t("loading")}</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">{t("loading")}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("complianceTrends")}</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-muted-foreground">{t("noData")}</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString(language),
    score: Math.round(item.score),
    systemCount: item.systemCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("complianceTrends")}</CardTitle>
        <CardDescription>
          {data.length} {t("loading").includes("...") ? "data points" : "records"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "area" ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorScore)"
                name={t("averageScore")}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", r: 4 }}
                activeDot={{ r: 6 }}
                name={t("averageScore")}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
