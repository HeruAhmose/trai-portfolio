import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';

interface Hub {
  id: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  schedule: string;
  hours: string;
  phone?: string;
  status: 'pilot' | 'expansion' | 'planned';
  year: number;
}

const HUBS: Hub[] = [
  {
    id: 'durham-library',
    name: 'Durham County Library',
    location: 'Durham, NC',
    coordinates: { lat: 36.0006, lng: -78.9057 },
    schedule: 'Schedule TBD',
    hours: '4–8 hrs/wk',
    status: 'pilot',
    year: 1,
  },
  {
    id: 'raleigh-impact',
    name: 'Raleigh Digital Impact Center',
    location: 'Raleigh, NC',
    coordinates: { lat: 35.7796, lng: -78.6382 },
    schedule: 'Schedule TBD',
    hours: '4–8 hrs/wk',
    status: 'pilot',
    year: 1,
  },
  {
    id: 'durham-housing',
    name: 'Durham Housing Authority',
    location: 'Durham, NC',
    coordinates: { lat: 35.9999, lng: -78.9043 },
    schedule: 'Year 2 Expansion',
    hours: 'TBD',
    status: 'expansion',
    year: 2,
  },
  {
    id: 'raleigh-housing',
    name: 'Raleigh Housing Authority',
    location: 'Raleigh, NC',
    coordinates: { lat: 35.7775, lng: -78.6368 },
    schedule: 'Year 2 Expansion',
    hours: 'TBD',
    status: 'expansion',
    year: 2,
  },
  {
    id: 'el-centro',
    name: 'El Centro Hispano',
    location: 'Durham, NC',
    coordinates: { lat: 35.9975, lng: -78.8975 },
    schedule: 'Year 2 Expansion',
    hours: 'TBD',
    status: 'expansion',
    year: 2,
  },
];

export const HubNetworkMap: React.FC = () => {
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [hoveredHub, setHoveredHub] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pilot':
        return 'border-primary bg-primary/10 shadow-primary/30';
      case 'expansion':
        return 'border-cyan-400 bg-cyan-400/10 shadow-cyan-400/20';
      case 'planned':
        return 'border-foreground/30 bg-foreground/5 shadow-foreground/10';
      default:
        return 'border-primary/30';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pilot':
        return { text: 'PILOT TARGET — YEAR 1', color: 'bg-primary text-background' };
      case 'expansion':
        return { text: 'YEAR 2 EXPANSION', color: 'bg-cyan-400 text-background' };
      case 'planned':
        return { text: 'PLANNED', color: 'bg-foreground/30 text-background' };
      default:
        return { text: 'ACTIVE', color: 'bg-primary text-background' };
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background via-background/50 to-background">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Hub Network</span>
            <span className="text-foreground/60 mx-2">·</span>
            <span className="text-cyan-400">Where We're Building</span>
          </h2>
          <p className="text-foreground/70 text-lg">
            Community technology access points across the Triangle Area
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 relative"
        >
          <div className="relative h-96 rounded-xl border-2 border-primary/30 bg-background/50 overflow-hidden">
            {/* Simplified Map Visualization */}
            <svg
              className="w-full h-full"
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Background grid */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="rgba(255,215,0,0.1)"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />

              {/* Connection lines between hubs */}
              <line
                x1="150"
                y1="100"
                x2="250"
                y2="150"
                stroke="rgba(0,217,255,0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <line
                x1="150"
                y1="100"
                x2="200"
                y2="200"
                stroke="rgba(0,217,255,0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <line
                x1="250"
                y1="150"
                x2="280"
                y2="220"
                stroke="rgba(0,217,255,0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />

              {/* Hub markers */}
              {[
                { x: 150, y: 100, id: 'durham-library', year: 1 },
                { x: 250, y: 150, id: 'raleigh-impact', year: 1 },
                { x: 200, y: 200, id: 'durham-housing', year: 2 },
                { x: 280, y: 220, id: 'raleigh-housing', year: 2 },
                { x: 120, y: 180, id: 'el-centro', year: 2 },
              ].map((marker) => (
                <g
                  key={marker.id}
                  onClick={() => setSelectedHub(marker.id)}
                  onMouseEnter={() => setHoveredHub(marker.id)}
                  onMouseLeave={() => setHoveredHub(null)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Outer glow */}
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="20"
                    fill={
                      hoveredHub === marker.id
                        ? 'rgba(255,215,0,0.2)'
                        : 'rgba(255,215,0,0.1)'
                    }
                  />
                  {/* Marker circle */}
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="10"
                    fill={marker.year === 1 ? 'rgba(255,215,0,0.8)' : 'rgba(0,217,255,0.6)'}
                    stroke={marker.year === 1 ? '#ffd700' : '#00d9ff'}
                    strokeWidth="2"
                  />
                </g>
              ))}
            </svg>

            {/* Map overlay info */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-foreground/40 font-mono text-sm">The Triangle Area</p>
                <p className="text-foreground/30 text-xs">Durham • Raleigh • Chapel Hill</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hub Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {HUBS.map((hub, idx) => (
            <motion.div
              key={hub.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
              onClick={() => setSelectedHub(selectedHub === hub.id ? null : hub.id)}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${getStatusColor(
                hub.status
              )}`}
              style={{
                boxShadow:
                  selectedHub === hub.id
                    ? `0 0 30px ${hub.status === 'pilot' ? 'rgba(255,215,0,0.4)' : 'rgba(0,217,255,0.4)'}`
                    : 'none',
              }}
            >
              {/* Status Badge */}
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${getStatusBadge(hub.status).color}`}>
                {getStatusBadge(hub.status).text}
              </div>

              {/* Hub Name */}
              <h3 className="text-lg font-bold text-foreground mb-2">{hub.name}</h3>

              {/* Location */}
              <div className="flex items-center gap-2 text-foreground/70 mb-3">
                <MapPin size={16} />
                <span className="text-sm">{hub.location}</span>
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-2 text-foreground/70 mb-2">
                <Clock size={16} />
                <span className="text-sm">{hub.schedule}</span>
              </div>

              {/* Hours */}
              <div className="text-sm text-foreground/60 mb-4">{hub.hours}</div>

              {/* Expanded Details */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: selectedHub === hub.id ? 1 : 0,
                  height: selectedHub === hub.id ? 'auto' : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4 pt-4 border-t border-primary/30"
              >
                <p className="text-sm text-foreground/70 mb-3">
                  {hub.status === 'pilot'
                    ? 'Pilot program launching in Year 1 with 4–8 hours per week of community support.'
                    : 'Expansion target for Year 2 with enhanced services and extended hours.'}
                </p>
                <a
                  href={`https://maps.google.com/?q=${hub.coordinates.lat},${hub.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-cyan-400 text-sm font-semibold transition-colors"
                >
                  Open in Maps →
                </a>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 p-6 rounded-xl border border-primary/20 bg-background/30"
        >
          <h4 className="font-bold text-primary mb-4">Hub Status Legend</h4>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-sm text-foreground/70">Pilot Program (Year 1)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-cyan-400" />
              <span className="text-sm text-foreground/70">Expansion Target (Year 2)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-foreground/30" />
              <span className="text-sm text-foreground/70">Planned Growth</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HubNetworkMap;
