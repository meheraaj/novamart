import { Inter, Manrope } from 'next/font/google';
import ManagedModal from '@components/common/modal/managed-modal';
import { ManagedUIContext } from '@contexts/ui.context';
import ManagedDrawer from '@components/common/drawer/managed-drawer';
import ToasterProvider from './provider/toaster-provider';
import Providers from './provider/provider';
import AntiqueRefinedLayout from './components/layouts/layout'; // IMPORTED HERE

// Global Styles
import '@assets/css/scrollbar.css';
import '@assets/css/swiper-carousel.css';
import '@assets/css/custom-plugins.css';
import './globals.css';
import '@assets/css/rc-drawer.css';

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const manrope = Manrope({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const metadata = {
  title: {
    template: 'NovaMart | %s',
    default: 'NovaMart',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning={true}>
      <body
        className={`${inter.variable} ${manrope.variable}`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <ManagedUIContext>
            {/* WRAPPED EVERYTHING IN ANTIQUE LAYOUT */}
            <AntiqueRefinedLayout>
              {children}
            </AntiqueRefinedLayout>

            <ManagedModal />
            <ManagedDrawer />
            <ToasterProvider />
          </ManagedUIContext>
        </Providers>
      </body>
    </html>
  );
}