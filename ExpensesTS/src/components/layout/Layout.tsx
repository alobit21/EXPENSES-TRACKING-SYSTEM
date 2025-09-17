import Sidebar from "./Sidebar"
import { SidebarItem } from "./Sidebar"
import { Home, BarChart, Settings, Tag, DollarSign, Receipt, Target } from "lucide-react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import UserNavbar from "./UserNavbar"

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem 
          icon={<Home size={20} />} 
          text="Dashboard" 
          active={location.pathname === "/dashboard"}
          onClick={() => navigate("/dashboard")}
        />
      

        <SidebarItem 
          icon={<Tag size={20} />} 
          text="Categories" 
          active={location.pathname === "/categories"}
          onClick={() => navigate("/categories")}
        />

      <SidebarItem 
        icon={<DollarSign size={20} />} 
        text="Incomes" 
        active={location.pathname === "/incomes"}
        onClick={() => navigate("/incomes")}
      />

      <SidebarItem 
        icon={<Receipt size={20} />} 
        text="Expenses" 
        active={location.pathname === "/expenses"}
        onClick={() => navigate("/expenses")}
      />
      <SidebarItem 
        icon={<Target size={20} />} 
        text="Goals" 
        active={location.pathname === "/goals"}
        onClick={() => navigate("/goals")}
      />

        <SidebarItem 
          icon={<BarChart size={20} />} 
          text="Reports" 
          active={location.pathname === "/reports"}
          onClick={() => navigate("/reports")}
        />
        <SidebarItem 
          icon={<Settings size={20} />} 
          text="Settings" 
          active={location.pathname === "/settings"}
          onClick={() => navigate("/settings")}
        />
      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50  overflow-y-auto">
      <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-1 bg-gray-50  overflow-y-auto">
        <Outlet /> {/* This is where the route's component renders */}
      </main>
    </div>
      </main>
    </div>
  )
}


