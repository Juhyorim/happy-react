import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
