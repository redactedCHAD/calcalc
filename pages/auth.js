import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SignIn from '../components/Auth/SignIn';
import SignUp from '../components/Auth/SignUp';
import { supabase } from '../utils/supabaseClient';

export default function Auth() {
  const [view, setView] = useState('signIn');
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If there's an active session, redirect to home
        router.push('/');
      }
    };
    
    checkUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/');
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);
  
  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to ACalc</h1>
      
      <div className="mb-8 text-center max-w-lg mx-auto">
        <p className="text-neutral">
          Track your calories, scan barcodes, and reach your nutrition goals with ACalc.
        </p>
      </div>
      
      {view === 'signIn' ? (
        <SignIn setView={setView} />
      ) : (
        <SignUp setView={setView} />
      )}
    </div>
  );
} 