
import React, { useMemo, useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/TaskForm";
import { TaskDetail } from "@/components/TaskDetail";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useData } from "@/contexts/DataContext";
import { Task } from "@/types";
import { Grid, List, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const Tasks = () => {
  const { personalTasks, addTask, updateTask, deleteTask } = useData();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return personalTasks;
    
    const query = searchQuery.toLowerCase();
    return personalTasks.filter(
      task => 
        task.title.toLowerCase().includes(query) || 
        task.description.toLowerCase().includes(query)
    );
  }, [personalTasks, searchQuery]);

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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Công việc cá nhân</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách công việc cá nhân của bạn
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm công việc
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Tìm kiếm công việc..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(viewMode === "list" && "bg-muted")}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(viewMode === "grid" && "bg-muted")}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredTasks.length > 0 ? (
        <div className={cn(
          "grid gap-4",
          viewMode === "grid" 
            ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
            : "grid-cols-1"
        )}>
          {filteredTasks.map((task) => (
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
            {searchQuery 
              ? "Không tìm thấy công việc nào khớp với từ khóa tìm kiếm." 
              : "Bạn chưa có công việc nào. Bắt đầu bằng cách thêm công việc mới."}
          </p>
        </div>
      )}

      {/* Dialog thêm công việc */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm công việc mới</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

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

      {/* Dialog chỉnh sửa công việc */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa công việc</DialogTitle>
          </DialogHeader>
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

export default Tasks;
