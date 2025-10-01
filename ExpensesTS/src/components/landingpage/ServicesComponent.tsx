import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, DollarSign, Calendar, FileText } from "lucide-react";
import Carousel3D from './Carousel3D';

const features = [
  { label: "Record incomes", icon: <DollarSign className="w-6 h-6 text-green-500" /> },
  { label: "Track expenses", icon: <DollarSign className="w-6 h-6 text-emerald-500" /> },
  { label: "Set savings goals", icon: <Calendar className="w-6 h-6 text-blue-500" /> },
  { label: "Contribute to goals", icon: <Calendar className="w-6 h-6 text-indigo-500" /> },
  { label: "Generate reports", icon: <FileText className="w-6 h-6 text-orange-500" /> },
  { label: "Visualize spending patterns", icon: <FileText className="w-6 h-6 text-purple-500" /> }
];

export default function LandingShowcase() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  useEffect(() => {
    let cycle: ReturnType<typeof setInterval>;

    const startAnimation = () => {
      setCheckedItems([]);
      features.forEach((_, i) => {
        setTimeout(() => {
          setCheckedItems((prev) => [...prev, i]);
        }, i * 1000);
      });
    };

    startAnimation();
    cycle = setInterval(() => {
      startAnimation();
    }, features.length * 1000 + 1000);

    return () => clearInterval(cycle);
  }, []);

  return (
    <section
  id="features"
  className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/80 to-slate-50/90 dark:from-gray-900/80 dark:to-gray-800/90 relative bg-cover bg-center"
  style={{ backgroundImage: "url('/assets/javascript.webp')" }}
>
  {/* Backdrop Overlay */}
  <div className="absolute inset-0 backdrop-blur-sm" />
  <div className="relative z-10 mx-auto max-w-6xl">
    <h2 className="text-4xl font-extrabold text-center mb-12 text-slate-800 dark:text-slate-200">
      What Our Expense Tracker Does
    </h2>

    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Left Side - 3D Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="rounded-3xl overflow-hidden h-96"
      >
        <Carousel3D />
      </motion.div>

      {/* Right Side - Features */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-10"
      >
        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: checkedItems.includes(i) ? 1 : 0.6, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
              className="bg-white/90 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg dark:shadow-gray-900/50 border border-slate-200 dark:border-gray-700 hover:shadow-xl transition duration-300 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                    ${checkedItems.includes(i)
                      ? "bg-green-500 border-green-500"
                      : "border-slate-300 dark:border-gray-500 bg-white dark:bg-gray-700"}`}
                  animate={
                    checkedItems.includes(i)
                      ? { boxShadow: "0 0 12px 3px rgba(34,197,94,0.6)" }
                      : { boxShadow: "none" }
                  }
                >
                  <AnimatePresence>
                    {checkedItems.includes(i) && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {feature.icon}
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {feature.label}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
</section>

  );
}