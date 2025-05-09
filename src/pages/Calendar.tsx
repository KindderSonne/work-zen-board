
import React, { useMemo, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskDetail } from "@/components/TaskDetail";
import { TaskForm } from "@/components/TaskForm";
import { useData } from "@/contexts/DataContext";
import { Task } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const CalendarView = () => {
  const { personalTasks, projects, addTask, updateTask, deleteTask } = useData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Combine all tasks
  const allTasks = useMemo(() => {
    const projectTasks = projects.flatMap(project => project.tasks);
    return [...personalTasks, ...projectTasks];
  }, [projects, personalTasks]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    allTasks.forEach(task => {
      const dateKey = task.dueDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(task);
    });
    
    return grouped;
  }, [allTasks]);

  // Filter tasks for selected date
  const selectedDateTasks = useMemo(() => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    return tasksByDate[dateKey] || [];
  }, [tasksByDate, selectedDate]);

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  // Calculate days with tasks for calendar highlighting
  const daysWithTasks = useMemo(() => {
    return Object.keys(tasksByDate).map(dateStr => new Date(dateStr));
  }, [tasksByDate]);

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments">) => {
    addTask(taskData);
    setIsAddDialogOpen(false);
  };

  const handleEditTask = (taskData: Task) => {
    updateTask(taskData);
    setIsEditDialogOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setIsDeleteDialogOpen(false);
      setIsDetailDialogOpen(false);
      setSelectedTask(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lịch công việc</h1>
        <p className="text-muted-foreground">
          Xem tất cả các công việc theo ngày
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lịch</CardTitle>
            <CardDescription>
              Chọn một ngày để xem công việc
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
              modifiers={{
                hasTasks: daysWithTasks,
              }}
              modifiersStyles={{
                hasTasks: { 
                  fontWeight: 'bold', 
                  backgroundColor: 'rgba(99, 102, 241, 0.1)'
                }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Công việc: {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}</CardTitle>
              <CardDescription>
                {selectedDateTasks.length > 0
                  ? `${selectedDateTasks.length} công việc cho ngày này`
                  : "Không có công việc nào"
                }
              </CardDescription>
            </div>
            <Button onClick={() => {
              setIsAddDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm
            </Button>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-white rounded-md border border-gray-100 cursor-pointer hover:shadow-sm"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailDialogOpen(true);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate" title={task.title}>{task.title}</h3>
                      <Badge className={cn("ml-2", priorityColors[task.priority])}>
                        {task.priority === "low" ? "Thấp" : task.priority === "medium" ? "Trung bình" : "Cao"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 truncate">{task.description}</p>
                    {task.projectId && (
                      <Badge variant="outline" className="mt-2">
                        {projects.find(p => p.id === task.projectId)?.title || "Dự án"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Không có công việc nào cho ngày này
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog chi tiết công việc */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedTask && (
            <TaskDetail
              task={selectedTask}
              onClose={() => setIsDetailDialogOpen(false)}
              onEdit={() => {
                setIsDetailDialogOpen(false);
                setIsEditDialogOpen(true);
              }}
              onDelete={() => setIsDeleteDialogOpen(true)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog thêm công việc */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <CardTitle className="mb-4">Thêm công việc mới</CardTitle>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddDialogOpen(false)}
            initialData={{
              dueDate: selectedDate.toISOString().split('T')[0]
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa công việc */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <CardTitle className="mb-4">Chỉnh sửa công việc</CardTitle>
          {selectedTask && (
            <TaskForm
              onSubmit={handleEditTask}
              onCancel={() => setIsEditDialogOpen(false)}
              initialData={selectedTask}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Công việc sẽ bị xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CalendarView;
