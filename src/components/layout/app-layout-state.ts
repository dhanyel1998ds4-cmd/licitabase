import { createContext, useContext } from "react";

type AppLayoutState = {
  sidebarCollapsed: boolean;
};

export const AppLayoutStateContext = createContext<AppLayoutState>({
  sidebarCollapsed: false,
});

export function useAppLayoutState() {
  return useContext(AppLayoutStateContext);
}
