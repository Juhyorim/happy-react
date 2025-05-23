import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      username: null,
      nickname: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 로그인
      login: async (loginId, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/login`, {
            username: loginId,
            password: password,
          });
          const { token, username, email, nickname } = response.data;

          // axios 기본 헤더에 토큰 설정
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            token,
            username,
            email,
            nickname,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.log(error);
          set({
            error: error.response?.data?.message || "로그인 실패",
            isLoading: false,
          });
          return false;
        }
      },

      // 회원가입
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/join`, {
            nickname: name,
            username: email,
            password: password,
            email: email,
            signupKey: "1234",
          });

          const { token } = response.data;

          // axios 기본 헤더에 토큰 설정
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.log(error);
          set({
            error: error.response?.data?.message || "회원가입 실패",
            isLoading: false,
          });
          return false;
        }
      },

      // 로그아웃
      logout: () => {
        // axios 헤더에서 토큰 제거
        delete axios.defaults.headers.common["Authorization"];

        set({
          token: null,
          username: null,
          nickname: null,
          email: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
