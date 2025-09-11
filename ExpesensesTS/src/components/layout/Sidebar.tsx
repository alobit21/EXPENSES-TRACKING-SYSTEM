import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react"
import { useContext, createContext, useState, type ReactNode } from "react"
import { useAuth } from "../../context/AuthContext"

interface SidebarContextType {
  expanded: boolean
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true })

export default function Sidebar({ children }: { children: ReactNode }) {
  const [expanded, setExpanded] = useState(true)
  const {user, logout} = useAuth()

   const getInitials = (name?: string) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

   const [showMenu, setShowMenu] = useState(false);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/243.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

         <div className="border-t flex p-3 relative">
      {/* Avatar with initials */}
      <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
        {getInitials(user?.name)}
      </div>

      {/* User info + more button */}
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

        {/* Three dots */}
        <button
          className="ml-2 p-1 rounded hover:bg-gray-200"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Dropdown Menu */}
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
  )
}

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  onClick,
}: {
  icon: ReactNode
  text: string
  active?: boolean
  alert?: boolean
  onClick?: () => void
}) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      onClick={onClick}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
    `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-indigo-100 text-indigo-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </li>
  )
}