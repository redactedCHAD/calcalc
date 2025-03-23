import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import FoodEntryForm from '../components/Journal/FoodEntryForm';
import FoodEntryList from '../components/Journal/FoodEntryList';
import { useAuth } from '../utils/AuthContext';

export default function Journal() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [scannedFood, setScannedFood] = useState(null);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);
  
  // Check for scanned food from localStorage
  useEffect(() => {
    const checkForScannedFood = () => {
      if (typeof window !== 'undefined') {
        const savedFood = localStorage.getItem('lastScannedFood');
        if (savedFood) {
          try {
            const parsedFood = JSON.parse(savedFood);
            setScannedFood(parsedFood);
            setShowForm(true);
            // Clear the stored food after retrieving it
            localStorage.removeItem('lastScannedFood');
          } catch (error) {
            console.error('Error parsing scanned food data:', error);
          }
        }
      }
    };
    
    checkForScannedFood();
  }, []);
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  
  const handleFoodAdded = () => {
    // Refresh the food entry list
    setRefreshTrigger(prev => prev + 1);
    // Hide the form after successful submission
    setShowForm(false);
    // Clear any scanned food data
    setScannedFood(null);
  };
  
  if (authLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="card p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Food Journal</h1>
          <p className="text-neutral mb-4 md:mb-0">
            Track your meals and nutrition throughout the day
          </p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="input w-full md:w-auto"
            aria-label="Select date"
          />
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary w-full md:w-auto"
          >
            {showForm ? 'Cancel' : 'Add Food Entry'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="mb-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">
              {scannedFood ? 'Add Scanned Food' : 'Add New Food Entry'}
            </h2>
            <FoodEntryForm 
              date={selectedDate}
              onFoodAdded={handleFoodAdded}
              scannedFood={scannedFood}
            />
          </div>
        </div>
      )}
      
      <FoodEntryList 
        date={selectedDate}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
} 