'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Route } from '../../types';
import { getRoutes } from '../../lib/api';

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchNum, setSearchNum] = useState('');
  const [serviceType, setServiceType] = useState('');

  useEffect(() => {
    async function loadRoutes() {
      setLoading(true);
      try {
        const data = await getRoutes(searchNum || undefined, serviceType || undefined);
        setRoutes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRoutes();
  }, [searchNum, serviceType]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.4rem' }}>
          Inter-Provincial Bus Routes ({routes.length})
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Explore official timetables, stopping orders, and fare stages for routable pilot bus lines.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
            Filter by Route Number
          </label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. 1, 17, 87..."
            value={searchNum}
            onChange={(e) => setSearchNum(e.target.value)}
          />
        </div>

        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
            Service Class
          </label>
          <select
            className="input-field"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          >
            <option value="">All Service Classes</option>
            <option value="NORMAL">Normal Service</option>
            <option value="SEMI_LUXURY">Semi Luxury Service</option>
          </select>
        </div>
      </div>

      {/* Routes Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Loading routable bus lines...
        </div>
      ) : routes.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
          No routes match your filter criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {routes.map((r) => (
            <Link key={r.id} href={`/routes/${r.id}`}>
              <div className="glass-card" style={{ padding: '1.25rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                    }}>
                      Route {r.routeNumber}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#06b6d4', background: 'rgba(6, 182, 212, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '9999px' }}>
                      {r.serviceType}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    {r.name || `${r.originStop?.name || 'Origin'} – ${r.destinationStop?.name || 'Destination'}`}
                  </h3>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {r.interProvincial ? 'Inter-Provincial Line' : 'Provincial Line'}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>
                    View Stops & Schedules →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
