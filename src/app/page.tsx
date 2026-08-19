'use client';

import { useState } from 'react';
import StopAutocomplete from '../components/StopAutocomplete';
import JourneyCard from '../components/JourneyCard';
import { Stop, JourneySearchResponse } from '../types';
import { searchJourneys } from '../lib/api';

export default function HomePage() {
  const [fromStop, setFromStop] = useState<Stop | null>(null);
  const [toStop, setToStop] = useState<Stop | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<JourneySearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fromStop || !toStop) {
      setError('Please select both origin and destination stops.');
      return;
    }
    if (fromStop.id === toStop.id) {
      setError('Origin and destination stops must be different.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await searchJourneys(fromStop.id, toStop.id, date || undefined, time || undefined);
      setResponse(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to search journeys. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const swapStops = () => {
    const temp = fromStop;
    setFromStop(toStop);
    setToStop(temp);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', lineHeight: 1.2 }}>
          Plan Your Journey Across <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sri Lanka</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Exact timetable departures and verified NTC point-to-point fares for 29 pilot inter-provincial bus routes.
        </p>
      </div>

      {/* Search Form Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <StopAutocomplete
              label="Boarding Stop"
              placeholder="e.g. Colombo Fort, Pettah..."
              selectedStop={fromStop}
              onSelectStop={setFromStop}
              icon="🟢"
            />

            <button
              type="button"
              onClick={swapStops}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#06b6d4',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.1rem',
                transition: 'all 0.2s'
              }}
              title="Swap Stops"
            >
              ⇄
            </button>

            <StopAutocomplete
              label="Destination Stop"
              placeholder="e.g. Kandy, Galle, Matara..."
              selectedStop={toStop}
              onSelectStop={setToStop}
              icon="🔴"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                Travel Date (Optional)
              </label>
              <input
                type="date"
                className="input-field"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div style={{ flex: 1, minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                Departure Time (Optional)
              </label>
              <input
                type="time"
                className="input-field"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div style={{ alignSelf: 'flex-end' }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ minWidth: '180px', height: '44px' }}>
                {loading ? 'Searching...' : '🔍 Search Journeys'}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '8px', color: '#f43f5e', fontSize: '0.9rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {response && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
                Available Journeys ({response.totalResults})
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                From <strong style={{ color: '#34d399' }}>{response.fromStop.name}</strong> to <strong style={{ color: '#f43f5e' }}>{response.toStop.name}</strong>
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748b', background: 'rgba(255, 255, 255, 0.05)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
              Timezone: Asia/Colombo
            </span>
          </div>

          {response.journeys.length === 0 ? (
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Direct or Connecting Journeys Found</p>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Try selecting major bus hubs such as Colombo Fort, Kandy, Galle, Kurunegala, or Negombo.
              </p>
            </div>
          ) : (
            <div>
              {response.journeys.map((j) => (
                <JourneyCard key={j.journeyId} journey={j} />
              ))}
            </div>
          )}

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '10px', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
            📌 <strong>NTC Policy Note:</strong> Fares marked <em>Verified Exact Fare</em> are extracted directly from official NTC matrix PDFs (July 2026). In accordance with strict NTC guidelines, unpriced intermediate stop fares are displayed as <em>Unpriced</em> to prevent misleading estimations.
          </div>
        </div>
      )}
    </div>
  );
}
