
import React from "react";
import { Task, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, MessageSquare } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  className?: string;
  isDraggable?: boolean;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
};

const statusLabels = {
  todo: "Cần làm",
  in_progress: "Đang làm",
  review: "Đang xem xét",
  done: "Hoàn thành",
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  className,
  isDraggable = false 
}) => {
  const dueDateFormatted = new Date(task.dueDate).toLocaleDateString("vi-VN");
  const timeAgo = formatDistanceToNow(new Date(task.updatedAt), { 
    addSuffix: true,
    locale: vi 
  });

  return (
    <div 
      className={cn("task-card", className)} 
      onClick={onClick}
      draggable={isDraggable}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900 truncate" title={task.title}>
          {task.title}
        </h3>
        <Badge className={priorityColors[task.priority]}>
          {task.priority === "low" ? "Thấp" : 
           task.priority === "medium" ? "Trung bình" : "Cao"}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>{dueDateFormatted}</span>
        </div>
        
        {task.assignedTo && (
          <Avatar className="h-6 w-6">
            <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
            <AvatarFallback className="text-[10px]">
              {task.assignedTo.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
        <Badge variant="outline" className={cn("text-xs", statusColors[task.status])}>
          {statusLabels[task.status]}
        </Badge>
        
        <div className="flex items-center text-xs text-gray-500">
          {task.comments && task.comments.length > 0 && (
            <div className="flex items-center mr-2">
              <MessageSquare size={14} className="mr-1" />
              <span>{task.comments.length}</span>
            </div>
          )}
          <span>Cập nhật {timeAgo}</span>
        </div>
      </div>
    </div>
  );
};
