import { AnimatePresence } from 'framer-motion';
import Layout from '../components/Layout';
import { AuthProvider } from '../utils/AuthContext';
import { ToastProvider } from '../components/ui/toast';
import '../styles/globals.css';

function MyApp({ Component, pageProps, router }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Layout>
          <AnimatePresence mode="wait" initial={false}>
            <Component {...pageProps} key={router.pathname} />
          </AnimatePresence>
        </Layout>
      </ToastProvider>
    </AuthProvider>
  );
}

export default MyApp; 