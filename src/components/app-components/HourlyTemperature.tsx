import { Forecast, ForecastResponse } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

export const HourlyTemperature = (data: ForecastResponse) => {
  const chartData = data.list.slice(0, 8).map((item: Forecast) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={400} height={400} data={chartData}>
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload) {
                    return (
                      <div className="p-2 shadow-md bg-background rounded-lg border">
                        <p className="text-sm font-semibold text-muted-foreground">
                          {payload[0].payload.time}
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          Temp: {payload[0].payload.temp}°
                        </p>
                        <p className="text-sm font-semibold text-muted-foreground">
                          Feels Like: {payload[0].payload.feels_like}°
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#8884d8"
                dot={false}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#82ca9d"
                dot={false}
                strokeWidth={2}
                strokeDasharray={"5 5"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
