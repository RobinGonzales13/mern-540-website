import { Navigate, Outlet } from "react-router-dom";

const POLRoute = () => {
  const token = localStorage.getItem("polToken");

  if (!token) {
    return <Navigate to="/pol-login" replace />;
  }

  return <Outlet />;
};

export default POLRoute; 