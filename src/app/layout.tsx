import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';

export const metadata: Metadata = {
  title: 'Sri Lanka Bus Journey Planner | NTC Pilot',
  description: 'Official NTC 29-route pilot bus journey planner for Sri Lanka with exact timetables and verified fares.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 160px)', paddingBottom: '3rem' }}>
          {children}
        </main>
        <footer style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '1.5rem',
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.85rem'
        }}>
          Sri Lanka Bus Journey Planner • 29-Route Pilot Dataset • NTC Verified Fares (Effective July 2026)
        </footer>
      </body>
    </html>
  );
}
