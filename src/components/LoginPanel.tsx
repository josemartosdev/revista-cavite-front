import { FormEvent, useState } from 'react';
import { KeyRound, Loader2, LockKeyhole } from 'lucide-react';
import { AuthSession } from '../types';

interface LoginPanelProps {
  onLogin: (email: string, password: string) => Promise<AuthSession>;
  onAuthenticated: (session: AuthSession) => void;
}

export default function LoginPanel({ onLogin, onAuthenticated }: LoginPanelProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const session = await onLogin(email.trim(), password);
      onAuthenticated(session);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-white px-4 pt-32 pb-20">
      <section className="mx-auto max-w-lg border-[3px] border-black bg-white">
        <div className="border-b-[3px] border-black bg-[#facc15] p-6">
          <span className="label-mono-sm block text-black">ACCESO RESTRINGIDO</span>
          <h1 className="mt-2 font-serif text-3xl font-black text-black">Panel de redacción</h1>
          <p className="mt-2 font-sans text-sm text-gray-700">
            Inicia sesión con las credenciales de publicación para crear entradas en la revista.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 p-6 md:p-8">
          <label className="block">
            <span className="label-mono-sm mb-2 block text-black">CORREO ELECTRÓNICO</span>
            <input
              required
              autoComplete="username"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border-2 border-black bg-white px-3 py-3 font-sans text-sm text-black outline-none focus:border-[#2563eb]"
            />
          </label>
          <label className="block">
            <span className="label-mono-sm mb-2 block text-black">CONTRASEÑA</span>
            <input
              required
              autoComplete="current-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full border-2 border-black bg-white px-3 py-3 font-sans text-sm text-black outline-none focus:border-[#2563eb]"
            />
          </label>
          {error && (
            <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 font-mono text-xs text-red-800">
              {error}
            </p>
          )}
          <button type="submit" disabled={loading} className="btn-primary flex w-full items-center justify-center gap-2 px-5 py-3 disabled:opacity-50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
            {loading ? 'COMPROBANDO CREDENCIALES...' : 'ENTRAR A REDACCIÓN'}
          </button>
          <p className="flex items-start gap-2 border-t-2 border-black pt-4 font-mono text-[10px] leading-relaxed text-gray-600">
            <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-[#2563eb]" />
            Las credenciales y permisos se validan en el backend; esta pantalla no crea ni almacena contraseñas.
          </p>
        </form>
      </section>
    </main>
  );
}
