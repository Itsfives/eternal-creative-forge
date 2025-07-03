
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, DollarSign, BarChart3 } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";

const AdminStats = () => {
  const stats = [
    {
      title: "Total Users",
      value: 156,
      change: "+12% from last month",
      icon: Users,
      color: "text-seagram-green"
    },
    {
      title: "Active Projects",
      value: 23,
      change: "+3 new this week",
      icon: Activity,
      color: "text-violet-purple"
    },
    {
      title: "Revenue",
      value: 45230,
      prefix: "$",
      change: "+18% from last month",
      icon: DollarSign,
      color: "text-seagram-green"
    },
    {
      title: "System Health",
      value: 99,
      suffix: "%",
      change: "All systems operational",
      icon: BarChart3,
      color: "text-green-600"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.prefix}
              <AnimatedCounter end={stat.value} />
              {stat.suffix}
            </div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
