import {
  MoreVertical,
  ChevronLast,
  ChevronFirst
} from "lucide-react";
import {
  useContext,
  createContext,
  useState,
  forwardRef,
  type ReactNode,
  useEffect,
  useRef
} from "react";
import { useAuth } from "../../context/AuthContext";

interface SidebarContextType {
  expanded: boolean;
}



const SidebarContext = createContext<SidebarContextType>({ expanded: true });

const Sidebar = forwardRef(function Sidebar(
  {
    children,
    isMobileOpen
  }: {
    children: ReactNode;
      isMobileOpen?: boolean;
        className?: string; // <-- add this

  },
  ref: React.Ref<HTMLDivElement>
) {
  const [expanded, setExpanded] = useState(true);
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside
      ref={ref}
      className={`
        h-screen mt-16 md:mt-24 fixed md:static z-40 transition-transform duration-300
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}
    >
      <nav
        className={`
          h-full flex flex-col bg-white dark:bg-gray-800 border-r shadow-sm
          transition-all duration-300 ease-in-out
          ${expanded ? "w-64" : "w-20"} 
        `}
      >
        {/* Logo and toggle */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="/logo.svg"
            className={`transition-all duration-300 ease-in-out ${expanded ? "w-24 opacity-100" : "w-0 opacity-0"}`}
            alt="Logo"
          />

          <button
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 hidden md:block"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Sidebar items */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* User info */}
        <div className="border-t flex p-3 relative">
          <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {getInitials(user?.name)}
          </div>
          <div
            className={`flex justify-between items-center transition-all duration-300 ${
              expanded ? "w-52 ml-3" : "w-0"
            }`}
          >
            <div className="leading-4 overflow-hidden">
              <h4 className="font-semibold truncate">{user?.name ?? "N/A"}</h4>
              <span className="text-xs text-gray-600 truncate">{user?.email ?? "N/A"}</span>
            </div>
            <div ref={menuRef} className="relative">
              <button
                aria-label="User menu"
                className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical size={20} />
              </button>
              {showMenu && (
                <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-700 shadow-lg rounded-md w-32">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
});

export default Sidebar;

export function SidebarItem({
  icon,
  text,
  active,
  alert,
  onClick,
  onClose
}: {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  onClick?: () => void;
  onClose?: () => void;
}) {
  const { expanded } = useContext(SidebarContext);

  const handleClick = () => {
    onClick?.();
    onClose?.();
  };

  return (
    <li
      onClick={handleClick}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600 dark:text-gray-200"}
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"
        }`}
      >
        {text}
      </span>

      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded-full bg-indigo-400 ${expanded ? "" : "top-2"}`} />
      )}
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-100 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
