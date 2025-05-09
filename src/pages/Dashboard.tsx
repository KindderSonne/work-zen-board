
import React, { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { TaskCard } from "@/components/TaskCard";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  Calendar,
  AlertTriangle,
  BarChart,
  ListTodo,
  CheckCheck,
  Layers
} from "lucide-react";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { projects, personalTasks } = useData();
  const navigate = useNavigate();

  const allTasks = useMemo(() => {
    const projectTasks = projects.flatMap(project => project.tasks);
    return [...personalTasks, ...projectTasks];
  }, [projects, personalTasks]);

  const todoTasks = allTasks.filter(task => task.status === "todo");
  const inProgressTasks = allTasks.filter(task => task.status === "in_progress");
  const completedTasks = allTasks.filter(task => task.status === "done");

  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return allTasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= nextWeek && task.status !== "done";
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [allTasks]);

  const projectsCount = projects.length;
  const tasksCount = allTasks.length;

  const completionRate = useMemo(() => {
    if (tasksCount === 0) return "0%";
    return `${Math.round((completedTasks.length / tasksCount) * 100)}%`;
  }, [completedTasks, tasksCount]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xin chào, {currentUser?.name}</h1>
          <p className="text-muted-foreground">
            Dưới đây là thông tin tổng quan về công việc của bạn
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Dự án"
          value={projectsCount}
          icon={<Layers />}
        />
        <StatsCard
          title="Tổng công việc"
          value={tasksCount}
          icon={<CheckSquare />}
        />
        <StatsCard
          title="Đang thực hiện"
          value={inProgressTasks.length}
          icon={<Clock />}
        />
        <StatsCard
          title="Hoàn thành"
          value={completionRate}
          icon={<BarChart />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <AlertTriangle size={18} className="mr-2 text-yellow-500" />
                  Sắp đến hạn
                </CardTitle>
                <CardDescription>
                  Những công việc sẽ đến hạn trong 7 ngày tới
                </CardDescription>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-2">
                {upcomingDeadlines.slice(0, 5).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => navigate(task.projectId ? `/projects/${task.projectId}` : "/tasks")}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                Không có công việc nào đến hạn trong tuần tới.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiến độ</CardTitle>
            <CardDescription>Tổng quan công việc</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <ListTodo className="h-4 w-4 mr-1 text-gray-500" />
                  <span>Cần làm</span>
                </div>
                <span className="font-medium">{todoTasks.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="bg-gray-400 h-full rounded-full" 
                  style={{ width: `${(todoTasks.length / Math.max(tasksCount, 1)) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-blue-500" />
                  <span>Đang thực hiện</span>
                </div>
                <span className="font-medium">{inProgressTasks.length}</span>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${(inProgressTasks.length / Math.max(tasksCount, 1)) * 100}%` }} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <CheckCheck className="h-4 w-4 mr-1 text-green-500" />
                  <span>Hoàn thành</span>
                </div>
                <span className="font-medium">{completedTasks.length}</span>
              </div>
              <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full" 
                  style={{ width: `${(completedTasks.length / Math.max(tasksCount, 1)) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
