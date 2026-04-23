import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-mono text-8xl font-bold text-cyan-400 mb-4">404</h1>
        <p className="text-slate-400 mb-8">Page not found</p>
        <Button icon={Home} onClick={() => navigate('/')}>
          Go Home
        </Button>
      </motion.div>
    </div>
  );
}