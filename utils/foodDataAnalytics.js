import { supabase } from './supabaseClient';
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

// Fetch total calories for current day
export async function getTodayCalories(userId) {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    
    const { data, error } = await supabase
      .from('food_entries')
      .select('calories')
      .eq('user_id', userId)
      .gte('date', startOfToday.toISOString())
      .lte('date', endOfToday.toISOString());
      
    if (error) throw error;
    
    return data.reduce((sum, entry) => sum + (entry.calories || 0), 0);
  } catch (error) {
    console.error('Error fetching today calories:', error);
    return 0;
  }
}

// Fetch total entries count
export async function getTotalEntries(userId) {
  try {
    const { count, error } = await supabase
      .from('food_entries')
      .select('id', { count: 'exact' })
      .eq('user_id', userId);
      
    if (error) throw error;
    
    return count;
  } catch (error) {
    console.error('Error fetching total entries:', error);
    return 0;
  }
}

// Get protein, carbs, fat macros for today
export async function getTodayMacros(userId) {
  try {
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    
    const { data, error } = await supabase
      .from('food_entries')
      .select('protein, carbs, fat')
      .eq('user_id', userId)
      .gte('date', startOfToday.toISOString())
      .lte('date', endOfToday.toISOString());
      
    if (error) throw error;
    
    return {
      protein: data.reduce((sum, entry) => sum + (entry.protein || 0), 0),
      carbs: data.reduce((sum, entry) => sum + (entry.carbs || 0), 0),
      fat: data.reduce((sum, entry) => sum + (entry.fat || 0), 0)
    };
  } catch (error) {
    console.error('Error fetching today macros:', error);
    return { protein: 0, carbs: 0, fat: 0 };
  }
}

// Get weekly calorie data
export async function getWeekCalories(userId) {
  try {
    const today = new Date();
    const oneWeekAgo = subDays(today, 7);
    
    const { data, error } = await supabase
      .from('food_entries')
      .select('date, calories')
      .eq('user_id', userId)
      .gte('date', oneWeekAgo.toISOString())
      .lte('date', endOfDay(today).toISOString())
      .order('date', { ascending: true });
      
    if (error) throw error;
    
    // Group by day
    const dailyCalories = {};
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = subDays(today, i);
      const formattedDay = format(day, 'yyyy-MM-dd');
      days.unshift(formattedDay); // Add to front to get ascending order
      dailyCalories[formattedDay] = 0;
    }
    
    // Sum calories by day
    data.forEach(entry => {
      const entryDate = format(parseISO(entry.date), 'yyyy-MM-dd');
      if (dailyCalories[entryDate] !== undefined) {
        dailyCalories[entryDate] += (entry.calories || 0);
      }
    });
    
    // Convert to arrays for charting
    return {
      labels: days.map(day => format(parseISO(day), 'EEE')), // Day names (Mon, Tue, etc.)
      values: days.map(day => dailyCalories[day])
    };
  } catch (error) {
    console.error('Error fetching weekly calories:', error);
    return { labels: [], values: [] };
  }
}

// Get streak of consecutive days with entries
export async function getEntryStreak(userId) {
  try {
    const today = new Date();
    const thirtyDaysAgo = subDays(today, 30); // Look back up to 30 days
    
    const { data, error } = await supabase
      .from('food_entries')
      .select('date')
      .eq('user_id', userId)
      .gte('date', thirtyDaysAgo.toISOString())
      .lte('date', endOfDay(today).toISOString())
      .order('date', { ascending: false });
      
    if (error) throw error;
    
    if (data.length === 0) return 0;
    
    // Get unique dates (a day with multiple entries counts as one)
    const uniqueDates = new Set();
    data.forEach(entry => {
      uniqueDates.add(format(parseISO(entry.date), 'yyyy-MM-dd'));
    });
    
    const dateArray = Array.from(uniqueDates).sort().reverse(); // Most recent first
    
    // Check streak
    let streak = 1; // Start with today if there's an entry
    const todayFormatted = format(today, 'yyyy-MM-dd');
    
    // If no entry today, streak might already be 0
    if (dateArray[0] !== todayFormatted) {
      const mostRecentDate = parseISO(dateArray[0]);
      const dayDifference = Math.round(Math.abs((today - mostRecentDate) / (1000 * 60 * 60 * 24)));
      if (dayDifference > 1) return 0; // More than 1 day difference breaks streak
    }
    
    // Count consecutive days
    for (let i = 1; i < dateArray.length; i++) {
      const current = parseISO(dateArray[i - 1]);
      const previous = parseISO(dateArray[i]);
      const dayDifference = Math.round(Math.abs((current - previous) / (1000 * 60 * 60 * 24)));
      
      if (dayDifference === 1) {
        streak++;
      } else {
        break; // Streak broken
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
} 