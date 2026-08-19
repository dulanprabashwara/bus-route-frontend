'use client';

import { useState, useEffect, useRef } from 'react';
import { Stop } from '../types';
import { searchStops } from '../lib/api';

interface StopAutocompleteProps {
  label: string;
  placeholder: string;
  selectedStop: Stop | null;
  onSelectStop: (stop: Stop | null) => void;
  icon?: string;
}

export default function StopAutocomplete({ label, placeholder, selectedStop, onSelectStop, icon = '📍' }: StopAutocompleteProps) {
  const [query, setQuery] = useState(selectedStop ? selectedStop.name : '');
  const [suggestions, setSuggestions] = useState<Stop[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedStop) {
      setQuery(selectedStop.name);
    }
  }, [selectedStop]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2 && (!selectedStop || query !== selectedStop.name)) {
        setLoading(true);
        try {
          const results = await searchStops(query);
          setSuggestions(results);
          setIsOpen(true);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      } else if (query.trim().length < 2) {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedStop]);

  const handleSelect = (stop: Stop) => {
    onSelectStop(stop);
    setQuery(stop.name);
    setIsOpen(false);
  };

  const handleClear = () => {
    onSelectStop(null);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flex: 1 }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <span style={{ position: 'absolute', left: '1rem', fontSize: '1.1rem', pointerEvents: 'none' }}>
          {icon}
        </span>
        <input
          type="text"
          className="input-field"
          style={{ paddingLeft: '2.8rem', paddingRight: query ? '2.5rem' : '1rem' }}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selectedStop) onSelectStop(null);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '0.75rem',
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '1.1rem',
              padding: '0.2rem'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          maxHeight: '260px',
          overflowY: 'auto',
          zIndex: 100,
          padding: '0.4rem',
          background: '#0f172a'
        }}>
          {loading ? (
            <div style={{ padding: '0.75rem', color: '#94a3b8', textAlign: 'center', fontSize: '0.9rem' }}>
              Searching stops...
            </div>
          ) : suggestions.length === 0 ? (
            <div style={{ padding: '0.75rem', color: '#64748b', textAlign: 'center', fontSize: '0.9rem' }}>
              No routable stops found
            </div>
          ) : (
            suggestions.map((stop) => (
              <div
                key={stop.id}
                onClick={() => handleSelect(stop)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                    {stop.name}
                  </div>
                  {(stop.nameSi || stop.nameTa) && (
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                      {[stop.nameSi, stop.nameTa].filter(Boolean).join(' • ')}
                    </div>
                  )}
                </div>
                {stop.district && (
                  <span style={{ fontSize: '0.75rem', color: '#64748b', background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {stop.district}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
