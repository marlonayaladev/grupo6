import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import ParticleCanvas from '../components/ParticleCanvas';

export default function LandingPage() {
  return (
    <div className="min-h-full bg-bg text-textLight relative">
      <ParticleCanvas />

      <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl w-full text-center mb-10 sm:mb-12"
        >
          <img src="/logo.png" alt="Logo" className="mx-auto mb-8" style={{ width: 400, height: 600, objectFit: 'contain' }} />

          <Link to="/generar" className="block text-center">
            <Button variant="primary" className="text-sm sm:text-base px-8 sm:px-10 py-3 sm:py-4">
              Generar Situación
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
