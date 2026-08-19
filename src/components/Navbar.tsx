import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            🚌
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.1 }}>
              Sri Lanka Bus Planner
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, letterSpacing: '0.05em' }}>
              OFFICIAL NTC PILOT DATASET
            </span>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>
            Journey Planner
          </Link>
          <Link href="/routes" style={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }}>
            Routes & Timetables
          </Link>
        </nav>
      </div>
    </header>
  );
}
