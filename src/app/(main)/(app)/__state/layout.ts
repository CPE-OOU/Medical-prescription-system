import { create } from 'zustand';

interface LayoutStore {
  sidebarCollapse?: boolean;
  setSidebarCollapse: (collapse: boolean) => void;
}

const useLayoutStore = create<LayoutStore>((set) => ({
  sidebarCollapse: false,
  setSidebarCollapse: (collapse) => {
    set({ sidebarCollapse: collapse });
  },
}));

export { useLayoutStore };
