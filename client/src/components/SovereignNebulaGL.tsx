import React, { useEffect, useRef } from 'react';

/**
 * SovereignNebulaGL — a true WebGL fragment shader nebula.
 * Uses raw GLSL running on a canvas element for GPU-accelerated
 * flowing plasma in TRAI sovereign gold / deep-blue / carbon palette.
 * No Three.js dependency — pure WebGL2.
 */

const VERT = `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_tint;
out vec4 fragColor;

// Hash & noise
vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                dot(p, vec2(269.5, 183.3)),
                dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash3(i + vec2(0,0)).xy, f - vec2(0,0)),
                 dot(hash3(i + vec2(1,0)).xy, f - vec2(1,0)), u.x),
             mix(dot(hash3(i + vec2(0,1)).xy, f - vec2(0,1)),
                 dot(hash3(i + vec2(1,1)).xy, f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.1;
    a *= 0.5;
  }
  return v;
}

// Stars
float star(vec2 uv, float threshold) {
  vec2 id = floor(uv * 80.0);
  vec3 h = hash3(id);
  if (h.x > threshold) return 0.0;
  vec2 local = fract(uv * 80.0) - 0.5;
  float d = length(local);
  float twinkle = 0.7 + 0.3 * sin(u_time * (2.0 + h.y * 3.0) + h.z * 6.28);
  return smoothstep(0.18, 0.0, d) * twinkle * (0.4 + h.z * 0.6);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.04;

  // Base nebula plasma
  vec2 q = vec2(fbm(p + vec2(0.0, 0.0)),
                fbm(p + vec2(5.2, 1.3)));
  vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.15 * t),
                fbm(p + 4.0 * q + vec2(8.3, 2.8) + 0.126 * t));
  float f = fbm(p + 4.0 * r);

  // TRAI color palette: deep carbon → lapis → gold
  vec3 carbon  = vec3(0.020, 0.027, 0.035);
  vec3 lapis   = vec3(0.035, 0.065, 0.145);
  vec3 indigo  = vec3(0.055, 0.035, 0.120);
  vec3 gold    = vec3(0.847, 0.667, 0.263);
  vec3 amber   = vec3(0.600, 0.380, 0.100);
  // Per-venture tint blended into the lapis layer
  vec3 tintedLapis = mix(lapis, u_tint, 0.45);

  vec3 col = mix(carbon, lapis, clamp(f * f * 4.0, 0.0, 1.0));
  col = mix(col, tintedLapis, clamp(f * f * 2.5, 0.0, 1.0));
  col = mix(col, indigo, clamp(length(q), 0.0, 1.0));
  col = mix(col, gold * 0.35, clamp(length(r.x), 0.0, 1.0));

  // Subtle gold vein
  float vein = smoothstep(0.55, 0.75, f) * 0.18;
  col += gold * vein;

  // Radial vignette — darker at edges, slightly brighter at center
  float vignette = 1.0 - smoothstep(0.4, 1.4, length(p * 0.7));
  col *= vignette;

  // Stars
  float s = star(uv, 0.04);
  col += vec3(s * 0.9, s * 0.85, s * 0.7);

  // Ensure deep black floor
  col = max(col, vec3(0.008, 0.010, 0.014));

  fragColor = vec4(col, 1.0);
}`;

type NebulaVariant = 'default' | 'cyber' | 'saffron' | 'emerald' | 'violet' | 'copper' | 'crimson';

const TINT_MAP: Record<NebulaVariant, [number, number, number]> = {
  default:  [0.035, 0.065, 0.145],  // lapis blue (TRAI home)
  cyber:    [0.020, 0.080, 0.200],  // deep cyber blue (QueenCalifia)
  saffron:  [0.200, 0.100, 0.020],  // saffron-red (True Melange Φ)
  emerald:  [0.020, 0.120, 0.070],  // forest emerald (TechBridge)
  violet:   [0.090, 0.020, 0.180],  // sovereign violet (MeLaNiNa)
  copper:   [0.180, 0.080, 0.020],  // copper-bronze (Tamerian Materials)
  crimson:  [0.180, 0.020, 0.040],  // crimson (Mela Nation)
};

export function SovereignNebulaGL({ className = '', variant = 'default' }: { className?: string; variant?: NebulaVariant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', { antialias: false, powerPreference: 'low-power' });
    if (!gl) {
      // Graceful fallback — just leave the dark background
      return;
    }

    // Compile shader
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('[NebulaGL] shader error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vert = compile(gl.VERTEX_SHADER, VERT);
    const frag = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vert || !frag) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn('[NebulaGL] link error:', gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    const uTint = gl.getUniformLocation(prog, 'u_tint');
    const tint = TINT_MAP[variant] ?? TINT_MAP.default;

    const resize = () => {
      // Render at half resolution for performance, CSS scales it up
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let startTime = 0;
    const render = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3f(uTint, tint[0], tint[1], tint[2]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(prog);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ imageRendering: 'auto' }}
    />
  );
}
