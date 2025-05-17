import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import axios from "axios";
import useAuthStore from "./stores/authStore";
import { useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";

function App() {
  const { token, isAuthenticated, fetchUserProfile } = useAuthStore();

  useEffect(() => {
    // 페이지 로드 시 토큰이 있다면 axios 헤더에 설정
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // 사용자 정보 가져오기
      fetchUserProfile();
    }
  }, [token, fetchUserProfile]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
