import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ZeroCup Predict | AI-Native World Cup Prediction Market',
  description: 'AI-Native prediction market built on 0G Chain modular execution, data availability, and verifiable compute.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen selection:bg-cyan-500/30`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
