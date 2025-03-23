import { motion } from 'framer-motion';
import Layout from './Layout';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

export default function AnimatedLayout({ children, title }) {
  return (
    <Layout title={title}>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="w-full"
      >
        {children}
      </motion.div>
    </Layout>
  );
} 