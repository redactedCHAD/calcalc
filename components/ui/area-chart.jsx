import React from 'react';
import { motion } from 'framer-motion';

export const AreaChart = ({ 
  title,
  subtitle,
  data,
  colors = ['#4E729A', '#C57B8D', '#A6758C', '#93D1F0'],
  height = 300,
  className
}) => {
  // If no real data is provided, use mockChartPoints
  const useRealData = data?.datasets?.[0]?.data?.length > 0 && data.labels?.length > 0;
  
  // Default mock data
  const mockChartPoints = [
    { time: 'Mon', values: [250, 60, 30] },
    { time: 'Tue', values: [340, 120, 80] },
    { time: 'Wed', values: [400, 140, 110] },
    { time: 'Thu', values: [520, 200, 120] },
    { time: 'Fri', values: [560, 230, 170] },
    { time: 'Sat', values: [600, 250, 220] },
    { time: 'Sun', values: [750, 350, 280] }
  ];

  // Convert real data format to our internal format
  const chartPoints = useRealData 
    ? data.labels.map((label, index) => ({
        time: label,
        values: data.datasets.map(dataset => dataset.data[index] || 0)
      }))
    : mockChartPoints;
    
  // Find max value for scaling
  const allValues = chartPoints.flatMap(point => point.values);
  const maxValue = Math.max(...allValues, 1000); // Min 1000 for better visualization
  
  // SVG path creator helper
  const createPath = (points, index) => {
    // For simple visualization, we'll create a simple area path
    const maxHeight = height - 40; // Leave space for labels
    const width = 100 / (points.length - 1);
    
    // Start at the first point
    let path = `M 0,${maxHeight - (points[0].values[index] / maxValue) * maxHeight} `;
    
    // Add line to each point
    for (let i = 1; i < points.length; i++) {
      const x = i * width;
      const y = maxHeight - (points[i].values[index] / maxValue) * maxHeight;
      path += `L ${x},${y} `;
    }
    
    // Complete the area by going to the bottom right and then left
    const lastIdx = points.length - 1;
    path += `L ${lastIdx * width},${maxHeight} L 0,${maxHeight} Z`;
    
    return path;
  };
  
  // Get Y-axis labels (increments based on max value)
  const getYAxisLabels = () => {
    const step = Math.ceil(maxValue / 5 / 100) * 100; // Round to nearest 100
    const labels = [];
    for (let i = 0; i <= 5; i++) {
      labels.push(i * step);
    }
    return labels.reverse();
  };

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      
      <div style={{ height: `${height}px`, position: 'relative' }}>
        {/* Chart display area */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 20, 40, 60, 80, 100].map(y => (
            <line 
              key={y} 
              x1="0" 
              y1={y} 
              x2="100" 
              y2={y} 
              stroke="#f1f1f1" 
              strokeWidth="0.5" 
            />
          ))}
          
          {/* Areas */}
          {data?.datasets?.map((dataset, datasetIndex) => (
            useRealData && datasetIndex < chartPoints[0].values.length ? (
              <motion.path
                key={datasetIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1, delay: datasetIndex * 0.2 }}
                d={createPath(chartPoints, datasetIndex)}
                fill={colors[datasetIndex % colors.length]}
                className="transition-all duration-300"
              />
            ) : null
          ))}
          
          {/* Mock data when real data is not available */}
          {!useRealData && (
            <>
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1 }}
                d={createPath(mockChartPoints, 0)}
                fill={colors[0]}
                className="transition-all duration-300"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1, delay: 0.2 }}
                d={createPath(mockChartPoints, 1)}
                fill={colors[1]}
                className="transition-all duration-300"
              />
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ duration: 1, delay: 0.4 }}
                d={createPath(mockChartPoints, 2)}
                fill={colors[2]}
                className="transition-all duration-300"
              />
            </>
          )}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between text-xs text-gray-400 absolute bottom-0 w-full">
          {chartPoints.map((point, index) => (
            <div key={index}>{point.time}</div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
          {getYAxisLabels().map((value, index) => (
            <div key={index}>{value}</div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4">
        {data?.datasets?.map((dataset, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm">{dataset.label}</span>
          </div>
        ))}
        
        {!useRealData && mockChartPoints[0].values.map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: colors[index] }}
            ></div>
            <span className="text-sm">Dataset {index + 1}</span>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-gray-400 flex items-center mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
        Updated now
      </div>
    </div>
  );
}; 