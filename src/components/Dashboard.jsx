import React from "react";
import useAuthStore from "../stores/authStore";

function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="dashboard-container">
      <h2>대시보드</h2>
      <div className="user-info">
        <p>안녕하세요, {user?.name || "사용자"}님!</p>
        <p>이메일: {user?.email}</p>
      </div>
      <button onClick={logout} className="logout-btn">
        로그아웃
      </button>
    </div>
  );
}

export default Dashboard;
