import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Sun, Moon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; // ✅ Use existing ThemeContext

const UserNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const { theme, toggleTheme } = useTheme(); // ✅ Get theme state
  const navigate = useNavigate();

  const getInitials = (name?: string) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-md p-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl ml-14 md:ml-0 font-bold text-green-600 dark:text-green-400">
          FinanceMaster
        </div>

        {/* Right section: Theme toggle + user menu */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-gray-800" />
            )}
          </button>

          {/* User Info + Dropdown */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-600 dark:text-white flex items-center justify-center font-bold">
                {getInitials(user?.name)}
              </div>
              <div className="hidden md:block">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                  {user?.name ?? "N/A"}
                </h4>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.email ?? "N/A"}
                </span>
              </div>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="ml-2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 md:ml-4"
              >
                <MoreVertical size={20} className="text-gray-800 dark:text-gray-200" />
              </button>
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 shadow-lg rounded-md z-10"
                >
                  <button
                    onClick={() => {
                      logout();
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Logout
                  </button>
                  <button
                    onClick={() => {
                      navigate("/");
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Home
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default UserNavbar;
