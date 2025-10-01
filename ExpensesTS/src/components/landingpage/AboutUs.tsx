import { Briefcase, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const aboutItems = [
  {
    icon: <Briefcase className="text-indigo-500 w-10 h-10 mb-4" />,
    title: 'Our Mission',
    description: 'To make financial literacy accessible, intuitive, and actionable for all.',
    color: 'border-indigo-500',
  },
  {
    icon: <Users className="text-green-500 w-10 h-10 mb-4" />,
    title: 'Our Team',
    description: 'A passionate group of developers, designers, and finance experts building with purpose.',
    color: 'border-green-500',
  },
  {
    icon: <TrendingUp className="text-rose-500 w-10 h-10 mb-4" />,
    title: 'Our Vision',
    description: 'A world where financial confidence is the norm, not the exception.',
    color: 'border-rose-500',
  },
];

export default function AboutUs() {
  return (
   <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-slate-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
  <div className="mx-auto max-w-6xl text-center">
    <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
      About Us
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
      At <span className="font-semibold text-gray-800 dark:text-gray-100">FinanceMaster</span>, we're on a mission to simplify personal finance for everyone. 
      Whether you're budgeting for your first paycheck or planning long-term goals, our tools empower you to take control of your financial future.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {aboutItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className={`bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 ${item.color}`}
        >
          {item.icon}
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {item.description}
          </p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

  );
}
