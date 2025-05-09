
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useData } from "@/contexts/DataContext";
import { Search, User, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Team = () => {
  const { projects } = useData();
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Get all unique users from projects
  const allUsers = React.useMemo(() => {
    const uniqueUsers = new Map();
    
    projects.forEach(project => {
      project.members.forEach(member => {
        uniqueUsers.set(member.id, member);
      });
    });
    
    return Array.from(uniqueUsers.values());
  }, [projects]);
  
  // Filter users based on search query
  const filteredUsers = React.useMemo(() => {
    if (!searchQuery) return allUsers;
    
    const query = searchQuery.toLowerCase();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    );
  }, [allUsers, searchQuery]);
  
  // Find projects for each user
  const getUserProjects = (userId: string) => {
    return projects.filter(project => 
      project.members.some(member => member.id === userId)
    );
  };
  
  const handleContact = (email: string) => {
    toast.success(`Đã mở tin nhắn tới ${email}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Nhóm làm việc</h1>
        <p className="text-muted-foreground">
          Thành viên trong các dự án của bạn
        </p>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Tìm kiếm thành viên..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => {
          const userProjects = getUserProjects(user.id);
          
          return (
            <Card key={user.id} className="overflow-hidden">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-2">{user.name}</CardTitle>
                <CardDescription>Nhân viên</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>098765432{user.id}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Thành phố Hồ Chí Minh, Việt Nam</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Dự án tham gia ({userProjects.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {userProjects.slice(0, 3).map(project => (
                      <span 
                        key={project.id} 
                        className="text-xs bg-secondary py-1 px-2 rounded-full"
                      >
                        {project.title.length > 15 
                          ? project.title.substring(0, 15) + "..." 
                          : project.title}
                      </span>
                    ))}
                    {userProjects.length > 3 && (
                      <span className="text-xs bg-muted py-1 px-2 rounded-full">
                        +{userProjects.length - 3} dự án khác
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleContact(user.email)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Nhắn tin
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        
        {filteredUsers.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">
              Không tìm thấy thành viên nào khớp với từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;
