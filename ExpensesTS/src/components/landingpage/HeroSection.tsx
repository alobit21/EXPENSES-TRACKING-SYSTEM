import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <div>
            <section
        className="py-20 px-4 sm:px-6 lg:px-8 text-center relative bg-cover bg-center"
        style={{
          backgroundImage: "url(' /public/assets/2.jpg'",
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
    </div>
  )
}

export default HeroSection
