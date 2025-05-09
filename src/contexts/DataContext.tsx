
import React, { createContext, useState, useContext, useEffect } from "react";
import { Project, Task, User } from "../types";
import { useAuth } from "./AuthContext";
import { toast } from "@/components/ui/sonner";

interface DataContextType {
  projects: Project[];
  personalTasks: Task[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addTaskComment: (taskId: string, content: string) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockUsers: User[] = [
  { id: "1", name: "Nguyễn Văn A", email: "nguyenvana@example.com", avatar: "/placeholder.svg" },
  { id: "2", name: "Trần Thị B", email: "tranthib@example.com", avatar: "/placeholder.svg" },
  { id: "3", name: "Lê Văn C", email: "levanc@example.com", avatar: "/placeholder.svg" }
];

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Hoàn thành báo cáo tháng",
    description: "Tạo báo cáo phân tích doanh số tháng 5",
    status: "todo",
    priority: "high",
    dueDate: "2025-05-15",
    createdBy: "1",
    createdAt: "2025-05-01T08:00:00Z",
    updatedAt: "2025-05-01T08:00:00Z",
  },
  {
    id: "2",
    title: "Chuẩn bị tài liệu đào tạo",
    description: "Soạn slide và tài liệu cho khóa đào tạo nhân viên mới",
    status: "in_progress",
    priority: "medium",
    dueDate: "2025-05-20",
    assignedTo: mockUsers[1],
    createdBy: "1",
    createdAt: "2025-05-02T10:30:00Z",
    updatedAt: "2025-05-02T10:30:00Z",
  },
  {
    id: "3",
    title: "Thiết kế giao diện người dùng",
    description: "Thiết kế UI cho tính năng mới của ứng dụng",
    status: "review",
    priority: "high",
    dueDate: "2025-05-12",
    assignedTo: mockUsers[2],
    projectId: "1",
    createdBy: "1",
    createdAt: "2025-05-03T09:15:00Z",
    updatedAt: "2025-05-03T09:15:00Z",
  },
  {
    id: "4",
    title: "Fix lỗi đăng nhập",
    description: "Sửa lỗi không thể đăng nhập trên thiết bị iOS",
    status: "done",
    priority: "high",
    dueDate: "2025-05-08",
    projectId: "1",
    createdBy: "1",
    createdAt: "2025-04-30T14:20:00Z",
    updatedAt: "2025-05-08T16:45:00Z",
  },
  {
    id: "5",
    title: "Tối ưu hiệu suất ứng dụng",
    description: "Phân tích và cải thiện tốc độ tải trang",
    status: "todo",
    priority: "medium",
    dueDate: "2025-05-25",
    projectId: "1",
    createdBy: "1",
    createdAt: "2025-05-04T11:00:00Z",
    updatedAt: "2025-05-04T11:00:00Z",
  },
  {
    id: "6",
    title: "Họp với khách hàng",
    description: "Thảo luận về yêu cầu cho dự án mới",
    status: "todo",
    priority: "high",
    dueDate: "2025-05-10",
    createdBy: "1",
    createdAt: "2025-05-05T13:30:00Z",
    updatedAt: "2025-05-05T13:30:00Z",
  }
];

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Phát triển Ứng dụng Quản lý Dự án",
    description: "Xây dựng ứng dụng quản lý dự án với các tính năng hiện đại",
    members: mockUsers,
    tasks: mockTasks.filter(task => task.projectId === "1"),
    createdBy: "1",
    createdAt: "2025-04-15T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  },
  {
    id: "2",
    title: "Thiết kế Website Công ty",
    description: "Thiết kế lại website công ty với giao diện mới",
    members: [mockUsers[0], mockUsers[1]],
    tasks: [],
    createdBy: "1",
    createdAt: "2025-05-01T00:00:00Z",
    updatedAt: "2025-05-01T00:00:00Z",
  }
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [personalTasks, setPersonalTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // Load projects and tasks from localStorage or use mock data
      const storedProjects = localStorage.getItem("projects");
      const storedTasks = localStorage.getItem("personalTasks");
      
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        setProjects(mockProjects);
        localStorage.setItem("projects", JSON.stringify(mockProjects));
      }
      
      if (storedTasks) {
        setPersonalTasks(JSON.parse(storedTasks));
      } else {
        const userTasks = mockTasks.filter(task => !task.projectId);
        setPersonalTasks(userTasks);
        localStorage.setItem("personalTasks", JSON.stringify(userTasks));
      }
    }
    setLoading(false);
  }, [currentUser]);

  const addProject = (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => {
    if (!currentUser) return;
    
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Dự án mới đã được tạo thành công!");
  };

  const updateProject = (project: Project) => {
    const updatedProjects = projects.map(p => p.id === project.id ? { ...project, updatedAt: new Date().toISOString() } : p);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Đã cập nhật dự án!");
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    toast.success("Đã xóa dự án!");
  };

  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    if (!currentUser) return;
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    if (task.projectId) {
      // Add to project
      const updatedProjects = projects.map(p => {
        if (p.id === task.projectId) {
          return {
            ...p,
            tasks: [...p.tasks, newTask],
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    } else {
      // Add to personal tasks
      const updatedTasks = [...personalTasks, newTask];
      setPersonalTasks(updatedTasks);
      localStorage.setItem("personalTasks", JSON.stringify(updatedTasks));
    }
    
    toast.success("Công việc mới đã được tạo!");
  };

  const updateTask = (task: Task) => {
    if (task.projectId) {
      // Update project task
      const updatedProjects = projects.map(p => {
        if (p.id === task.projectId) {
          return {
            ...p,
            tasks: p.tasks.map(t => t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t),
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    } else {
      // Update personal task
      const updatedTasks = personalTasks.map(t => 
        t.id === task.id ? { ...task, updatedAt: new Date().toISOString() } : t
      );
      
      setPersonalTasks(updatedTasks);
      localStorage.setItem("personalTasks", JSON.stringify(updatedTasks));
    }
    
    toast.success("Đã cập nhật công việc!");
  };

  const deleteTask = (id: string) => {
    // Check in personal tasks
    const personalTask = personalTasks.find(t => t.id === id);
    
    if (personalTask) {
      const updatedTasks = personalTasks.filter(t => t.id !== id);
      setPersonalTasks(updatedTasks);
      localStorage.setItem("personalTasks", JSON.stringify(updatedTasks));
    } else {
      // Check in projects
      const updatedProjects = projects.map(p => {
        const taskInProject = p.tasks.find(t => t.id === id);
        if (taskInProject) {
          return {
            ...p,
            tasks: p.tasks.filter(t => t.id !== id),
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
      
      setProjects(updatedProjects);
      localStorage.setItem("projects", JSON.stringify(updatedProjects));
    }
    
    toast.success("Đã xóa công việc!");
  };

  const addTaskComment = (taskId: string, content: string) => {
    if (!currentUser) return;
    
    const newComment = {
      id: Date.now().toString(),
      content,
      createdBy: currentUser,
      createdAt: new Date().toISOString()
    };

    // Check in personal tasks
    let taskFound = false;
    const updatedPersonalTasks = personalTasks.map(task => {
      if (task.id === taskId) {
        taskFound = true;
        return {
          ...task,
          comments: [...(task.comments || []), newComment],
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });
    
    if (taskFound) {
      setPersonalTasks(updatedPersonalTasks);
      localStorage.setItem("personalTasks", JSON.stringify(updatedPersonalTasks));
    } else {
      // Check in projects
      const updatedProjects = projects.map(project => {
        return {
          ...project,
          tasks: project.tasks.map(task => {
            if (task.id === taskId) {
              taskFound = true;
              return {
                ...task,
                comments: [...(task.comments || []), newComment],
                updatedAt: new Date().toISOString()
              };
            }
            return task;
          }),
          updatedAt: taskFound ? new Date().toISOString() : project.updatedAt
        };
      });
      
      if (taskFound) {
        setProjects(updatedProjects);
        localStorage.setItem("projects", JSON.stringify(updatedProjects));
      }
    }
    
    if (taskFound) {
      toast.success("Đã thêm bình luận!");
    }
  };

  return (
    <DataContext.Provider value={{
      projects,
      personalTasks,
      addProject,
      updateProject,
      deleteProject,
      addTask,
      updateTask,
      deleteTask,
      addTaskComment,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
