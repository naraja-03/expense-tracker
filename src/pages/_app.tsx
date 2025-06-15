import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { FabHoverProvider } from '@/context/FabHoverContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FabHoverProvider>
      <Component {...pageProps} />
    </FabHoverProvider>
  );
}

export default MyApp;