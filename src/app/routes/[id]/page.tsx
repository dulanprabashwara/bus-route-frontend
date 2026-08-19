'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { RouteDetail } from '../../../types';
import { getRouteById } from '../../../lib/api';

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const routeId = parseInt(resolvedParams.id, 10);
  const [detail, setDetail] = useState<RouteDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRouteById(routeId);
        setDetail(data);
      } catch (err: any) {
        console.error(err);
        setError('Route details could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [routeId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '3rem auto', textAlign: 'center', color: '#94a3b8' }}>
        Loading route schedule and stopping sequence...
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div style={{ maxWidth: '900px', margin: '3rem auto', textAlign: 'center' }}>
        <div style={{ color: '#f43f5e', fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
          {error || 'Route Not Found'}
        </div>
        <Link href="/routes" className="btn-primary">
          ← Back to Routes
        </Link>
      </div>
    );
  }

  const { route, stops, totalStops } = detail;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link href="/routes" style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 600, display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to All Routes
      </Link>

      {/* Header Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.5rem',
            padding: '0.35rem 1rem',
            borderRadius: '10px'
          }}>
            Route {route.routeNumber}
          </span>
          <span className="badge badge-recommended" style={{ fontSize: '0.85rem' }}>
            {route.serviceType} SERVICE
          </span>
          {route.interProvincial && (
            <span className="badge badge-fastest" style={{ fontSize: '0.85rem' }}>
              INTER-PROVINCIAL
            </span>
          )}
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.75rem' }}>
          {route.name || `${route.originStop?.name} → ${route.destinationStop?.name}`}
        </h2>

        <div style={{ display: 'flex', gap: '2rem', color: '#94a3b8', fontSize: '0.95rem', flexWrap: 'wrap' }}>
          <div>
            Total Scheduled Stops: <strong style={{ color: '#f8fafc' }}>{totalStops}</strong>
          </div>
          <div>
            Source: <strong style={{ color: '#34d399' }}>Official NTC Timetable</strong>
          </div>
        </div>
      </div>

      {/* Stop Sequence List */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '1.5rem' }}>
          Stopping Order & Stages
        </h3>

        <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
          {/* Vertical Timeline Line */}
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '15px',
            bottom: '15px',
            width: '3px',
            background: 'linear-gradient(180deg, #10b981, #06b6d4, #6366f1)'
          }} />

          {stops.map((rs, idx) => (
            <div key={idx} style={{ position: 'relative', marginBottom: '1.25rem', paddingLeft: '1.5rem' }}>
              {/* Timeline Dot */}
              <div style={{
                position: 'absolute',
                left: '-20px',
                top: '4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: idx === 0 ? '#10b981' : idx === stops.length - 1 ? '#f43f5e' : '#06b6d4',
                border: '2px solid #090d16',
                boxShadow: '0 0 0 3px rgba(6, 182, 212, 0.2)'
              }} />

              <div className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                      #{rs.stopSequence}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                      {rs.stop.name}
                    </h4>
                  </div>
                  {(rs.stop.nameSi || rs.stop.nameTa) && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                      {[rs.stop.nameSi, rs.stop.nameTa].filter(Boolean).join(' • ')}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {rs.fareStage !== null && rs.fareStage !== undefined && (
                    <span style={{ fontSize: '0.8rem', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      Stage {rs.fareStage}
                    </span>
                  )}
                  <Link href={`/stops/${rs.stop.id}/departures`} style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>
                    Live Departures →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
