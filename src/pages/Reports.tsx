
import React, { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "recharts";
import { BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Download } from "lucide-react";
import { useData } from "@/contexts/DataContext";

const Reports = () => {
  const { projects, personalTasks } = useData();
  
  const allTasks = useMemo(() => {
    const projectTasks = projects.flatMap(project => project.tasks);
    return [...personalTasks, ...projectTasks];
  }, [projects, personalTasks]);

  // Process data for charts
  const tasksByStatus = useMemo(() => {
    const statusCounts = {
      todo: 0,
      in_progress: 0,
      review: 0,
      done: 0
    };
    
    allTasks.forEach(task => {
      statusCounts[task.status]++;
    });
    
    return [
      { name: "Cần làm", value: statusCounts.todo, fill: "#94a3b8" },
      { name: "Đang làm", value: statusCounts.in_progress, fill: "#60a5fa" },
      { name: "Xem xét", value: statusCounts.review, fill: "#c084fc" },
      { name: "Hoàn thành", value: statusCounts.done, fill: "#4ade80" }
    ];
  }, [allTasks]);
  
  const tasksByPriority = useMemo(() => {
    const priorityCounts = {
      low: 0,
      medium: 0,
      high: 0
    };
    
    allTasks.forEach(task => {
      priorityCounts[task.priority]++;
    });
    
    return [
      { name: "Thấp", value: priorityCounts.low, fill: "#60a5fa" },
      { name: "Trung bình", value: priorityCounts.medium, fill: "#fbbf24" },
      { name: "Cao", value: priorityCounts.high, fill: "#f87171" }
    ];
  }, [allTasks]);

  const tasksByProject = useMemo(() => {
    const projectCounts = {};
    
    projects.forEach(project => {
      projectCounts[project.title] = project.tasks.length;
    });
    
    return Object.entries(projectCounts).map(([name, value], index) => ({
      name,
      value,
      fill: `hsl(${index * 40}, 70%, 60%)`
    }));
  }, [projects]);

  // Weekly activity data
  const weeklyActivity = [
    { name: "T2", tasks: 5 },
    { name: "T3", tasks: 8 },
    { name: "T4", tasks: 12 },
    { name: "T5", tasks: 7 },
    { name: "T6", tasks: 10 },
    { name: "T7", tasks: 3 },
    { name: "CN", tasks: 0 }
  ];

  // Project progress data
  const projectProgress = projects.map(project => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === "done").length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      name: project.title.substring(0, 15) + (project.title.length > 15 ? "..." : ""),
      hoàn_thành: Math.round(progress),
      chưa_hoàn_thành: 100 - Math.round(progress)
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Báo cáo</h1>
          <p className="text-muted-foreground">
            Thống kê và báo cáo về tình hình dự án và công việc
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Xuất báo cáo
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="projects">Dự án</TabsTrigger>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">
                    Tổng quan trạng thái
                  </CardTitle>
                  <CardDescription>
                    Phân bổ trạng thái công việc
                  </CardDescription>
                </div>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  {tasksByStatus.length > 0 ? (
                    <PieChart width={250} height={200} data={tasksByStatus}>
                      <pie
                        data={tasksByStatus}
                        cx={120}
                        cy={100}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                    </PieChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">
                    Mức độ ưu tiên
                  </CardTitle>
                  <CardDescription>
                    Phân bổ theo độ ưu tiên
                  </CardDescription>
                </div>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  {tasksByPriority.length > 0 ? (
                    <PieChart width={250} height={200} data={tasksByPriority}>
                      <pie
                        data={tasksByPriority}
                        cx={120}
                        cy={100}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      />
                    </PieChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">
                    Công việc theo dự án
                  </CardTitle>
                  <CardDescription>
                    Số lượng công việc trong mỗi dự án
                  </CardDescription>
                </div>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  {tasksByProject.length > 0 ? (
                    <BarChart
                      width={250}
                      height={200}
                      data={tasksByProject}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <xAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <yAxis allowDecimals={false} />
                      <tooltip />
                      <bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-base">
                  Hoạt động trong tuần
                </CardTitle>
                <CardDescription>
                  Số lượng công việc được tạo/cập nhật theo ngày
                </CardDescription>
              </div>
              <LineChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  width={800}
                  height={300}
                  data={weeklyActivity}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <xAxis dataKey="name" />
                  <yAxis allowDecimals={false} />
                  <tooltip />
                  <line type="monotone" dataKey="tasks" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-0.5">
                <CardTitle className="text-base">
                  Tiến độ dự án
                </CardTitle>
                <CardDescription>
                  Tỉ lệ hoàn thành của các dự án
                </CardDescription>
              </div>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                {projectProgress.length > 0 ? (
                  <BarChart
                    width={800}
                    height={400}
                    data={projectProgress}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <xAxis type="number" domain={[0, 100]} />
                    <yAxis dataKey="name" type="category" width={150} />
                    <tooltip />
                    <bar dataKey="hoàn_thành" stackId="a" fill="#4ade80" name="Hoàn thành" />
                    <bar dataKey="chưa_hoàn_thành" stackId="a" fill="#e5e7eb" name="Chưa hoàn thành" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Không có dữ liệu
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">
                    Tổng hợp công việc
                  </CardTitle>
                  <CardDescription>
                    Phân loại theo trạng thái
                  </CardDescription>
                </div>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    width={350}
                    height={300}
                    data={tasksByStatus}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <xAxis dataKey="name" />
                    <yAxis allowDecimals={false} />
                    <tooltip />
                    <bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-0.5">
                  <CardTitle className="text-base">
                    Công việc theo mức độ ưu tiên
                  </CardTitle>
                  <CardDescription>
                    Phân loại theo độ ưu tiên
                  </CardDescription>
                </div>
                <BarChartIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <BarChart
                    width={350}
                    height={300}
                    data={tasksByPriority}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <xAxis dataKey="name" />
                    <yAxis allowDecimals={false} />
                    <tooltip />
                    <bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
