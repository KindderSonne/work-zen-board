
import React from "react";
import { useForm } from "react-hook-form";
import { Task, User } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface TaskFormProps {
  onSubmit: (data: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments">) => void;
  onCancel: () => void;
  initialData?: Partial<Task>;
  projectId?: string;
  members?: User[];
}

type FormData = {
  title: string;
  description: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  assignedTo?: string;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  projectId,
  members = []
}) => {
  const { register, handleSubmit, formState, setValue, watch } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      status: initialData?.status || "todo",
      priority: initialData?.priority || "medium",
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : new Date(),
      assignedTo: initialData?.assignedTo?.id || undefined
    }
  });

  const dueDate = watch("dueDate");

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setValue("dueDate", date);
    }
  };

  const submitHandler = (data: FormData) => {
    const assignedMember = data.assignedTo 
      ? members.find(m => m.id === data.assignedTo) 
      : undefined;

    onSubmit({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate.toISOString().split('T')[0],
      assignedTo: assignedMember,
      projectId,
      createdBy: initialData?.createdBy || ""
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Tiêu đề
        </label>
        <Input
          id="title"
          placeholder="Nhập tiêu đề công việc"
          {...register("title", { required: true })}
        />
        {formState.errors.title && (
          <p className="text-red-500 text-xs mt-1">Vui lòng nhập tiêu đề</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Mô tả
        </label>
        <Textarea
          id="description"
          placeholder="Mô tả chi tiết công việc"
          rows={3}
          {...register("description", { required: true })}
        />
        {formState.errors.description && (
          <p className="text-red-500 text-xs mt-1">Vui lòng nhập mô tả</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Trạng thái
          </label>
          <Select
            defaultValue={initialData?.status || "todo"}
            onValueChange={(value) => setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Cần làm</SelectItem>
              <SelectItem value="in_progress">Đang làm</SelectItem>
              <SelectItem value="review">Đang xem xét</SelectItem>
              <SelectItem value="done">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Ưu tiên
          </label>
          <Select
            defaultValue={initialData?.priority || "medium"}
            onValueChange={(value) => setValue("priority", value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ưu tiên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Thấp</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="high">Cao</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Hạn hoàn thành
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {members.length > 0 && (
          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium mb-1">
              Giao cho
            </label>
            <Select
              defaultValue={initialData?.assignedTo?.id}
              onValueChange={(value) => setValue("assignedTo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn thành viên" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData?.id ? "Cập nhật" : "Tạo công việc"}
        </Button>
      </div>
    </form>
  );
};
