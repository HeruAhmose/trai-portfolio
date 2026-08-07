import React, { useMemo } from "react";

interface NeonDividerProps {
  variant?: "top" | "bottom" | "full";
  color?: "magenta" | "cyan" | "gold" | "lime" | "pink";
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
  className?: string;
}

const colorMap = {
  magenta: {
    primary: "#ff00ff",
    glow: "#ff00ff",
    shadow: "#8b008b",
  },
  cyan: {
    primary: "#00ffff",
    glow: "#00ffff",
    shadow: "#008b8b",
  },
  gold: {
    primary: "#ffd700",
    glow: "#ffd700",
    shadow: "#8b6914",
  },
  lime: {
    primary: "#00ff00",
    glow: "#00ff00",
    shadow: "#008b00",
  },
  pink: {
    primary: "#ff0080",
    glow: "#ff0080",
    shadow: "#8b0040",
  },
};

const intensityMap = {
  low: { glowBlur: 10, opacity: 0.6 },
  medium: { glowBlur: 20, opacity: 0.8 },
  high: { glowBlur: 30, opacity: 1 },
};

export const NeonDivider = React.memo(
  ({
    variant = "full",
    color = "magenta",
    intensity = "high",
    animated = true,
    className = "",
  }: NeonDividerProps) => {
    const colors = colorMap[color];
    const intensitySettings = intensityMap[intensity];

    const animationStyles = useMemo(() => {
      if (!animated) return {};

      return {
        animation: `
        neon-glow-${color} 3s ease-in-out infinite,
        glitch-${color} 0.3s ease-in-out infinite
      `,
      };
    }, [animated, color]);

    const svgPath = useMemo(() => {
      // Create a wavy diagonal path
      const points = [];
      for (let i = 0; i <= 100; i += 5) {
        const x = i;
        const y = Math.sin(i / 10) * 8 + 20;
        points.push(`${x},${y}`);
      }
      return `M${points.join(" L")}`;
    }, []);

    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        {/* Main neon line */}
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="w-full h-16"
          style={animationStyles}
        >
          <defs>
            <filter
              id={`glow-${color}`}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur
                stdDeviation={intensitySettings.glowBlur}
                result="coloredBlur"
              />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glitch filter */}
            <filter id={`glitch-${color}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.9"
                numOctaves="4"
                result="noise"
                seed="2"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="2"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>

          {/* Glitch layer 1 */}
          <path
            d={svgPath}
            stroke={colors.primary}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
            filter={`url(#glitch-${color})`}
            style={{
              animation: `glitch-shift-x 0.4s ease-in-out infinite`,
            }}
          />

          {/* Glitch layer 2 */}
          <path
            d={svgPath}
            stroke={colors.primary}
            strokeWidth="0.5"
            fill="none"
            opacity="0.3"
            filter={`url(#glitch-${color})`}
            style={{
              animation: `glitch-shift-y 0.5s ease-in-out infinite`,
            }}
          />

          {/* Main line */}
          <path
            d={svgPath}
            stroke={colors.primary}
            strokeWidth="1"
            fill="none"
            filter={`url(#glow-${color})`}
            opacity={intensitySettings.opacity}
            style={{
              animation: animated
                ? `neon-pulse-${color} 2s ease-in-out infinite`
                : "none",
            }}
          />

          {/* Holographic shimmer layer */}
          <path
            d={svgPath}
            stroke={colors.primary}
            strokeWidth="0.8"
            fill="none"
            opacity="0.4"
            filter={`url(#glow-${color})`}
            style={{
              animation: animated
                ? `holographic-shimmer 3s ease-in-out infinite`
                : "none",
              mixBlendMode: "screen",
            }}
          />
        </svg>

        {/* Scanline overlay */}
        {animated && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)",
              animation: "scanline-scroll 8s linear infinite",
            }}
          />
        )}

        {/* Horizontal glow line */}
        <div
          className="absolute inset-x-0 top-1/2 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
            boxShadow: `0 0 ${intensitySettings.glowBlur}px ${colors.glow}`,
            animation: animated ? `glow-pulse 2s ease-in-out infinite` : "none",
          }}
        />

        {/* Vertical accent lines */}
        {animated && (
          <>
            <div
              className="absolute left-1/4 inset-y-0 w-px pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent, ${colors.primary}, transparent)`,
                boxShadow: `0 0 ${intensitySettings.glowBlur / 2}px ${colors.glow}`,
                animation: `vertical-pulse 3s ease-in-out infinite`,
              }}
            />
            <div
              className="absolute left-3/4 inset-y-0 w-px pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent, ${colors.primary}, transparent)`,
                boxShadow: `0 0 ${intensitySettings.glowBlur / 2}px ${colors.glow}`,
                animation: `vertical-pulse 3s ease-in-out infinite 0.5s`,
              }}
            />
          </>
        )}

        {/* Holographic particles */}
        {animated && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: colors.primary,
                  left: `${20 + i * 15}%`,
                  top: "50%",
                  boxShadow: `0 0 ${intensitySettings.glowBlur}px ${colors.glow}`,
                  animation: `holographic-particle-${i} 4s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

NeonDivider.displayName = "NeonDivider";
