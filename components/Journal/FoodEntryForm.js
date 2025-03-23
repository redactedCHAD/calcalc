import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../utils/AuthContext';

export default function FoodEntryForm({ date, onFoodAdded, scannedFood }) {
  const { user } = useAuth();
  
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [servingSize, setServingSize] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [entryDate, setEntryDate] = useState(date || new Date().toISOString().split('T')[0]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Update the date when the prop changes
  useEffect(() => {
    if (date) {
      setEntryDate(date);
    }
  }, [date]);
  
  // Fill the form with scanned food data when available
  useEffect(() => {
    if (scannedFood) {
      setFoodName(scannedFood.food_name || '');
      setCalories(scannedFood.calories?.toString() || '');
      setProtein(scannedFood.protein?.toString() || '');
      setCarbs(scannedFood.total_carbohydrate?.toString() || '');
      setFat(scannedFood.total_fat?.toString() || '');
      
      if (scannedFood.serving_qty && scannedFood.serving_unit) {
        setServingSize(`${scannedFood.serving_qty} ${scannedFood.serving_unit}`);
      }
    }
  }, [scannedFood]);
  
  const resetForm = () => {
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setServingSize('');
    setMealType('breakfast');
    // Keep the current date
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!user) {
      setError('You must be logged in to add food entries');
      setLoading(false);
      return;
    }
    
    try {
      const newEntry = {
        user_id: user.id,
        food_name: foodName,
        calories: parseInt(calories) || 0,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        serving_size: servingSize,
        meal_type: mealType,
        date: entryDate,
        created_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('food_entries')
        .insert(newEntry);
        
      if (error) throw error;
      
      // Success! Reset form and notify parent
      resetForm();
      if (onFoodAdded) onFoodAdded();
      
    } catch (error) {
      console.error('Error adding food entry:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {error && (
        <div className="bg-red-50 text-alert p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="foodName" className="block text-sm font-medium text-gray-700 mb-1">
              Food Name
            </label>
            <input
              id="foodName"
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              required
              className="input w-full"
              placeholder="e.g., Chicken Salad"
            />
          </div>
          
          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
              Calories (kcal)
            </label>
            <input
              id="calories"
              type="number"
              min="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              required
              className="input w-full"
              placeholder="e.g., 250"
            />
          </div>
          
          <div>
            <label htmlFor="servingSize" className="block text-sm font-medium text-gray-700 mb-1">
              Serving Size
            </label>
            <input
              id="servingSize"
              type="text"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
              className="input w-full"
              placeholder="e.g., 1 cup, 100g"
            />
          </div>
          
          <div>
            <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
              Protein (g)
            </label>
            <input
              id="protein"
              type="number"
              min="0"
              step="0.1"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="input w-full"
              placeholder="e.g., 20"
            />
          </div>
          
          <div>
            <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
              Carbs (g)
            </label>
            <input
              id="carbs"
              type="number"
              min="0"
              step="0.1"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="input w-full"
              placeholder="e.g., 30"
            />
          </div>
          
          <div>
            <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
              Fat (g)
            </label>
            <input
              id="fat"
              type="number"
              min="0"
              step="0.1"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="input w-full"
              placeholder="e.g., 10"
            />
          </div>
          
          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-1">
              Meal Type
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="input w-full"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              required
              className="input w-full"
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Food Entry'}
          </button>
        </div>
      </form>
    </div>
  );
} 