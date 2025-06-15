import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AppProvider } from '@/context/AppContext';
import { ExpenseDataProvider } from '@/context/ExpenseDataContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <ExpenseDataProvider>
        <Component {...pageProps} />
      </ExpenseDataProvider>
    </AppProvider>
  );
}

export default MyApp;