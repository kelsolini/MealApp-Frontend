import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const { user, loading, signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        const action = mode === 'login' ? signIn : signUp;
        const { error: err } = await action(email, password);
        setSubmitting(false);
        if (err) {
            setError(err);
        } else {
            navigate('/');
        }
    };

    // Alle hooks må stå ovenfor disse to linjene.
    // Er brukeren allerede innlogget, skal login-siden aldri vises.
    if (loading) return null;
    if (user) return <Navigate to="/" replace />;

    return (
        <div className="mx-auto mt-16 max-w-sm rounded-xl border p-6 shadow-sm">
            <h1 className="mb-4 text-xl font-semibold">
                {mode === 'login' ? 'Logg inn' : 'Opprett konto'}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    required
                    placeholder="E-post"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                />
                <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Passord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded border px-3 py-2"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded bg-emerald-600 py-2 text-white disabled:opacity-50"
                >
                    {mode === 'login' ? 'Logg inn' : 'Registrer'}
                </button>
            </form>
            <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="mt-3 text-sm text-gray-600 underline"
            >
                {mode === 'login'
                    ? 'Ny bruker? Opprett konto'
                    : 'Har du konto? Logg inn'}
            </button>
        </div>
    );
}
