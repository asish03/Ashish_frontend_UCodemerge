import { useState } from 'react';
import { User } from '../App';
import { Lock, Mail, Code2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

// Demo credentials
const DEMO_USERS = {
  owner: {
    id: '1',
    email: 'owner@asembleai.com',
    password: 'owner123',
    name: 'Alex Johnson',
    role: 'owner' as const,
  },
  developer: {
    id: '2',
    email: 'dev@asembleai.com',
    password: 'dev123',
    name: 'Sam Williams',
    role: 'developer' as const,
  },
};

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check credentials
    const user = Object.values(DEMO_USERS).find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      onLogin(userWithoutPassword);
    } else {
      setError('Invalid email or password');
    }
  };

  const quickLogin = (role: 'owner' | 'developer') => {
    const user = DEMO_USERS[role];
    const { password: _, ...userWithoutPassword } = user;
    onLogin(userWithoutPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <Code2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-white text-3xl mb-2">AsembleAI</h1>
          <p className="text-purple-200">Universal Code Integration Platform</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm text-purple-100 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-purple-100 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Sign In
            </button>
          </form>

          {/* Quick Login Buttons */}
          {showCredentials && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-sm text-purple-200 mb-3 text-center">Demo Credentials:</p>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin('owner')}
                  className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors flex items-center justify-between"
                >
                  <span>Owner Account</span>
                  <span className="text-xs text-purple-300">owner@asembleai.com / owner123</span>
                </button>
                <button
                  onClick={() => quickLogin('developer')}
                  className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors flex items-center justify-between"
                >
                  <span>Developer Account</span>
                  <span className="text-xs text-purple-300">dev@asembleai.com / dev123</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-purple-200 text-sm mt-6">
          © 2025 AsembleAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
