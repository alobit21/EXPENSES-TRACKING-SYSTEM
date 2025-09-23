import { useState } from 'react';
import { Users, BarChart2, ShieldCheck, DollarSign } from 'lucide-react';

const stats = [
  {
    icon: <Users className="text-indigo-500 w-8 h-8 " />,
    label: 'Active Users',
    value: 12000,
    color: 'border-indigo-500',
  },
  {
    icon: <DollarSign className="text-emerald-500 w-8 h-8" />,
    label: 'Transactions Tracked',
    value: 850000,
    color: 'border-emerald-500',
  },
  {
    icon: <BarChart2 className="text-rose-500 w-8 h-8" />,
    label: 'Reports Generated',
    value: 43000,
    color: 'border-rose-500',
  },
  {
    icon: <ShieldCheck className="text-yellow-500 w-8 h-8" />,
    label: 'Security Checks Passed',
    value: 99.99,
    suffix: '%',
    color: 'border-yellow-500',
  },
];

// helper to format numbers into K, M, B
function formatNumber(num: number, suffix = ''): string {
  if (suffix === '%') return num.toFixed(2) + suffix;
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
  return num.toString();
}

export default function StatsShowcase() {
  const [displayValues, setDisplayValues] = useState(stats.map(stat => stat.value));

  const handleHover = (index: number) => {
    const target = stats[index].value;
    const randomStart = Math.floor(Math.random() * (target * 0.7)); // start at random point

    let current = randomStart;
    const step = Math.ceil(target / 50); // speed of increment

    setDisplayValues(prev => {
      const newVals = [...prev];
      newVals[index] = randomStart;
      return newVals;
    });

    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        clearInterval(interval);
        setDisplayValues(prev => {
          const newVals = [...prev];
          newVals[index] = target;
          return newVals;
        });
      } else {
        setDisplayValues(prev => {
          const newVals = [...prev];
          newVals[index] = current;
          return newVals;
        });
      }
    }, 40);
  };

  return (
<section className="py-20 px-6 sm:px-10 lg:px-20 bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-12">
      Our Impact in Numbers
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {stats.map((stat, i) => (
        <div
          key={i}
          onMouseEnter={() => handleHover(i)}
          className={`bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border-l-4 ${stat.color} border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300`}
        >
          <div className="flex justify-center mb-4">{stat.icon}</div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {formatNumber(displayValues[i], stat.suffix)}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
        </div>
      ))}
    </div>
  </div>
</section>

  );
}
