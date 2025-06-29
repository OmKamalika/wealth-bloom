import React, { useRef, useEffect } from 'react';

interface AgeSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  showCategories?: boolean;
}

const categories = [
  { label: 'Child', range: [0, 12] },
  { label: 'Teen', range: [13, 17] },
  { label: 'Adult', range: [18, 64] },
  { label: 'Senior', range: [65, 100] },
];

export const AgeSlider: React.FC<AgeSliderProps> = ({ value, min, max, onChange, showCategories = true }) => {
  const ageDisplayRef = useRef<HTMLDivElement>(null);

  // Animate age display on value change
  useEffect(() => {
    if (ageDisplayRef.current) {
      ageDisplayRef.current.style.transform = 'scale(1.05)';
      setTimeout(() => {
        if (ageDisplayRef.current) ageDisplayRef.current.style.transform = 'scale(1)';
      }, 150);
    }
  }, [value]);

  // Find active category
  const activeCategory = categories.find(cat => value >= cat.range[0] && value <= cat.range[1]);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 20,
      padding: 32,
      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      textAlign: 'center',
      maxWidth: 500,
      width: '100%',
      margin: '0 auto',
    }}>
      <div
        ref={ageDisplayRef}
        style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#667eea',
          margin: '24px 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
        }}
        aria-live="polite"
      >
        {value}
      </div>
      <div style={{ position: 'relative', margin: '32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.95rem', marginBottom: 8 }}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
        
        {/* Slider input with custom-slider class */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="custom-slider"
          aria-label="Select age"
        />
      </div>

      {showCategories && (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20, flexWrap: 'wrap', gap: 10 }}>
          {categories.map(cat => {
            const isActive = value >= cat.range[0] && value <= cat.range[1];
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => onChange(Math.floor((cat.range[0] + cat.range[1]) / 2))}
                style={{
                  padding: '8px 16px',
                  borderRadius: 20,
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  border: isActive ? '2px solid #667eea' : '2px solid transparent',
                  background: isActive ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f5f5f5',
                  color: isActive ? 'white' : '#999',
                  boxShadow: isActive ? '0 4px 12px rgba(102, 126, 234, 0.3)' : undefined,
                  transform: isActive ? 'translateY(-2px)' : undefined,
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                }}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};