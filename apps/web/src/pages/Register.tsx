import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import { useAuth } from '../lib/auth';

export function Register() {
  const [role, setRole] = useState('CLIENT');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [license, setLicense] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', { name, phone, email, password, role, license });
      login(response.data.access_token, response.data.user);
      
      if (role === 'DRIVER') {
        navigate('/chofer');
      } else {
        navigate('/cliente');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans selection:bg-blue-200 p-4 py-12">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="RadioTaxi Logo" className="w-20 h-20 object-contain drop-shadow-sm" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center text-slate-800">Únete a RadioTaxi</h1>
        <p className="text-slate-500 text-center mb-6">Crea tu cuenta gratis</p>
        
        {/* Role Selector */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'CLIENT' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setRole('CLIENT')}
          >
            Soy Pasajero
          </button>
          <button 
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'DRIVER' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setRole('DRIVER')}
          >
            Soy Chofer
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" 
            placeholder="Nombre completo" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-slate-50 hover:bg-white" 
          />
          <input 
            type="text" 
            placeholder="Teléfono (Ej. 78912345)" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-slate-50 hover:bg-white" 
          />
          {role === 'DRIVER' && (
            <input 
              type="text" 
              placeholder="Número de Licencia / Placa" 
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
              className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-slate-50 hover:bg-white" 
            />
          )}
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-slate-50 hover:bg-white" 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-slate-50 hover:bg-white" 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-4"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
