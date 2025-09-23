import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface NavItem {
  name: string;
  to: string;
}

interface ResponsiveNavbarProps {
  brand?: string;
  logo?: string;
  navItems?: NavItem[];
  ctaText?: string;
  ctaLink?: string;
}

const ResponsiveNavbar: React.FC<ResponsiveNavbarProps> = ({
  brand = 'FinanceMaster',
  logo,
  navItems = [
    { name: 'Home', to: '/' },
    { name: 'Features', to: '/features' },
    { name: 'About', to: '/about' },
  ],
  ctaText = 'Get Started',
  ctaLink = '/login',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();


  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, y: '-100%', transition: { duration: 0.3 } },
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-md dark:bg-gray-900'
          : 'bg-transparent dark:bg-gray-900/70'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and Brand */}
        <NavLink to="/" className="flex items-center space-x-3">
          {logo && <img src={logo} alt="Logo" className="h-8" />}
          <span
            className={`text-2xl font-semibold ${
              scrolled
                ? 'text-green-600 dark:text-green-400'
                : 'text-green-500 dark:text-green-300'
            }`}
          >
            {brand}
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6 justify-center flex-grow">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? 'text-green-600 dark:text-green-400 font-semibold'
                    : scrolled
                    ? 'text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                    : 'text-gray-800 dark:text-gray-200 hover:text-green-400 dark:hover:text-green-300'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* CTA Button + Theme Toggle */}
        <div className="hidden md:flex items-center">
          <NavLink
            to={ctaLink}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white dark:from-green-600 dark:to-green-700 hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            {ctaText}
          </NavLink>
           <button
      onClick={toggleTheme}
      className="ml-4 px-3 py-2 rounded-lg border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 dark:text-gray-200 focus:outline-none ml-2"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-40"
          >
            <div className="flex flex-col items-start space-y-6 p-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-lg font-medium ${
                      isActive
                        ? 'text-green-600 dark:text-green-400 font-semibold'
                        : 'text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <NavLink
                to={ctaLink}
                className="bg-gradient-to-r from-green-500 dark:from-green-600 to-green-600 dark:to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md w-full text-center"
                onClick={() => setIsOpen(false)}
              >
                {ctaText}
              </NavLink>

              {/* Mobile Theme Toggle */}
               <button
      onClick={toggleTheme}
      className="ml-4 px-3 py-2 rounded-lg border border-gray-400 dark:border-gray-600 text-gray-800 dark:text-gray-200"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ResponsiveNavbar;
