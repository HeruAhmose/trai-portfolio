import React, { useEffect, useRef } from 'react';

interface ShaderConfig {
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, { value: any }>;
}

// Advanced vertex shader for morphing and deformation
const MORPH_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uIntensity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vWave;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    // Wave deformation
    float wave = sin(position.x * 3.0 + uTime) * 
                 cos(position.y * 2.0 + uTime * 0.7) * 
                 uIntensity;
    
    vec3 deformed = position + normal * wave;
    vWave = wave;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(deformed, 1.0);
  }
`;

// Advanced fragment shader with chromatic aberration and glow
const CHROMATIC_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform sampler2D uTexture;
  uniform float uChromaticAmount;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vWave;
  
  void main() {
    vec3 normal = normalize(vNormal);
    float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 3.0);
    
    // Chromatic aberration
    vec2 uv = gl_FragCoord.xy / vec2(1280.0, 720.0);
    vec3 color = vec3(0.0);
    
    color.r = texture2D(uTexture, uv + vec2(uChromaticAmount, 0.0)).r;
    color.g = texture2D(uTexture, uv).g;
    color.b = texture2D(uTexture, uv - vec2(uChromaticAmount, 0.0)).b;
    
    // Glow effect
    float glow = fresnel * (0.5 + 0.5 * sin(uTime + vWave * 10.0));
    color += vec3(0.0, 0.8, 1.0) * glow * 0.5;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Particle system shader
const PARTICLE_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aLife;
  
  uniform float uTime;
  
  varying float vLife;
  varying float vSize;
  
  void main() {
    vLife = aLife;
    vSize = aSize;
    
    vec3 pos = position;
    pos.y += sin(uTime * 2.0 + position.x) * 0.1;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (1.0 - aLife) * 10.0;
  }
`;

const PARTICLE_FRAGMENT_SHADER = `
  varying float vLife;
  varying float vSize;
  
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    if (d > 0.5) discard;
    
    float alpha = (1.0 - d * 2.0) * vLife;
    gl_FragColor = vec4(0.0, 0.8 + 0.2 * sin(vLife * 3.14), 1.0, alpha);
  }
`;

export const AdvancedShaderEffects: React.FC<{
  children?: React.ReactNode;
  intensity?: number;
  chromaticAmount?: number;
}> = ({ children, intensity = 0.5, chromaticAmount = 0.01 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Compile shader
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(MORPH_VERTEX_SHADER, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(CHROMATIC_FRAGMENT_SHADER, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up uniforms
    const uTimeLocation = gl.getUniformLocation(program, 'uTime');
    const uIntensityLocation = gl.getUniformLocation(program, 'uIntensity');
    const uChromaticLocation = gl.getUniformLocation(program, 'uChromaticAmount');

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016; // ~60fps

      gl.uniform1f(uTimeLocation, timeRef.current);
      gl.uniform1f(uIntensityLocation, intensity);
      gl.uniform1f(uChromaticLocation, chromaticAmount);

      gl.clearColor(0.05, 0.05, 0.1, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [intensity, chromaticAmount]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'radial-gradient(circle, rgba(0,200,255,0.1) 0%, rgba(0,0,0,0.9) 100%)' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AdvancedShaderEffects;
