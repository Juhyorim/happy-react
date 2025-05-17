// 2. 인증 스토어 (src/stores/authStore.js)
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = "http://localhost:8080/api/v1"; // 실제 백엔드 API URL로 변경 필요

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // 로그인 액션
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/login`, {
            username: email,
            password: password,
          });
          const { token, user } = response.data;

          // axios 기본 헤더에 토큰 설정
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || "로그인 실패",
            isLoading: false,
          });
          return false;
        }
      },

      // 회원가입 액션
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

          const { token, user } = response.data;

          // axios 기본 헤더에 토큰 설정
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          set({
            token,
            user,
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

      // 로그아웃 액션
      logout: () => {
        // axios 헤더에서 토큰 제거
        delete axios.defaults.headers.common["Authorization"];

        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      // 사용자 정보 가져오기
      fetchUserProfile: async () => {
        const { token } = get();
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await axios.get(`${API_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: response.data, isLoading: false });
        } catch (error) {
          if (error.response?.status === 401) {
            // 토큰이 유효하지 않은 경우 로그아웃
            get().logout();
          }
          set({
            error: error.response?.data?.message || "프로필 조회 실패",
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage에 저장될 키 이름
      getStorage: () => localStorage, // localStorage 사용
    }
  )
);

export default useAuthStore;
