
import React, { useState } from "react";
import { Task, User, Comment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  MessageSquare, 
  Flag, 
  Clock, 
  Edit, 
  Trash2, 
  Send 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const priorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const statusLabels = {
  todo: "Cần làm",
  in_progress: "Đang làm",
  review: "Đang xem xét",
  done: "Hoàn thành",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  review: "bg-purple-100 text-purple-800",
  done: "bg-green-100 text-green-800",
};

export const TaskDetail: React.FC<TaskDetailProps> = ({
  task,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [comment, setComment] = useState("");
  const { currentUser } = useAuth();
  const { addTaskComment } = useData();
  
  const handleSubmitComment = () => {
    if (comment.trim()) {
      addTaskComment(task.id, comment);
      setComment("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold">{task.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={statusColors[task.status]}>
              {statusLabels[task.status]}
            </Badge>
            <Badge className={priorityColors[task.priority]}>
              {priorityLabels[task.priority]}
            </Badge>
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm">
            Hạn hoàn thành: {new Date(task.dueDate).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span className="text-sm">
            Cập nhật: {formatDistanceToNow(new Date(task.updatedAt), { 
              addSuffix: true, 
              locale: vi 
            })}
          </span>
        </div>
      </div>

      {task.assignedTo && (
        <div className="flex items-center mb-4">
          <span className="text-sm mr-2">Giao cho:</span>
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
            <AvatarFallback>
              {task.assignedTo.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{task.assignedTo.name}</span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Mô tả</h3>
        <div className="p-3 bg-gray-50 rounded-md text-sm">
          {task.description}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Bình luận
        </h3>

        <div className="space-y-3">
          {task.comments && task.comments.length > 0 ? (
            task.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.createdBy.avatar} alt={comment.createdBy.name} />
                  <AvatarFallback>
                    {comment.createdBy.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-md p-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">
                        {comment.createdBy.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { 
                          addSuffix: true, 
                          locale: vi 
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">Chưa có bình luận nào</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t flex gap-2 items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
          <AvatarFallback>
            {currentUser?.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Input
          placeholder="Thêm bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
          className="flex-1"
        />
        <Button size="sm" onClick={handleSubmitComment}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};
