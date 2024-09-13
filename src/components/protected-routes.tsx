import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const user = auth.currentUser;
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoutes;
