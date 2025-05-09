
import React from "react";
import { useForm } from "react-hook-form";
import { Project, User } from "@/types";
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

interface ProjectFormProps {
  onSubmit: (data: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  initialData?: Partial<Project>;
  availableUsers: User[];
}

type FormData = {
  title: string;
  description: string;
  members: string[];
};

export const ProjectForm: React.FC<ProjectFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  availableUsers
}) => {
  const { register, handleSubmit, formState, setValue } = useForm<FormData>({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      members: initialData?.members?.map(m => m.id) || []
    }
  });

  const submitHandler = (data: FormData) => {
    const selectedMembers = availableUsers.filter(user => 
      data.members.includes(user.id)
    );

    onSubmit({
      title: data.title,
      description: data.description,
      members: selectedMembers,
      tasks: initialData?.tasks || [],
      createdBy: initialData?.createdBy || ""
    });
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Tên dự án
        </label>
        <Input
          id="title"
          placeholder="Nhập tên dự án"
          {...register("title", { required: true })}
        />
        {formState.errors.title && (
          <p className="text-red-500 text-xs mt-1">Vui lòng nhập tên dự án</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Mô tả
        </label>
        <Textarea
          id="description"
          placeholder="Mô tả chi tiết về dự án"
          rows={4}
          {...register("description", { required: true })}
        />
        {formState.errors.description && (
          <p className="text-red-500 text-xs mt-1">Vui lòng nhập mô tả dự án</p>
        )}
      </div>

      <div>
        <label htmlFor="members" className="block text-sm font-medium mb-1">
          Thành viên
        </label>
        <Select
          defaultValue={initialData?.members?.map(m => m.id) || []}
          onValueChange={(value) => setValue("members", value.split(','))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn thành viên" />
          </SelectTrigger>
          <SelectContent>
            {availableUsers.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData?.id ? "Cập nhật" : "Tạo dự án"}
        </Button>
      </div>
    </form>
  );
};
