import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate()

  const getInitials = (name?: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
  className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4"    >
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo */}
    <div className="text-xl ml-14 md:ml-0 font-bold text-green-600">FinanceMaster</div>

        {/* User Info and Dropdown */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              {getInitials(user?.name)}
            </div>
            <div className="hidden md:block">
              <h4 className="font-semibold">{user?.name ?? 'N/A'}</h4>
              <span className="text-xs text-gray-600">{user?.email ?? 'N/A'}</span>
            </div>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="ml-2 p-1 rounded hover:bg-gray-200 md:ml-4"
            >
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md z-10"
              >
                <button
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  Logout
                </button>
                 <button
                  onClick={() => {
                    navigate("/")
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                >
                  Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default UserNavbar;