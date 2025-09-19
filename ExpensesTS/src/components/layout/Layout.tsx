import { useState, useEffect, useRef } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { Menu,X } from "lucide-react"
import Sidebar from "./Sidebar"
import { SidebarItem } from "./Sidebar"
import { Home, BarChart, Settings, Tag, DollarSign, Receipt, Target } from "lucide-react"
import UserNavbar from "./UserNavbar"

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
const goTo = (path: string) => {
  navigate(path)
  setIsMobileOpen(false)
}

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsMobileOpen(false)
      }
    }

    if (isMobileOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileOpen])

  return (
    <div className="flex h-screen relative">
      {/* Hamburger menu for small screens */}
 
<button
  className="absolute top-6 left-4 z-50 md:hidden p-2 bg-white rounded shadow transition-all"
  onClick={() => setIsMobileOpen((prev) => !prev)}
>
  {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
</button>


      {/* Backdrop for mobile sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} ref={sidebarRef}>
        <SidebarItem icon={<Home size={20} />} text="Dashboard" active={location.pathname === "/app/dashboard"} onClick={() => goTo("/app/dashboard")} />
        <SidebarItem icon={<Tag size={20} />} text="Categories" active={location.pathname === "/app/categories"} onClick={() => goTo("/app/categories")} />
        <SidebarItem icon={<DollarSign size={20} />} text="Incomes" active={location.pathname === "/app/incomes"} onClick={() => goTo("/app/incomes")} />
        <SidebarItem icon={<Receipt size={20} />} text="Expenses" active={location.pathname === "/app/expenses"} onClick={() => goTo("/app/expenses")} />
        <SidebarItem icon={<Target size={20} />} text="Goals" active={location.pathname === "/app/goals"} onClick={() => goTo("/app/goals")} />
        <SidebarItem icon={<BarChart size={20} />} text="Reports" active={location.pathname === "/app/reports"} onClick={() => goTo("/app/reports")} />
        <SidebarItem icon={<Settings size={20} />} text="Settings" active={location.pathname === "/app/settings"} onClick={() => goTo("/app/settings")} />
      </Sidebar>


      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="flex flex-col min-h-screen">
          {/* Navbar is fixed now */}
          <UserNavbar />
          <main className="flex-1 bg-gray-50 overflow-y-auto pt-20">
            <Outlet />
          </main>
        </div>
      </main>

    </div>
  )
}
