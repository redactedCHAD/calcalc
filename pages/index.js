import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { StatCard, StatIcon } from '../components/ui/stat-card';
import { AreaChart } from '../components/ui/area-chart';
import { useAuth } from '../utils/AuthContext';
import { 
  getTodayCalories, 
  getTotalEntries, 
  getTodayMacros, 
  getWeekCalories,
  getEntryStreak
} from '../utils/foodDataAnalytics';

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    todayCalories: 0,
    totalEntries: 0,
    streak: 0,
    macros: { protein: 0, carbs: 0, fat: 0 },
    weeklyCalories: { labels: [], values: [] }
  });
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [calories, entries, macros, weekly, streak] = await Promise.all([
          getTodayCalories(user.id),
          getTotalEntries(user.id),
          getTodayMacros(user.id),
          getWeekCalories(user.id),
          getEntryStreak(user.id)
        ]);
        
        setDashboardData({
          todayCalories: calories,
          totalEntries: entries,
          macros,
          weeklyCalories: weekly,
          streak
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };

  // Format for week's calorie chart
  const chartData = {
    labels: dashboardData.weeklyCalories.labels,
    datasets: [
      { 
        label: 'Calories', 
        data: dashboardData.weeklyCalories.values 
      }
    ]
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="container mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-2 text-primary">Food Tracking Dashboard</h1>
      </motion.div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Today's Calories"
          value={`${dashboardData.todayCalories} cal`}
          icon={() => <StatIcon name="calories" />}
          iconColor="accent"
          timestamp="Updated now"
        />
        
        <StatCard
          title="Journal Entries"
          value={dashboardData.totalEntries}
          icon={() => <StatIcon name="journal" />}
          iconColor="primary"
          timestamp="Total entries"
        />
        
        <StatCard
          title="Day Streak"
          value={dashboardData.streak}
          icon={() => <StatIcon name="streak" />}
          iconColor="secondary"
          timestamp="Consecutive days"
        />
      </div>
      
      {/* Area Chart */}
      <AreaChart
        title="Weekly Calorie Intake"
        subtitle="Last 7 days consumption"
        data={chartData}
        className="mb-8"
      />
      
      {/* Macros breakdown and quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-primary mb-4">Today's Macros</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-accent">{dashboardData.macros.protein}g</div>
              <div className="text-sm text-gray-500">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-highlight">{dashboardData.macros.carbs}g</div>
              <div className="text-sm text-gray-500">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-secondary">{dashboardData.macros.fat}g</div>
              <div className="text-sm text-gray-500">Fat</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col justify-between">
          <h3 className="text-lg font-medium text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/journal" passHref>
              <motion.div 
                className="p-4 bg-primary bg-opacity-10 rounded-md text-center cursor-pointer"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-sm font-medium">Add Food</div>
              </motion.div>
            </Link>
            
            <Link href="/scan" passHref>
              <motion.div 
                className="p-4 bg-accent bg-opacity-10 rounded-md text-center cursor-pointer"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-sm font-medium">Scan Barcode</div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      <motion.div 
        className="mt-6 bg-white p-4 rounded-lg shadow-sm border-l-4 border-accent"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="font-medium text-primary">Nutrition Tips</h3>
        <p className="text-sm text-gray-600 mt-1">
          Try to balance your macros for better overall health. Aim for a good mix of proteins, complex carbs, and healthy fats throughout the day.
        </p>
      </motion.div>
    </motion.div>
  );
} 