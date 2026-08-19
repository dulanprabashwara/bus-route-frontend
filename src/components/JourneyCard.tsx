'use client';

import { useState } from 'react';
import { Journey } from '../types';
import FareBadge from './FareBadge';

interface JourneyCardProps {
  journey: Journey;
}

export default function JourneyCard({ journey }: JourneyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getLabelBadgeClass = (label: string) => {
    switch (label) {
      case 'RECOMMENDED': return 'badge-recommended';
      case 'FASTEST': return 'badge-fastest';
      case 'CHEAPEST': return 'badge-cheapest';
      case 'FEWEST_TRANSFERS': return 'badge-fewest';
      default: return 'badge-recommended';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
      {/* Header Badges */}
      {journey.labels.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {journey.labels.map((lbl) => (
            <span key={lbl} className={`badge ${getLabelBadgeClass(lbl)}`}>
              ★ {lbl.replace('_', ' ')}
            </span>
          ))}
        </div>
      )}

      {/* Main Info Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Departure & Arrival Times */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              {journey.departureTime.substring(0, 5)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {journey.legs[0]?.boardingStop.name}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#06b6d4' }}>
              {journey.durationMinutes} mins
            </span>
            <div style={{ width: '100%', height: '2px', background: 'linear-gradient(90deg, #10b981, #06b6d4)', margin: '0.3rem 0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-4px', right: '0', width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {journey.transferCount === 0 ? 'Direct Journey' : `${journey.transferCount} Transfer`}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              {journey.arrivalTime.substring(0, 5)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {journey.legs[journey.legs.length - 1]?.dropOffStop.name}
            </div>
          </div>
        </div>

        {/* Fare & Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <FareBadge fare={journey.totalFare} fareStatus={journey.fareStatus === 'COMPLETE' ? 'EXACT' : 'UNAVAILABLE'} isTotal={true} />
          
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {expanded ? 'Hide Details ▲' : 'View Legs ▼'}
          </button>
        </div>
      </div>

      {/* Expandable Legs Detail */}
      {expanded && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#94a3b8', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Journey Breakdown
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {journey.legs.map((leg, idx) => (
              <div key={idx} style={{
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '10px',
                padding: '1rem',
                borderLeft: '4px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ background: '#10b981', color: '#000', fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      Bus Route {leg.routeNumber}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#06b6d4', fontWeight: 600 }}>
                      {leg.serviceType}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                    {leg.boardingStop.name} → {leg.dropOffStop.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Departs: <strong style={{ color: '#cbd5e1' }}>{leg.departureTime.substring(0, 5)}</strong> • Arrives: <strong style={{ color: '#cbd5e1' }}>{leg.arrivalTime.substring(0, 5)}</strong> ({leg.durationMinutes} mins)
                  </div>
                </div>

                <div>
                  <FareBadge fare={leg.fare} fareStatus={leg.fareStatus as any} fareType={leg.fareType} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
