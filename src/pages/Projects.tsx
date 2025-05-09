
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectForm } from "@/components/ProjectForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { useData } from "@/contexts/DataContext";
import { Project } from "@/types";
import { Search, Plus, MoreHorizontal, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject } = useData();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const availableUsers = [
    { id: "1", name: "Nguyễn Văn A", email: "nguyenvana@example.com", avatar: "/placeholder.svg" },
    { id: "2", name: "Trần Thị B", email: "tranthib@example.com", avatar: "/placeholder.svg" },
    { id: "3", name: "Lê Văn C", email: "levanc@example.com", avatar: "/placeholder.svg" }
  ];

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProject = (projectData: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    addProject(projectData);
    setIsAddDialogOpen(false);
  };

  const handleEditProject = (projectData: Project) => {
    if (selectedProject) {
      updateProject({
        ...selectedProject,
        ...projectData,
      });
    }
    setIsEditDialogOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedProject) {
      deleteProject(selectedProject.id);
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    }
  };

  const TaskStatusSummary = ({ project }: { project: Project }) => {
    const total = project.tasks.length;
    const completed = project.tasks.filter(t => t.status === "done").length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return (
      <div className="mt-3">
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Tiến độ dự án</span>
          <span>{completed}/{total} ({percentage}%)</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dự án</h1>
          <p className="text-muted-foreground">
            Quản lý danh sách dự án của bạn
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> 
          Tạo dự án mới
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Tìm kiếm dự án..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="truncate" title={project.title}>
                    {project.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedProject(project);
                        setIsEditDialogOpen(true);
                      }}>
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setSelectedProject(project);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Xóa dự án
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="line-clamp-2" title={project.description}>
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <AvatarGroup>
                      {project.members.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="h-7 w-7 border-2 border-white">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="text-[10px]">
                            {member.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.members.length > 3 && (
                        <Avatar className="h-7 w-7 border-2 border-white">
                          <AvatarFallback className="text-[10px] bg-muted">
                            +{project.members.length - 3}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </AvatarGroup>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    <span>
                      {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true, locale: vi })}
                    </span>
                  </div>
                </div>
                
                <TaskStatusSummary project={project} />
              </CardContent>
              <CardFooter className="pt-1">
                <Button asChild className="w-full" variant="outline">
                  <Link to={`/projects/${project.id}`}>Xem chi tiết</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Không tìm thấy dự án nào khớp với từ khóa tìm kiếm." 
              : "Bạn chưa có dự án nào. Bắt đầu bằng cách tạo dự án mới."}
          </p>
        </div>
      )}

      {/* Dialog thêm dự án */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo dự án mới</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleAddProject}
            onCancel={() => setIsAddDialogOpen(false)}
            availableUsers={availableUsers}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa dự án */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa dự án</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <ProjectForm
              onSubmit={handleEditProject}
              onCancel={() => setIsEditDialogOpen(false)}
              initialData={selectedProject}
              availableUsers={availableUsers}
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
              Hành động này không thể hoàn tác. Dự án và tất cả các công việc thuộc dự án sẽ bị xóa vĩnh viễn.
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

export default Projects;
