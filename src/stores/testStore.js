import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTestStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    {
      name: "test-storage",
      getStorage: () => {
        console.log("TEST: Using sessionStorage");
        return sessionStorage;
      },
    }
  )
);

export default useTestStore;
