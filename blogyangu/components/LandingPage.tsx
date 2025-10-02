"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription (e.g., via API)
    alert('Thanks for subscribing! Stay tuned for fresh insights.');
  };

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-green-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Insights That Inspire Your World
          </motion.h1>
          <motion.p 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            MacBlog: Your personal hub for curated articles on sports, social issues, health, tech, and more. Dive into thoughtful, ad-free content tailored for curious minds.
          </motion.p>
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-6 py-3 rounded-full text-gray-900 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
                Subscribe for Free
              </button>
            </form>
            <p className="text-sm opacity-90">Join 100,000+ readers getting weekly insights. No spam, ever.</p>
          </motion.div>
          <motion.img 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            transition={{ delay: 0.6 }}
            src="/images/img1.jpg" 
            alt="Diverse topics on MacBlog" 
            className="mt-8 mx-auto rounded-lg shadow-2xl max-w-4xl" 
          />
        </div>
      </section>

      {/* UVP/About Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why MacBlog Stands Out
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In a sea of noise, MacBlog delivers personalized, in-depth articles that resonate with your interests. From tech breakthroughs to health tips—curated just for you.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📱', title: 'Tech Trends', desc: 'Stay ahead with the latest in AI, gadgets, and innovation.' },
              { icon: '🏀', title: 'Sports Analysis', desc: 'Deep dives into games, athletes, and strategies.' },
              { icon: '❤️', title: 'Health & Wellness', desc: 'Practical advice for mind, body, and balance.' }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.2 }}
                className="flex flex-col items-center text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Highlights Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Explore Our Categories
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Sports', img: '/images/img1.jpg', desc: 'From NBA drama to fitness routines.', link: '/categories/sports' },
              { title: 'Social Issues', img: '/images/img2.jpg', desc: 'Thought-provoking discussions on society.', link: '/categories/social' },
              { title: 'Health', img: '/images/img3.jpg', desc: 'Tips for better living and wellness.', link: '/categories/health' },
              { title: 'Tech', img: '/images/img1.jpg', desc: 'Gadgets, apps, and future tech.', link: '/categories/tech' }
            ].map((category, i) => (
              <motion.div 
                key={i}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img src={category.img} alt={category.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.desc}</p>
                  <Link href={category.link} className="text-blue-600 hover:underline font-semibold">
                    Read More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          >
            Featured Articles
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'The Future of AI in Everyday Life', snippet: 'Explore how AI is reshaping tech and society.', link: '/articles/ai-future' },
              { title: 'Top Health Hacks for Busy Professionals', snippet: 'Quick tips to boost your wellness routine.', link: '/articles/health-hacks' },
              { title: 'Breaking Down the Latest Sports Scandals', snippet: 'In-depth analysis of current events in sports.', link: '/articles/sports-scandals' }
            ].map((article, i) => (
              <motion.div 
                key={i}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-50 p-6 rounded-lg shadow-md"
              >
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.snippet}</p>
                <Link href={article.link} className="text-blue-600 hover:underline font-semibold">
                  Read Full Article →
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12"
          >
            What Readers Are Saying
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "MacBlog's tech articles keep me informed without the fluff.", name: "Alex R., Tech Enthusiast" },
              { quote: "Love the balanced views on social issues—eye-opening!", name: "Jamie L., Social Advocate" },
              { quote: "Health tips that actually work for my lifestyle.", name: "Pat S., Fitness Fan" }
            ].map((testimonial, i) => (
              <motion.div 
                key={i}
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-blue-500 to-green-600 text-white py-12 px-4 text-center">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h2 className="text-3xl font-bold mb-4">Stay Connected with MacBlog</h2>
          <p className="text-xl mb-6">Get the latest articles delivered to your inbox.</p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-6 py-3 rounded-full text-gray-900 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button type="submit" className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              Subscribe Now
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}