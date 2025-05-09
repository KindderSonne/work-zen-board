
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">WorkFlow</h1>
        <p className="text-muted-foreground">Đang chuyển hướng...</p>
      </div>
    </div>
  );
};

export default Index;
