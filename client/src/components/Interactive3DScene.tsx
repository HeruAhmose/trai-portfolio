import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
const THREE_ANY = THREE as any;
import { motion } from 'framer-motion';

interface Interactive3DSceneProps {
  className?: string;
  onProjectClick?: (projectId: string) => void;
}

interface Project3D {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
  scale: number;
  description: string;
}

/**
 * Interactive 3D scene with rotating holographic project models
 * Features:
 * - Rotating 3D geometries representing projects
 * - Click-to-interact functionality
 * - Hover effects and glow
 * - Smooth camera animations
 * - Particle effects around objects
 */
export const Interactive3DScene: React.FC<Interactive3DSceneProps> = ({
  className = '',
  onProjectClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const projectsRef = useRef<Map<string, any>>(new Map());
  const raycasterRef = useRef(new THREE_ANY.Raycaster());
  const mouseRef = useRef(new THREE_ANY.Vector2());
  const animationFrameRef = useRef<number | null>(null);

  const projects: Project3D[] = [
    {
      id: 'cybersecurity',
      name: 'Cybersecurity',
      color: '#FF0080',
      position: [-3, 0, 0],
      scale: 1.5,
      description: 'Quantum-ready security architecture',
    },
    {
      id: 'materials',
      name: 'Material Science',
      color: '#DAA520',
      position: [0, 0, 0],
      scale: 2,
      description: 'Multi-modal composite transduction',
    },
    {
      id: 'community',
      name: 'Community Impact',
      color: '#00D9FF',
      position: [3, 0, 0],
      scale: 1.5,
      description: 'TechBridge Collective',
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE_ANY.Scene();
    scene.background = new THREE_ANY.Color(0x000000);
    scene.fog = new THREE_ANY.Fog(0x000000, 20, 100);
    sceneRef.current = scene;

    const camera = new THREE_ANY.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    cameraRef.current = camera;

    const renderer = new THREE_ANY.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE_ANY.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE_ANY.PointLight(0xff0080, 1.5, 100);
    pointLight1.position.set(5, 5, 5);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE_ANY.PointLight(0x00d9ff, 1.5, 100);
    pointLight2.position.set(-5, 5, 5);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    const pointLight3 = new THREE_ANY.PointLight(0xdaa520, 1, 100);
    pointLight3.position.set(0, -5, 5);
    pointLight3.castShadow = true;
    scene.add(pointLight3);

    // Create project geometries
    projects.forEach((project) => {
      const geometry = new THREE_ANY.IcosahedronGeometry(project.scale, 4);
      const material = new THREE_ANY.MeshPhongMaterial({
        color: project.color,
        emissive: project.color,
        emissiveIntensity: 0.3,
        shininess: 100,
        wireframe: false,
      });

      const mesh = new THREE_ANY.Mesh(geometry, material);
      mesh.position.set(...project.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { projectId: project.id, isProject: true };

      scene.add(mesh);
      projectsRef.current.set(project.id, mesh);

      // Add glow effect
      const glowGeometry = new THREE_ANY.IcosahedronGeometry(project.scale * 1.2, 4);
      const glowMaterial = new THREE_ANY.MeshBasicMaterial({
        color: project.color,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
      });
      const glowMesh = new THREE_ANY.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.copy(mesh.position);
      scene.add(glowMesh);

      // Store glow mesh for animation
      mesh.userData.glowMesh = glowMesh;
    });

    // Add stars
    const starsGeometry = new THREE_ANY.BufferGeometry();
    const starsMaterial = new THREE_ANY.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      sizeAttenuation: true,
    });

    const starsVertices = [];
    for (let i = 0; i < 1000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE_ANY.BufferAttribute(new Float32Array(starsVertices), 3));
    const stars = new THREE_ANY.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Mouse interaction
    const onMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onMouseClick = (event: MouseEvent) => {
      raycasterRef.current.setFromCamera(mouseRef.current, camera);

      const intersects = raycasterRef.current.intersectObjects(
        Array.from(projectsRef.current.values())
      );

      if (intersects.length > 0) {
        const clicked = intersects[0].object as any;
        const projectId = clicked.userData.projectId;
        if (onProjectClick) {
          onProjectClick(projectId);
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onMouseClick);

    // Animation loop
    let time = 0;
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Rotate projects
      projectsRef.current.forEach((mesh) => {
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        mesh.rotation.z += 0.002;

        // Pulse scale
        const scale = 1 + Math.sin(time + mesh.userData.projectId.length) * 0.1;
        mesh.scale.set(scale, scale, scale);

        // Rotate glow mesh
        if (mesh.userData.glowMesh) {
          mesh.userData.glowMesh.rotation.copy(mesh.rotation);
          mesh.userData.glowMesh.scale.copy(mesh.scale);
          mesh.userData.glowMesh.position.copy(mesh.position);
        }
      });

      // Rotate stars
      stars.rotation.x += 0.0001;
      stars.rotation.y += 0.0002;

      // Smooth camera follow
      camera.position.x += (mouseRef.current.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!rendererRef.current || !cameraRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onProjectClick]);

  return (
    <motion.div
      ref={containerRef}
      className={`fixed inset-0 -z-10 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
