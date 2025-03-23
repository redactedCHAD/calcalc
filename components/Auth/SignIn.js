import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function SignIn({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      
      {error && (
        <div className="bg-red-50 text-alert p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSignIn}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full mb-4"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={() => setView('signUp')}
            className="text-primary hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
} 