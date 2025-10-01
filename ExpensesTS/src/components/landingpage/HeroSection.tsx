import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Copy */}
          <div className="lg:col-span-6 order-2 lg:order-1 text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100"
            >
              Master your money with clarity
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
            >
              Track expenses, set goals, and visualize insights — all in one simple, beautiful dashboard.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-white bg-green-600 hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 transition-colors"
              >
                Get started free
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-green-700 dark:text-green-300 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/40 border border-green-200 dark:border-green-800 transition-colors"
              >
                Create an account
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="mt-8 flex flex-wrap items-center gap-4 justify-center lg:justify-start text-sm text-gray-600 dark:text-gray-400"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                Secure & private
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-purple-500"></span>
                Cancel anytime
              </div>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-lg">
              <img
                src="/assets/stream.png"
                alt="App preview"
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-black/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection
