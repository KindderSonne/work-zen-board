
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Calendar, 
  CheckSquare, 
  Home, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Users, 
  ChevronLeft,
  ChevronRight,
  BarChart
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center py-2 px-3 mb-1 rounded-md font-medium transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      <span className="mr-3">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  );
};

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  if (!currentUser) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-sidebar h-screen flex flex-col transition-all",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <div className="text-sidebar-foreground font-bold text-lg">WorkFlow</div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex items-center p-4">
        <Avatar className="h-9 w-9">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>
            {currentUser.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="ml-3 text-sidebar-foreground">
            <p className="font-medium text-sm">{currentUser.name}</p>
            <p className="text-xs opacity-75">{currentUser.email}</p>
          </div>
        )}
      </div>

      <div className="flex-1 px-2 py-4 flex flex-col">
        <SidebarLink
          to="/dashboard"
          icon={<Home size={20} />}
          label="Tổng quan"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/tasks"
          icon={<CheckSquare size={20} />}
          label="Công việc cá nhân"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/calendar"
          icon={<Calendar size={20} />}
          label="Lịch"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/projects"
          icon={<LayoutDashboard size={20} />}
          label="Dự án"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/reports"
          icon={<BarChart size={20} />}
          label="Báo cáo"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/team"
          icon={<Users size={20} />}
          label="Nhóm làm việc"
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          to="/settings"
          icon={<Settings size={20} />}
          label="Cài đặt"
          isCollapsed={isCollapsed}
        />
      </div>

      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={logout}
        >
          <LogOut className="mr-2" size={18} />
          {!isCollapsed && "Đăng xuất"}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
