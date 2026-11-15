import { Outlet } from "react-router-dom";
import BottomTabBar from "@/components/BottomTabBar";

export default function TabLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  );
}