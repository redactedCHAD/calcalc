import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../utils/AuthContext';

export default function FoodEntryList({ date, refreshTrigger }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedEntries, setGroupedEntries] = useState({});
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  
  // Fetch food entries for the selected date
  useEffect(() => {
    const fetchEntries = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('food_entries')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', date)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setEntries(data || []);
        
        // Group entries by meal type
        const grouped = {};
        let totals = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
        
        (data || []).forEach(entry => {
          // Add to meal type group
          if (!grouped[entry.meal_type]) {
            grouped[entry.meal_type] = [];
          }
          
          grouped[entry.meal_type].push(entry);
          
          // Add to daily totals
          totals.calories += entry.calories || 0;
          totals.protein += entry.protein || 0;
          totals.carbs += entry.carbs || 0;
          totals.fat += entry.fat || 0;
        });
        
        setGroupedEntries(grouped);
        setDailyTotals(totals);
        
      } catch (error) {
        console.error('Error fetching food entries:', error);
        setError('Failed to load food entries');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, [user, date, refreshTrigger]);
  
  const handleDeleteEntry = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      const { error } = await supabase
        .from('food_entries')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the local state to reflect the deletion
      setEntries(entries.filter(entry => entry.id !== id));
      
      // Recalculate grouped entries and totals
      const newEntries = entries.filter(entry => entry.id !== id);
      const grouped = {};
      let totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
      
      newEntries.forEach(entry => {
        if (!grouped[entry.meal_type]) {
          grouped[entry.meal_type] = [];
        }
        
        grouped[entry.meal_type].push(entry);
        
        totals.calories += entry.calories || 0;
        totals.protein += entry.protein || 0;
        totals.carbs += entry.carbs || 0;
        totals.fat += entry.fat || 0;
      });
      
      setGroupedEntries(grouped);
      setDailyTotals(totals);
      
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card p-6 text-alert">
        <p>{error}</p>
      </div>
    );
  }
  
  if (entries.length === 0) {
    return (
      <div className="card p-6">
        <p className="text-neutral text-center">No food entries for this date. Add your first meal!</p>
      </div>
    );
  }
  
  // Helper function to get meal type display name
  const getMealTypeDisplay = (type) => {
    const mealTypes = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack',
    };
    
    return mealTypes[type] || type;
  };
  
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Summary</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{dailyTotals.calories}</div>
            <div className="text-sm text-neutral">Calories (kcal)</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{dailyTotals.protein.toFixed(1)}g</div>
            <div className="text-sm text-neutral">Protein</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{dailyTotals.carbs.toFixed(1)}g</div>
            <div className="text-sm text-neutral">Carbs</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">{dailyTotals.fat.toFixed(1)}g</div>
            <div className="text-sm text-neutral">Fat</div>
          </div>
        </div>
      </div>
      
      {Object.keys(groupedEntries).map(mealType => (
        <div key={mealType} className="card p-6">
          <h3 className="text-lg font-medium mb-3">{getMealTypeDisplay(mealType)}</h3>
          
          <div className="space-y-3">
            {groupedEntries[mealType].map(entry => (
              <div 
                key={entry.id} 
                className="flex justify-between items-center border-b pb-3 last:border-b-0 last:pb-0"
              >
                <div>
                  <div className="font-medium">{entry.food_name}</div>
                  {entry.serving_size && (
                    <div className="text-sm text-neutral">{entry.serving_size}</div>
                  )}
                </div>
                
                <div className="flex items-center">
                  <div className="text-right mr-4">
                    <div className="font-medium">{entry.calories} kcal</div>
                    <div className="text-xs text-neutral">
                      P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-neutral hover:text-alert transition-colors"
                    aria-label="Delete entry"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 