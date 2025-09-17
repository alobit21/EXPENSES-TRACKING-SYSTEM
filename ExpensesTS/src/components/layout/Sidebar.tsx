import { MoreVertical, ChevronLast, ChevronFirst, Menu } from "lucide-react"
import { useContext, createContext, useState, type ReactNode } from "react"
import { useAuth } from "../../context/AuthContext"

interface SidebarContextType {
  expanded: boolean
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true })

export default function Sidebar({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true) // desktop expand/collapse
  const [mobileOpen, setMobileOpen] = useState(false) // mobile toggle
  const { user, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)

  const getInitials = (name?: string) => {
    if (!name) return "NA"
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <>
      {/* Mobile toggle button - only visible on small screens */}
      <button
        className="md:hidden p-2 m-2 rounded-lg bg-gray-100 hover:bg-gray-200 fixed top-2 left-2 z-50"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          h-screen fixed top-0 left-0 z-40
          transform transition-transform duration-300 ease-in-out
          bg-white border-r shadow-sm
          w-64
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static
        `}
      >
        <nav className="h-full flex flex-col">
          {/* Logo + Collapse button */}
          <div className="p-4 pb-2 flex justify-between items-center">
            <img
              src="/assets/logo.svg"
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${expanded ? "w-24" : "w-0"}
                h-auto max-h-10
              `}
              alt="Logo"
            />

            {/* Collapse button only on md+ */}
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="hidden md:block p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          {/* Sidebar Items */}
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>

          {/* User Section */}
          <div className="border-t flex p-3 relative">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              {getInitials(user?.name)}
            </div>

            {/* User info */}
            <div
              className={`
                flex justify-between items-center
                overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
              `}
            >
              <div className="leading-4">
                <h4 className="font-semibold">{user?.name ?? "N/A"}</h4>
                <span className="text-xs text-gray-600">{user?.email ?? "N/A"}</span>
              </div>

              <button
                className="ml-2 p-1 rounded hover:bg-gray-200"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={20} />
              </button>
            </div>

            {showMenu && (
              <div className="absolute bottom-14 right-3 bg-white shadow-lg rounded-md w-32">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile (click to close sidebar) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
