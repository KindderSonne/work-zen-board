
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { TaskDetail } from "@/components/TaskDetail";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useData } from "@/contexts/DataContext";
import { Task } from "@/types";
import { Clock, Plus, Calendar, MessageSquare, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { projects, addTask, updateTask, deleteTask } = useData();
  const navigate = useNavigate();

  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [isTaskDetailDialogOpen, setIsTaskDetailDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [isDeleteTaskDialogOpen, setIsDeleteTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold mb-2">Dự án không tồn tại</h2>
        <p className="text-gray-500 mb-4">Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
        <Button onClick={() => navigate("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách dự án
        </Button>
      </div>
    );
  }

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments">) => {
    addTask({ ...taskData, projectId: project.id });
    setIsAddTaskDialogOpen(false);
  };

  const handleEditTask = (taskData: Task) => {
    updateTask(taskData);
    setIsEditTaskDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setIsDeleteTaskDialogOpen(false);
      setIsTaskDetailDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailDialogOpen(true);
  };

  // Chart data for project progress
  const taskStats = {
    total: project.tasks.length,
    completed: project.tasks.filter(t => t.status === "done").length,
    inProgress: project.tasks.filter(t => t.status === "in_progress").length,
    review: project.tasks.filter(t => t.status === "review").length,
    todo: project.tasks.filter(t => t.status === "todo").length,
  };

  const progressPercentage = taskStats.total > 0
    ? Math.round((taskStats.completed / taskStats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate("/projects")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-2/3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Thông tin dự án</CardTitle>
              <Badge className="bg-primary">
                {progressPercentage}% hoàn thành
              </Badge>
            </div>
            <CardDescription>
              Tổng quan về tiến độ và thành viên dự án
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm font-medium">Tạo bởi</div>
                <div className="text-sm text-gray-500">
                  {project.createdBy === "1" ? "Nguyễn Văn A" : project.createdBy}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Cập nhật</div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(project.updatedAt), {
                    addSuffix: true,
                    locale: vi
                  })}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Tổng công việc</div>
                <div className="text-sm text-gray-500">
                  {taskStats.total}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-sm">Tiến độ dự án</div>
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <div>Đã hoàn thành</div>
                    <div>{taskStats.completed}/{taskStats.total}</div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full rounded-full" 
                      style={{ width: `${progressPercentage}%` }} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-4">
                  <div className="border rounded p-2 text-center">
                    <div className="text-xs text-gray-500">Cần làm</div>
                    <div className="font-bold">{taskStats.todo}</div>
                  </div>
                  <div className="border rounded p-2 text-center">
                    <div className="text-xs text-gray-500">Đang làm</div>
                    <div className="font-bold">{taskStats.inProgress}</div>
                  </div>
                  <div className="border rounded p-2 text-center">
                    <div className="text-xs text-gray-500">Xem xét</div>
                    <div className="font-bold">{taskStats.review}</div>
                  </div>
                  <div className="border rounded p-2 text-center">
                    <div className="text-xs text-gray-500">Hoàn thành</div>
                    <div className="font-bold">{taskStats.completed}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="font-medium text-sm">Thành viên dự án</div>
              <div className="flex flex-wrap gap-2">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 border rounded-full pl-1 pr-3 py-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-[10px]">
                        {member.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader className="pb-2">
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các cập nhật mới nhất của dự án
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {project.tasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-start gap-2 pb-3 border-b">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={task.assignedTo?.avatar || "/placeholder.svg"} 
                    alt={task.assignedTo?.name || "User"} 
                  />
                  <AvatarFallback className="text-xs">
                    {task.assignedTo?.name.substring(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(task.updatedAt), { 
                          addSuffix: true, 
                          locale: vi 
                        })}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.status === "todo" ? "Cần làm" : 
                       task.status === "in_progress" ? "Đang làm" : 
                       task.status === "review" ? "Xem xét" : "Hoàn thành"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {project.tasks.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">
                Chưa có hoạt động nào
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="kanban">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">Danh sách</TabsTrigger>
          </TabsList>
          <Button onClick={() => setIsAddTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm công việc
          </Button>
        </div>

        <TabsContent value="kanban" className="p-0">
          {project.tasks.length > 0 ? (
            <KanbanBoard
              tasks={project.tasks}
              onTaskClick={handleTaskClick}
              onAddTask={() => setIsAddTaskDialogOpen(true)}
              projectId={project.id}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Dự án chưa có công việc nào. Bắt đầu bằng cách thêm công việc mới.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="p-0">
          {project.tasks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleTaskClick(task)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Dự án chưa có công việc nào. Bắt đầu bằng cách thêm công việc mới.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog thêm công việc */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm công việc mới</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddTaskDialogOpen(false)}
            projectId={project.id}
            members={project.members}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog chi tiết công việc */}
      <Dialog open={isTaskDetailDialogOpen} onOpenChange={setIsTaskDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTask && (
            <TaskDetail
              task={selectedTask}
              onClose={() => setIsTaskDetailDialogOpen(false)}
              onEdit={() => {
                setIsTaskDetailDialogOpen(false);
                setIsEditTaskDialogOpen(true);
              }}
              onDelete={() => setIsDeleteTaskDialogOpen(true)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa công việc */}
      <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa công việc</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <TaskForm
              onSubmit={handleEditTask}
              onCancel={() => setIsEditTaskDialogOpen(false)}
              initialData={selectedTask}
              projectId={project.id}
              members={project.members}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteTaskDialogOpen} onOpenChange={setIsDeleteTaskDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Công việc sẽ bị xóa vĩnh viễn khỏi dự án.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectDetail;
