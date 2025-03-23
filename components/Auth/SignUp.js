import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function SignUp({ setView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      // Sign up the user
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      setMessage('Success! Please check your email for the confirmation link.');
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="card max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
      
      {error && (
        <div className="bg-red-50 text-alert p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 text-secondary p-3 rounded-md mb-4">
          {message}
        </div>
      )}
      
      <form onSubmit={handleSignUp}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
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
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full mb-4"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => setView('signIn')}
            className="text-primary hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
} 