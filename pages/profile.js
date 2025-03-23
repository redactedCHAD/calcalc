import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/AuthContext';
import { supabase } from '../utils/supabaseClient';

export default function Profile() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  // Form fields
  const [username, setUsername] = useState('');
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const [dailyProteinGoal, setDailyProteinGoal] = useState(120);
  const [dailyCarbsGoal, setDailyCarbsGoal] = useState(250);
  const [dailyFatGoal, setDailyFatGoal] = useState(70);
  
  useEffect(() => {
    if (authLoading) return;
    
    // If not authenticated, redirect to auth page
    if (!user) {
      router.push('/auth');
      return;
    }
    
    // Fetch user profile data
    const fetchProfile = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile(data);
          // Initialize form values
          setUsername(data.username || '');
          setDailyCalorieGoal(data.daily_calorie_goal || 2000);
          setDailyProteinGoal(data.daily_protein_goal || 120);
          setDailyCarbsGoal(data.daily_carbs_goal || 250);
          setDailyFatGoal(data.daily_fat_goal || 70);
        }
      } catch (error) {
        console.error('Error fetching profile:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, router, authLoading]);
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    
    try {
      // Check if profile exists first
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the "not found" error code
        throw fetchError;
      }
      
      const updates = {
        id: user.id,
        username,
        daily_calorie_goal: dailyCalorieGoal,
        daily_protein_goal: dailyProteinGoal,
        daily_carbs_goal: dailyCarbsGoal,
        daily_fat_goal: dailyFatGoal,
        updated_at: new Date().toISOString(),
      };
      
      let error;
      
      if (!existingProfile) {
        // Profile doesn't exist, so we need to create it with all fields
        updates.email = user.email; // Make sure to include required fields
        updates.created_at = new Date().toISOString();
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(updates);
          
        error = insertError;
      } else {
        // Profile exists, so we can update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
          
        error = updateError;
      }
        
      if (error) throw error;
      
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };
  
  if (authLoading || loading) {
    return (
      <div className="py-10 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <button 
          onClick={signOut}
          className="btn-secondary"
        >
          Sign Out
        </button>
      </div>
      
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
              <p className="text-xs text-neutral mt-1">Email cannot be changed</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Nutrition Goals</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calorieGoal" className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Calorie Goal (kcal)
                </label>
                <input
                  id="calorieGoal"
                  type="number"
                  min="0"
                  value={dailyCalorieGoal}
                  onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="proteinGoal" className="block text-sm font-medium text-gray-700 mb-1">
                  Protein Goal (g)
                </label>
                <input
                  id="proteinGoal"
                  type="number"
                  min="0"
                  value={dailyProteinGoal}
                  onChange={(e) => setDailyProteinGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="carbsGoal" className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs Goal (g)
                </label>
                <input
                  id="carbsGoal"
                  type="number"
                  min="0"
                  value={dailyCarbsGoal}
                  onChange={(e) => setDailyCarbsGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="fatGoal" className="block text-sm font-medium text-gray-700 mb-1">
                  Fat Goal (g)
                </label>
                <input
                  id="fatGoal"
                  type="number"
                  min="0"
                  value={dailyFatGoal}
                  onChange={(e) => setDailyFatGoal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Change Password</h3>
              <button
                onClick={() => {
                  /* We'll add this functionality later */
                  alert('Password reset email has been sent.');
                }}
                className="text-primary hover:underline text-sm"
              >
                Send password reset email
              </button>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-2 text-alert">Danger Zone</h3>
              <button
                onClick={() => {
                  const confirmDelete = window.confirm(
                    'Are you sure you want to delete your account? This action cannot be undone.'
                  );
                  if (confirmDelete) {
                    alert('Account deletion would happen here in a real app.');
                  }
                }}
                className="text-alert hover:underline text-sm"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 