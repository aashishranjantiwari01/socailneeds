import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, MessageCircle, ArrowRight } from 'lucide-react';
import { ShinyButton } from './ui/shiny-button';

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className="relative py-24 md:py-32 px-6" ref={ref}>
      {/* bg glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/[0.08] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          className="glass rounded-3xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* icon */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <MessageCircle size={28} className="text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Reach out to us on Telegram for instant support. We&apos;re available
            24/7 and respond within minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <ShinyButton as="a" href="https://t.me/despacito" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <Send size={18} />
              Contact on Telegram
              <ArrowRight size={18} />
            </ShinyButton>

            <ShinyButton as="a" href="https://t.me/socialneed" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <MessageCircle size={18} />
              Join Our Channel
            </ShinyButton>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            ⚡ Average response time: under 5 minutes
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
