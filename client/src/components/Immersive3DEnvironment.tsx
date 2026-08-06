import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  description: string;
  color: string;
}

export const Immersive3DEnvironment: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0, z: 0 });
  const [playerRot, setPlayerRot] = useState({ x: 0, y: 0 });
  const [currentRoom, setCurrentRoom] = useState("lobby");
  const keysPressed = useRef<Record<string, boolean>>({});

  const rooms: Room[] = [
    {
      id: "lobby",
      name: "Sovereign Intelligence Hub",
      x: 0,
      y: 0,
      z: 0,
      description: "Central command center for cybersecurity operations",
      color: "#00d9ff",
    },
    {
      id: "lab",
      name: "Material Science Laboratory",
      x: 500,
      y: 0,
      z: 0,
      description: "Advanced research facility for composite materials",
      color: "#ffd700",
    },
    {
      id: "quantum",
      name: "Quantum Computing Chamber",
      x: 0,
      y: 500,
      z: 0,
      description: "Quantum coherence and computing research",
      color: "#ff00ff",
    },
    {
      id: "energy",
      name: "Energy Harvesting Station",
      x: -500,
      y: 0,
      z: 0,
      description: "Renewable energy generation and storage",
      color: "#00ff00",
    },
    {
      id: "ai",
      name: "AI Governance Center",
      x: 0,
      y: -500,
      z: 0,
      description: "Queen Califia ethical AI systems",
      color: "#ff6600",
    },
  ];

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update player position
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newZ = prev.z;

        const speed = 5;
        const keys = keysPressed.current;

        if (keys["w"] || keys["arrowup"]) newZ -= speed;
        if (keys["s"] || keys["arrowdown"]) newZ += speed;
        if (keys["a"] || keys["arrowleft"]) newX -= speed;
        if (keys["d"] || keys["arrowright"]) newX += speed;
        if (keys[" "]) newY += speed;
        if (keys["shift"]) newY -= speed;

        // Check room proximity
        rooms.forEach(room => {
          const dx = newX - room.x;
          const dy = newY - room.y;
          const dz = newZ - room.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 150) {
            setCurrentRoom(room.id);
          }
        });

        return { x: newX, y: newY, z: newZ };
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Handle mouse movement for rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      setPlayerRot({
        x: (y - 0.5) * Math.PI * 0.5,
        y: (x - 0.5) * Math.PI,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Render 3D environment
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 1000;
    canvas.height = 600;

    // Clear canvas
    ctx.fillStyle = "#0a0e27";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw starfield background
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 100; i++) {
      const x = (Math.sin(i * 12.9898) * 43758.5453) % canvas.width;
      const y = (Math.sin(i * 78.233) * 43758.5453) % canvas.height;
      const size = (Math.sin(i * 45.164) * 43758.5453) % 2;
      ctx.fillRect(x, y, size, size);
    }

    // Draw horizon
    ctx.fillStyle = "#1a2a4a";
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    // Draw rooms
    rooms.forEach(room => {
      const dx = room.x - playerPos.x;
      const dy = room.y - playerPos.y;
      const dz = room.z - playerPos.z;

      // Apply rotation
      const cosY = Math.cos(playerRot.y);
      const sinY = Math.sin(playerRot.y);

      const rotX = dx * cosY - dz * sinY;
      const rotZ = dx * sinY + dz * cosY;

      // Perspective projection
      if (rotZ > 0) {
        const scale = 300 / rotZ;
        const screenX = canvas.width / 2 + rotX * scale;
        const screenY = canvas.height / 2 - dy * scale * 0.5;

        const size = 50 * scale;

        // Draw room
        ctx.fillStyle = room.color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);
        ctx.globalAlpha = 1;

        // Draw border
        ctx.strokeStyle = room.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - size / 2, screenY - size / 2, size, size);

        // Draw label
        ctx.fillStyle = room.color;
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(room.name, screenX, screenY - size / 2 - 15);

        // Highlight current room
        if (room.id === currentRoom) {
          ctx.strokeStyle = "#ffd700";
          ctx.lineWidth = 3;
          ctx.strokeRect(
            screenX - size / 2 - 5,
            screenY - size / 2 - 5,
            size + 10,
            size + 10
          );
        }
      }
    });

    // Draw HUD
    ctx.fillStyle = "#00d9ff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";

    ctx.fillText(
      `Position: (${playerPos.x.toFixed(0)}, ${playerPos.y.toFixed(0)}, ${playerPos.z.toFixed(0)})`,
      10,
      20
    );
    ctx.fillText(
      `Rotation: (${((playerRot.x * 180) / Math.PI).toFixed(0)}°, ${((playerRot.y * 180) / Math.PI).toFixed(0)}°)`,
      10,
      35
    );

    const currentRoomData = rooms.find(r => r.id === currentRoom);
    if (currentRoomData) {
      ctx.fillStyle = currentRoomData.color;
      ctx.fillText(`Current: ${currentRoomData.name}`, 10, 50);
      ctx.fillStyle = "#ffd700";
      ctx.font = "11px monospace";
      ctx.fillText(currentRoomData.description, 10, 65);
    }

    // Draw controls
    ctx.fillStyle = "#00ff00";
    ctx.font = "bold 11px monospace";
    ctx.fillText(
      "WASD/Arrows: Move | Space/Shift: Up/Down | Mouse: Look",
      10,
      canvas.height - 10
    );
  }, [playerPos, playerRot, currentRoom, rooms]);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-gradient-to-b from-black/50 to-black/20 rounded-lg border border-cyan-400/30">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h3 className="text-lg font-bold text-cyan-400 mb-4 text-center">
          Immersive 3D Environment Explorer
        </h3>

        <canvas
          ref={canvasRef}
          className="w-full border border-cyan-400/20 rounded bg-black cursor-move mb-6"
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {rooms.map(room => (
            <motion.div
              key={room.id}
              className={`p-3 rounded border text-center text-xs transition-all ${
                currentRoom === room.id
                  ? "bg-black/70 border-gold-400/70"
                  : "bg-black/50 border-cyan-400/30"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="w-2 h-2 rounded-full mx-auto mb-2"
                style={{ backgroundColor: room.color }}
              />
              <div className="font-bold text-cyan-400">{room.name}</div>
              <div className="text-gold-400 mt-1 text-xs">
                {room.description}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-black/50 rounded border border-cyan-400/20">
          <h4 className="text-sm font-bold text-cyan-400 mb-2">
            Navigation Guide
          </h4>
          <div className="text-xs text-gold-400 font-mono space-y-1">
            <div>
              • Use WASD or Arrow Keys to navigate through the environment
            </div>
            <div>• Press Space to move up, Shift to move down</div>
            <div>• Move your mouse to look around</div>
            <div>• Approach rooms to enter them and view their content</div>
            <div>• Each room contains specialized research and technology</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
