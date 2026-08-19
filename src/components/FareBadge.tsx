import React from 'react';

interface FareBadgeProps {
  fare?: number;
  fareStatus?: 'EXACT' | 'ENDPOINT_ONLY' | 'UNAVAILABLE' | 'COMPLETE' | 'PARTIAL';
  fareType?: string;
  isTotal?: boolean;
}

export default function FareBadge({ fare, fareStatus, fareType, isTotal = false }: FareBadgeProps) {
  if (fareStatus === 'EXACT' || (isTotal && fareStatus === 'COMPLETE' && fare)) {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: isTotal ? '1.3rem' : '1rem', fontWeight: 800, color: '#10b981' }}>
          Rs. {fare?.toFixed(2)}
        </div>
        <span className="badge badge-exact" style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>
          ✓ Verified Exact Fare
        </span>
      </div>
    );
  }

  if (fareStatus === 'ENDPOINT_ONLY') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontSize: isTotal ? '1.3rem' : '1rem', fontWeight: 800, color: '#f59e0b' }}>
          Rs. {fare?.toFixed(2)}
        </div>
        <span className="badge badge-endpoint" title="Official NTC full route endpoint fare" style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>
          ★ Endpoint Fare
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <div style={{ fontSize: isTotal ? '1.1rem' : '0.9rem', fontWeight: 700, color: '#f43f5e' }}>
        Unpriced
      </div>
      <span className="badge badge-unavailable" title="Intermediate fare unpriced under official NTC policy. No fare estimated." style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>
        ℹ NTC Unpriced
      </span>
    </div>
  );
}
