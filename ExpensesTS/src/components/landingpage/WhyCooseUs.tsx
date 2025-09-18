import { DollarSign, Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <DollarSign className="text-emerald-500 w-12 h-12 mb-4" />,
    title: 'Income Tracking',
    description: 'Easily log and monitor all your income sources with real-time updates.',
    color: 'border-emerald-500',
  },
  {
    icon: <Calendar className="text-indigo-500 w-12 h-12 mb-4" />,
    title: 'Expense Management',
    description: 'Stay on top of your spending with detailed category breakdowns.',
    color: 'border-indigo-500',
  },
  {
    icon: <FileText className="text-rose-500 w-12 h-12 mb-4" />,
    title: 'Report Generation',
    description: 'Download customizable financial reports in just a few clicks.',
    color: 'border-rose-500',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-slate-100">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-16">The System Helps You In</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: index * 0.3,
            }}
            whileHover={{ scale: 1.05 }}
            className={`bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 ${feature.color}`}
          >
            <div className="flex flex-col items-start">
              {feature.icon}
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
