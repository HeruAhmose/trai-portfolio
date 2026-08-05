import React, { useEffect, useRef } from 'react';

export const WebGLShaderEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2');
    if (!gl) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Vertex shader
    const vertexShaderSource = `#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }
    `;

    // Fragment shader with advanced effects
    const fragmentShaderSource = `#version 300 es
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mouse;
      out vec4 outColor;

      // Noise function
      float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = mix(
          mix(mix(sin(dot(i + vec3(0), vec3(12.9898, 78.233, 45.164))) * 43758.5453, 
                  sin(dot(i + vec3(1, 0, 0), vec3(12.9898, 78.233, 45.164))) * 43758.5453, f.x),
              mix(sin(dot(i + vec3(0, 1, 0), vec3(12.9898, 78.233, 45.164))) * 43758.5453,
                  sin(dot(i + vec3(1, 1, 0), vec3(12.9898, 78.233, 45.164))) * 43758.5453, f.x), f.y),
          mix(mix(sin(dot(i + vec3(0, 0, 1), vec3(12.9898, 78.233, 45.164))) * 43758.5453,
                  sin(dot(i + vec3(1, 0, 1), vec3(12.9898, 78.233, 45.164))) * 43758.5453, f.x),
              mix(sin(dot(i + vec3(0, 1, 1), vec3(12.9898, 78.233, 45.164))) * 43758.5453,
                  sin(dot(i + vec3(1, 1, 1), vec3(12.9898, 78.233, 45.164))) * 43758.5453, f.x), f.y), f.z);
        return fract(n);
      }

      // Fractal Brownian Motion
      float fbm(vec3 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for(int i = 0; i < 5; i++) {
          value += amplitude * noise(p);
          p *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 center = vec2(0.5);
        float dist = distance(uv, center + mouse * 0.1);
        
        // Create multiple layers of effects
        float pattern1 = fbm(vec3(uv * 3.0, time * 0.5));
        float pattern2 = fbm(vec3(uv * 5.0 + time * 0.3, time * 0.2));
        float pattern3 = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time);
        
        // Combine patterns
        float combined = mix(pattern1, pattern2, 0.5) + pattern3 * 0.3;
        combined = sin(combined * 3.14159);
        
        // Add radial gradient
        float radial = 1.0 - dist * 2.0;
        combined *= radial;
        
        // Color mapping
        vec3 color = vec3(
          sin(combined + time) * 0.5 + 0.5,
          sin(combined + time + 2.0) * 0.5 + 0.5,
          sin(combined + time + 4.0) * 0.5 + 0.5
        );
        
        // Neon glow effect
        color += vec3(0.0, 1.0, 1.0) * (1.0 - dist) * 0.5;
        
        outColor = vec4(color, 1.0);
      }
    `;

    // Compile shader
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    // Create buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1, -1, 1, -1, -1, 1, 1, 1,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Get attribute location
    const positionAttributeLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');
    const timeUniformLocation = gl.getUniformLocation(program, 'time');
    const mouseUniformLocation = gl.getUniformLocation(program, 'mouse');

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    });

    // Animation loop
    let startTime = Date.now();
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      gl.useProgram(program);
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
      gl.uniform1f(timeUniformLocation, elapsed);
      gl.uniform2f(mouseUniformLocation, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', () => {});
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 opacity-20"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
