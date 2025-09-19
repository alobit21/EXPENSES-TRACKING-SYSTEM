import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Features', to: '/features' },
    { name: 'About', to: '/about' },
  ];

  const menuVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    closed: { opacity: 0, x: '-100%', transition: { duration: 0.3 } },
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm ${
        scrolled ? 'text-green-500 shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className={`text-2xl font-bold transition-colors duration-300 ${
            scrolled ? 'text-green-600' : 'text-green-500'
          }`}>
            FinanceMaster
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.to}
                className={`transition-colors duration-300 ${
                  scrolled ? 'text-gray-200 hover:text-green-600' : 'text-gray-700 hover:text-green-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ))}
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                scrolled
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                  : 'bg-green-600 text-white hover:bg-green-500'
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none ${scrolled ? 'text-gray-200' : 'text-gray-900'}`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
<motion.div
  initial="closed"
  animate="open"
  exit="closed"
  variants={menuVariants}
  className="md:hidden fixed inset-0 bg-white shadow-lg p-6"
>
  {/* Close button */}
  <div className="flex justify-end">
    <button
      onClick={() => setIsOpen(false)}
      className="text-gray-800 hover:text-green-600 transition-colors duration-200"
    >
      <X size={28} />
    </button>
  </div>

  <div className="flex flex-col items-center space-y-6 mt-6 bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
    {navItems.map((item) => (
      <motion.a
        key={item.name}
        href={item.to}
        className="text-gray-800 hover:text-green-600 text-lg font-medium transition-colors duration-200"
        onClick={() => setIsOpen(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {item.name}
      </motion.a>
    ))}
    <Link
      to="/signup"
      className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md"
      onClick={() => setIsOpen(false)}
    >
      Get Started
    </Link>
  </div>
</motion.div>

          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
