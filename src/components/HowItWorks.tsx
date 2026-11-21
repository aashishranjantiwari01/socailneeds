import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Search, ShieldCheck, Rocket } from 'lucide-react';

const steps = [
  {
    num: '01',
    Icon: MessageSquare,
    title: 'Reach Out',
    desc: 'Contact us on Telegram with your requirements. We respond within minutes.',
  },
  {
    num: '02',
    Icon: Search,
    title: 'We Analyze',
    desc: 'Our experts assess your case and provide a quote with an estimated timeline.',
  },
  {
    num: '03',
    Icon: ShieldCheck,
    title: 'Secure Process',
    desc: 'We execute with full confidentiality using our proven methods and tools.',
  },
  {
    num: '04',
    Icon: Rocket,
    title: 'Delivered',
    desc: 'Results delivered on time. If not satisfied, we work until it\'s right.',
  },
];

const HowItWorks = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-24 md:py-32 px-6" ref={ref}>
      {/* bg accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-600/[0.04] rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3">
            How It{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
        </motion.div>

        {/* steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative glass glass-hover rounded-2xl p-6 text-center group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              {/* step number */}
              <span className="absolute -top-3 -right-2 text-5xl font-black text-blue-500/[0.07] select-none">
                {step.num}
              </span>

              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 flex items-center justify-center group-hover:from-blue-600/30 group-hover:to-cyan-600/30 transition-all">
                <step.Icon size={22} className="text-blue-400" />
              </div>

              <h3 className="text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>

              {/* connector line (hidden on last + small screens) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-blue-500/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
