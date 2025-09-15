import React from 'react';
import { DollarSign, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans">
        <Navbar />
      {/* Hero Section with Background Image */}
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-center relative bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white"
          >
            Take Control of Your Finances
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-8"
          >
            Effortlessly track your income, manage expenses, and generate insightful reports with our intuitive finance app.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Link
              to="/signup"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Pulsing Animation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <DollarSign className="text-green-600 w-12 h-12 mb-4" />,
              title: 'Income Tracking',
              description: 'Easily log and monitor all your income sources with real-time updates.',
            },
            {
              icon: <Calendar className="text-green-600 w-12 h-12 mb-4" />,
              title: 'Expense Management',
              description: 'Stay on top of your spending with detailed category breakdowns.',
            },
            {
              icon: <FileText className="text-green-600 w-12 h-12 mb-4" />,
              title: 'Report Generation',
              description: 'Download customizable financial reports in just a few clicks.',
            },
          ].map((feature, index) => (
<motion.div
  key={index}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  animate={{
    scale: [1, 1.1, 1],
  }}
  transition={{
    duration: 0.6,
    delay: index * 0.2,
    scale: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 1,
      delay: index * 0.5, // Stagger the pulse
    },
  }}
  whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
  className="bg-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
>

              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              name: 'Jane Doe',
              text: 'This app has transformed how I manage my finances. The reports are a game-changer!',
              rating: 5,
            },
            {
              name: 'John Smith',
              text: 'Simple, intuitive, and packed with features. Highly recommend it!',
              rating: 5,
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <p className="text-gray-600 mb-4 italic">&quot;{testimonial.text}&quot;</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">{testimonial.name}</span>
                <span className="text-yellow-500">{'★'.repeat(testimonial.rating)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">© {new Date().getFullYear()} FinanceMaster. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;