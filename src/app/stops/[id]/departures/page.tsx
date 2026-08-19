'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { DeparturesResponse } from '../../../../types';
import { getDepartures } from '../../../../lib/api';

export default function StopDeparturesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const stopId = parseInt(resolvedParams.id, 10);

  const [data, setData] = useState<DeparturesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getDepartures(stopId, date || undefined, time || undefined);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [stopId, date, time]);

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link href="/routes" style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 600, display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to Routes
      </Link>

      {/* Stop Header */}
      {data?.stop && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🚏</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
              {data.stop.name}
            </h2>
          </div>
          {(data.stop.nameSi || data.stop.nameTa) && (
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              {[data.stop.nameSi, data.stop.nameTa].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>
      )}

      {/* Filter Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
            Date
          </label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.3rem' }}>
            Departure Time
          </label>
          <input
            type="time"
            className="input-field"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>

      {/* Departures Table / List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          Fetching scheduled departures...
        </div>
      ) : !data || data.departures.length === 0 ? (
        <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
          No upcoming scheduled departures found at this stop for the selected time.
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1rem' }}>
            Scheduled Departures ({data.totalCount})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.departures.map((dep, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', minWidth: '70px' }}>
                    {dep.scheduledDeparture.substring(0, 5)}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontWeight: 700, fontSize: '0.8rem', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        Route {dep.routeNumber}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600 }}>
                        {dep.serviceType}
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                      To: {dep.destination}
                    </div>
                  </div>
                </div>

                <Link href={`/routes/${dep.routeId}`} style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>
                  View Full Route →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
