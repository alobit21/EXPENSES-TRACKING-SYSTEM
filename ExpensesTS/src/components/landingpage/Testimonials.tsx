import { motion } from 'framer-motion';
import { User } from 'lucide-react';

const testimonials = [
  {
    name: 'Atanas Patrick',
    text: 'This app has transformed how I manage my finances. The reports are a game-changer!',
    rating: 5,
  },
  {
    name: 'Nila Galus',
    text: 'Simple, intuitive, and packed with features. Highly recommend it!',
    rating: 5,
  },
  {
    name: 'Jackson Kawawa',
    text: 'The goal tracking feature keeps me motivated every month. Fantastic app!',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section
  id="testimonials"
  className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-gray-900 text-white"
  style={{
    backgroundImage: 'url("/assets/testimonial-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40 dark:bg-black/50 backdrop-blur-sm z-0"></div>

  <div className="relative z-10 mx-auto max-w-6xl">
    <h2 className="text-4xl font-bold text-center text-white mb-12">
      What Our Users Say
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="relative bg-white/90 dark:bg-gray-800/70 backdrop-blur-md border-l-4 border-indigo-500 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300"
        >
          {/* Decorative Quote Icon */}
          <div className="absolute top-6 right-6 text-5xl text-gray-300 dark:text-gray-400 opacity-50">
            “
          </div>

          {/* Avatar */}
          <div className="flex items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-400 to-purple-500 flex items-center justify-center text-white shadow-lg mr-4">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {testimonial.name}
              </h4>
            </div>
          </div>

          {/* Testimonial Text */}
          <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-6 italic">
            {testimonial.text}
          </p>

          {/* Star Rating */}
          <div className="flex space-x-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-yellow-500 text-xl"
              >
                ★
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>

  );
}
