import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const iconColors = {
  navy: 'text-navy',
  accent: 'text-accent',
  wine: 'text-wine',
  mauve: 'text-mauve',
  skyblue: 'text-skyblue',
  primary: 'text-primary',
  secondary: 'text-secondary',
  highlight: 'text-highlight'
};

export function StatCard({
  title,
  value,
  icon,
  iconColor = 'primary',
  timestamp,
  className,
  ...props
}) {
  const IconComponent = icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("stat-card", className)}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className={cn("stat-icon", iconColors[iconColor] || `text-${iconColor}`)}>
          {IconComponent && <IconComponent />}
        </div>
        <div className="text-right">
          <div className="stat-label">{title}</div>
          <div className="stat-value">{value}</div>
        </div>
      </div>
      {timestamp && (
        <div className="stat-footer">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {timestamp}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="stat-card animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        <div className="text-right">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="stat-footer">
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function StatIcon({ name }) {
  const icons = {
    database: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    wallet: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="16" y1="12" x2="16" y2="12.01" />
        <path d="M22 10a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2z" />
      </svg>
    ),
    alert: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    calories: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <path d="M12 2v20M4 6h.01M4 12h.01M4 18h.01M20 6h.01M20 12h.01M20 18h.01M10 4h4M10 20h4" />
        <path d="M8 8c0 1.1.9 2 2 2s2-.9 2-2c0-.24-.17-.33-.33-.5-.16-.16-.07-.3.1-.44.17-.17.33-.16.5-.33s.33-.67.33-1C13 5.9 12.1 5 11 5s-2 .9-2 2" />
        <path d="M16 16c0-1.1-.9-2-2-2s-2 .9-2 2c0 .24.17.33.33.5.16.16.07.3-.1.44-.17.17-.33.16-.5.33s-.33.67-.33 1c0 1.1.9 2 2 2s2-.9 2-2" />
      </svg>
    ),
    protein: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <path d="M20 5h-2.8a2.2 2.2 0 0 0-2.2 2.2V10" />
        <path d="M4 5h2.8a2.2 2.2 0 0 1 2.2 2.2V10" />
        <path d="M5 19h14" />
        <path d="M5 14h14" />
        <path d="M10 2v20" />
        <path d="M14 2v20" />
      </svg>
    ),
    journal: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    streak: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <path d="M17 3a2.85 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
    macros: () => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
        <path d="M2 12h10M12 2v10M19 15l-3-3 3-3" />
        <path d="m17 17 3-3-3.51-3.52" />
      </svg>
    ),
  };

  const Icon = icons[name] || icons.database;
  return <Icon />;
} 