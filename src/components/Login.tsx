import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-page-background relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-[400px] p-8 bg-white rounded-2xl shadow-lg relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-semibold">T</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-text-default mb-2 text-center">
          Welcome back
        </h1>
        <p className="text-sm text-text-neutral mb-8 text-center">
          Sign into your account
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-medium text-text-default mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={`w-full px-4 py-3 text-sm border rounded-lg bg-background-default text-text-default outline-none transition-all placeholder:text-text-disabled ${
                errors.email ? 'border-negative' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/10'
              }`}
            />
            {errors.email && (
              <span className="text-[11px] text-negative mt-1 block">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-text-default mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 pr-10 text-sm border rounded-lg bg-background-default text-text-default outline-none transition-all placeholder:text-text-disabled ${
                  errors.password ? 'border-negative' : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/10'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-default transition-colors flex items-center justify-center p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[11px] text-negative mt-1 block">
                {errors.password}
              </span>
            )}
          </div>

          <div className="text-right mb-1">
            <button type="button" className="text-xs text-primary hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm font-semibold text-white bg-primary rounded-lg cursor-pointer transition-all hover:bg-primary-light hover:text-primary active:translate-y-px disabled:bg-text-disabled disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="mt-4 border-t border-border pt-6">
            <p className="text-xs text-text-neutral text-center mb-3">
              Don't have an account?
            </p>
            <button 
              type="button" 
              className="w-full px-4 py-3 text-sm font-medium text-text-default bg-white border border-border rounded-lg transition-all hover:bg-background-default active:translate-y-px flex items-center justify-center"
            >
              Create a Trove account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
