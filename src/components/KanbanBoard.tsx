
import React, { useState } from "react";
import { Task, User } from "@/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useData } from "@/contexts/DataContext";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: () => void;
  projectId?: string;
}

type DragItem = {
  taskId: string;
  sourceStatus: string;
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskClick,
  onAddTask,
  projectId
}) => {
  const { updateTask } = useData();
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  
  const columns = [
    { id: "todo", title: "Cần làm" },
    { id: "in_progress", title: "Đang làm" },
    { id: "review", title: "Đang xem xét" },
    { id: "done", title: "Hoàn thành" }
  ];

  const handleDragStart = (taskId: string, status: string) => {
    setDraggedItem({ taskId, sourceStatus: status });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const task = tasks.find(t => t.id === draggedItem.taskId);
    if (!task || task.status === targetStatus) return;
    
    const updatedTask = { ...task, status: targetStatus as any };
    updateTask(updatedTask);
  };
  
  return (
    <div className="flex gap-4 overflow-x-auto p-1 pb-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);
        
        return (
          <div
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sm">
                {column.title} ({columnTasks.length})
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                onClick={onAddTask}
              >
                <Plus size={16} />
              </Button>
            </div>
            
            <div className="space-y-2">
              {columnTasks.map((task) => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id, task.status)}
                >
                  <TaskCard 
                    task={task} 
                    onClick={() => onTaskClick(task)}
                    className={cn(
                      draggedItem?.taskId === task.id 
                        ? "opacity-50"
                        : "opacity-100"
                    )}
                    isDraggable
                  />
                </div>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-400">
                  Kéo thả công việc vào đây
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
