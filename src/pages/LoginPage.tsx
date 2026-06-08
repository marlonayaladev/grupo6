import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@ejercito.pe') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'ADMINISTRADOR');
      navigate('/');
    } else {
      setError('Credenciales inválidas. Acceso no autorizado.');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-textLight flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-cyan/10 border border-cyan/30 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-textLight uppercase tracking-wider">
              Acceso Restringido
            </h1>
            <p className="text-xs text-textLight/40 mt-1">
              Sandbox de Resiliencia Digital
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight placeholder:text-textLight/30 focus:border-cyan focus:outline-none transition-colors"
                placeholder="usuario@ejercito.pe"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-textLight/50 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-navy border border-army rounded-lg px-4 py-3 text-sm text-textLight placeholder:text-textLight/30 focus:border-cyan focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" variant="primary" className="w-full">
              Iniciar Sesión
            </Button>
          </form>

          <p className="text-[10px] text-textLight/20 text-center mt-6 uppercase tracking-wider">
            Acceso autorizado únicamente
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
