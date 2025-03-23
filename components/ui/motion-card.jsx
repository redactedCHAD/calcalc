import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { cn } from "../../utils/cn";

// Create motion versions of the Card components
const MotionCard = motion(Card);
const MotionCardHeader = motion(CardHeader);
const MotionCardTitle = motion(CardTitle);
const MotionCardDescription = motion(CardDescription);
const MotionCardContent = motion(CardContent);
const MotionCardFooter = motion(CardFooter);

// Default animation presets
export const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" },
  tap: { scale: 0.98 }
};

// Enhanced card with built-in motion capabilities
export function AnimatedCard({ 
  className, 
  variants = cardVariants,
  initial = "hidden", 
  animate = "visible",
  whileHover = "hover",
  whileTap = "tap",
  children, 
  ...props 
}) {
  return (
    <MotionCard
      className={cn(className)}
      variants={variants}
      initial={initial}
      animate={animate}
      whileHover={whileHover}
      whileTap={whileTap}
      {...props}
    >
      {children}
    </MotionCard>
  );
}

export {
  MotionCard,
  MotionCardHeader,
  MotionCardTitle,
  MotionCardDescription,
  MotionCardContent,
  MotionCardFooter
}; 