import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
const THREE_ANY = THREE as any;

interface CosmicWebGLBackgroundProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
  colors?: string[];
}

export const CosmicWebGLBackground: React.FC<CosmicWebGLBackgroundProps> = ({
  className = "",
  intensity = "high",
  colors = ["#DAA520", "#228B22", "#1E3A8A", "#FF0080", "#00D9FF"],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const particlesRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE_ANY.Scene();
    sceneRef.current = scene;

    const camera = new THREE_ANY.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE_ANY.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0.1);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Create particle system
    const particleCount =
      intensity === "high" ? 5000 : intensity === "medium" ? 3000 : 1000;
    const geometry = new THREE_ANY.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors_array = new Float32Array(particleCount * 3);

    // Convert hex colors to RGB
    const rgbColors = colors.map(hex => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? [
            parseInt(result[1], 16) / 255,
            parseInt(result[2], 16) / 255,
            parseInt(result[3], 16) / 255,
          ]
        : [1, 1, 1];
    });

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.05;
      velocities[i + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i + 2] = (Math.random() - 0.5) * 0.05;

      const colorIndex = Math.floor(Math.random() * rgbColors.length);
      colors_array[i] = rgbColors[colorIndex][0];
      colors_array[i + 1] = rgbColors[colorIndex][1];
      colors_array[i + 2] = rgbColors[colorIndex][2];
    }

    geometry.setAttribute(
      "position",
      new THREE_ANY.BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "velocity",
      new THREE_ANY.BufferAttribute(velocities, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE_ANY.BufferAttribute(colors_array, 3)
    );

    const material = new THREE_ANY.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE_ANY.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Add nebula-like gradient background
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 512);
      gradient.addColorStop(0, "rgba(218, 165, 32, 0.3)");
      gradient.addColorStop(0.5, "rgba(34, 139, 34, 0.2)");
      gradient.addColorStop(1, "rgba(30, 58, 138, 0.1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }
    const texture = new THREE_ANY.CanvasTexture(canvas);
    const bgGeometry = new THREE_ANY.SphereGeometry(50, 32, 32);
    const bgMaterial = new THREE_ANY.MeshBasicMaterial({
      map: texture,
      side: THREE_ANY.BackSide,
    });
    const background = new THREE_ANY.Mesh(bgGeometry, bgMaterial);
    scene.add(background);

    // Animation loop
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.001;

      // Update particles
      const positionAttribute = geometry.getAttribute("position") as any;
      const velocityAttribute = geometry.getAttribute("velocity") as any;
      const positions = positionAttribute.array as Float32Array;
      const velocities = velocityAttribute.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Wrap around
        if (positions[i] > 10) positions[i] = -10;
        if (positions[i] < -10) positions[i] = 10;
        if (positions[i + 1] > 10) positions[i + 1] = -10;
        if (positions[i + 1] < -10) positions[i + 1] = 10;
        if (positions[i + 2] > 10) positions[i + 2] = -10;
        if (positions[i + 2] < -10) positions[i + 2] = 10;
      }
      positionAttribute.needsUpdate = true;

      // Rotate particles
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0002;

      // Rotate background
      background.rotation.x += 0.00005;
      background.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!rendererRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (
        containerRef.current &&
        renderer.domElement.parentNode === containerRef.current
      ) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      bgGeometry.dispose();
      bgMaterial.dispose();
      renderer.dispose();
    };
  }, [intensity, colors]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
