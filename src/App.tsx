import { useState, useRef, useCallback, useEffect, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sky, Stars, Text, Html, useProgress } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Building2, Trees, Users, Play, ArrowLeft, Sun, Moon, ChevronUp, ChevronDown } from 'lucide-react'

type TimeOfDay = 'day' | 'night'
type BuildingType = 'office' | 'hotel' | 'mall' | 'residential' | 'government'
type GameState = 'menu' | 'playing'

interface BuildingData {
  id: string
  name: string
  type: BuildingType
  position: [number, number, number]
  size: [number, number, number]
  color: string
  floors: number
}

const BUILDINGS_DATA: BuildingData[] = [
  { id: 'b1', name: 'Metro Tower', type: 'office', position: [0, 30, 0], size: [22, 60, 22], color: '#3a4a5e', floors: 20 },
  { id: 'b2', name: 'Grand Plaza Hotel', type: 'hotel', position: [80, 25, 0], size: [32, 50, 32], color: '#4a5a6e', floors: 15 },
  { id: 'b3', name: 'Central Mall', type: 'mall', position: [-80, 15, 0], size: [50, 32, 42], color: '#5a4a6e', floors: 3 },
  { id: 'b4', name: 'Skyline Apartments', type: 'residential', position: [0, 20, 80], size: [20, 42, 20], color: '#4a5e5a', floors: 25 },
  { id: 'b5', name: 'Tech Hub', type: 'office', position: [60, 28, 60], size: [24, 56, 24], color: '#3e4a5e', floors: 18 },
  { id: 'b6', name: 'City Hall', type: 'government', position: [-60, 22, -60], size: [30, 46, 30], color: '#4a4a5e', floors: 8 },
]

// ============================================
// LOADING COMPONENT
// ============================================
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="text-white text-center bg-black/70 p-6 rounded-2xl backdrop-blur-md">
        <div className="text-2xl font-bold mb-2">🏗️ Loading 3D City...</div>
        <div className="text-3xl font-mono text-cyan-400">{Math.round(progress)}%</div>
      </div>
    </Html>
  )
}

// ============================================
// INTERIOR FLOOR COMPONENTS - UNIQUE LAYOUTS
// ============================================
function OfficeFloor({ name, floor, onExit }: { name: string; floor: number; onExit: () => void }) {
  const layout = useMemo(() => floor % 3, [floor])
  
  return (
    <group>
      {/* Room shell */}
      <mesh position={[0, 15, 0]}>
        <boxGeometry args={[50, 30, 50]} />
        <meshStandardMaterial color="#f8f8f8" side={THREE.BackSide} />
      </mesh>
      
      {/* Floor */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#5a7a9a" roughness={0.8} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 29.9, 0]} rotation={[-Math.PI, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      
      {/* Headers */}
      <Text position={[0, 28, -22]} fontSize={3} color="#1a1a2a" anchorX="center" fontWeight="bold">
        {name}
      </Text>
      <Text position={[0, 24, -22]} fontSize={2} color="#444" anchorX="center">
        Floor {floor} {floor === 1 ? '- RECEPTION' : '- OFFICE'}
      </Text>
      
      {/* Furniture based on layout */}
      {layout === 0 && (
        // Cubicle layout
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <group key={i} position={[((i % 4) - 1.5) * 11, 0, (Math.floor(i / 4) - 1) * 11]}>
              <mesh castShadow position={[0, 2.5, 0]}>
                <boxGeometry args={[8, 5, 4]} />
                <meshStandardMaterial color="#e0e0e0" />
              </mesh>
              <mesh position={[0, 5.1, 0]}>
                <boxGeometry args={[7, 0.2, 3]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
            </group>
          ))}
        </>
      )}
      
      {layout === 1 && (
        // Open office
        <>
          {Array.from({ length: 16 }).map((_, i) => (
            <group key={i} position={[((i % 4) - 1.5) * 10, 0, (Math.floor(i / 4) - 1.5) * 10]}>
              <mesh castShadow position={[0, 2, 0]}>
                <boxGeometry args={[6, 4, 6]} />
                <meshStandardMaterial color="#d0d0d0" />
              </mesh>
            </group>
          ))}
        </>
      )}
      
      {layout === 2 && (
        // Meeting rooms
        <>
          {[[-15, -15], [15, -15], [-15, 15], [15, 15]].map((pos, i) => (
            <mesh key={i} position={[pos[0], 3.5, pos[1]]} castShadow>
              <cylinderGeometry args={[7, 7, 7]} />
              <meshStandardMaterial color="#c0c0c0" />
            </mesh>
          ))}
        </>
      )}
      
      {/* Reception desk on floor 1 */}
      {floor === 1 && (
        <>
          <mesh position={[0, 3, -18]} castShadow>
            <boxGeometry args={[18, 6, 3]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <Text position={[0, 6.5, -16.5]} fontSize={1.8} color="#fff" anchorX="center">
            RECEPTION
          </Text>
        </>
      )}
      
      {/* Exit Button */}
      <group position={[0, 8, 22]}>
        <mesh onClick={(e) => { e.stopPropagation(); onExit(); }}>
          <boxGeometry args={[10, 8, 2]} />
          <meshStandardMaterial color="#ff4444" emissive="#aa0000" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 2, 1.2]} fontSize={2} color="#fff" anchorX="center" fontWeight="bold">
          EXIT
        </Text>
      </group>
      
      {/* Info panel */}
      <group position={[16, 18, 0]}>
        <mesh>
          <planeGeometry args={[12, 10]} />
          <meshBasicMaterial color="#1a1a2e" transparent opacity={0.85} />
        </mesh>
        <Text position={[0, 3, 0.1]} fontSize={1.5} color="#00ffff" anchorX="center">{name}</Text>
        <Text position={[0, 0.5, 0.1]} fontSize={2} color="#fff" anchorX="center" fontWeight="bold">Floor {floor}</Text>
        <Text position={[0, -2, 0.1]} fontSize={0.9} color="#0f0" anchorX="center">
          {layout === 0 ? 'Cubicle Layout' : layout === 1 ? 'Open Office' : 'Meeting Rooms'}
        </Text>
      </group>
      
      {/* Bright lighting */}
      <ambientLight intensity={0.95} />
      <directionalLight position={[20, 40, 20]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 25, 0]} intensity={1.4} color="#fff" distance={60} />
    </group>
  )
}

function HotelFloor({ name, floor, onExit }: { name: string; floor: number; onExit: () => void }) {
  const roomType = useMemo(() => floor % 3, [floor])
  const colors = ['#4682B4', '#8B4513', '#2F4F4F']
  
  return (
    <group>
      <mesh position={[0, 20, 0]}>
        <boxGeometry args={[60, 40, 60]} />
        <meshStandardMaterial color="#f0e6d2" side={THREE.BackSide} />
      </mesh>
      
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#d0c0b0" roughness={0.6} />
      </mesh>
      
      <Text position={[0, 35, -25]} fontSize={3.5} color="#1a1a2a" anchorX="center" fontWeight="bold">
        {name}
      </Text>
      <Text position={[0, 30, -25]} fontSize={2} color="#8B4513" anchorX="center">
        {floor === 1 ? 'LOBBY' : `Floor ${floor}`}
      </Text>
      
      {floor === 1 ? (
        // Lobby
        <>
          <mesh position={[0, 5, -25]} castShadow>
            <boxGeometry args={[30, 10, 4]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <Text position={[0, 11, -23]} fontSize={3} color="#D4AF37" anchorX="center">
            LOBBY
          </Text>
          {[[-18, -18], [0, -18], [18, -18]].map((p, i) => (
            <mesh key={i} position={[p[0], 4, p[1]]} castShadow>
              <boxGeometry args={[14, 8, 5]} />
              <meshStandardMaterial color="#654321" />
            </mesh>
          ))}
          {/* Chandelier */}
          <group position={[0, 35, 0]}>
            <mesh>
              <cylinderGeometry args={[0.5, 0.5, 6]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} />
            </mesh>
            <pointLight position={[0, -4, 0]} intensity={2} color="#ffdd88" distance={40} />
          </group>
        </>
      ) : (
        // Hotel rooms
        <>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[((i % 4) - 1.5) * 13, 5, (Math.floor(i / 4) - 0.5) * 18]} 
              castShadow
            >
              <boxGeometry args={[10, 10, 12]} />
              <meshStandardMaterial color={colors[roomType]} />
            </mesh>
          ))}
        </>
      )}
      
      <group position={[0, 10, 28]}>
        <mesh onClick={(e) => { e.stopPropagation(); onExit(); }}>
          <boxGeometry args={[10, 8, 2]} />
          <meshStandardMaterial color="#ff4444" emissive="#aa0000" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 2, 1.2]} fontSize={2} color="#fff" anchorX="center">EXIT</Text>
      </group>
      
      <ambientLight intensity={0.9} />
      <directionalLight position={[20, 40, 20]} intensity={1.5} castShadow />
      <pointLight position={[0, 35, 0]} intensity={1.3} color="#fff" distance={60} />
    </group>
  )
}

function MallFloor({ name, floor, onExit }: { name: string; floor: number; onExit: () => void }) {
  return (
    <group>
      <mesh position={[0, 25, 0]}>
        <boxGeometry args={[80, 50, 80]} />
        <meshStandardMaterial color="#fff" side={THREE.BackSide} />
      </mesh>
      
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#eee" roughness={0.3} />
      </mesh>
      
      <Text position={[0, 40, 0]} fontSize={4} color="#222" anchorX="center" fontWeight="bold">
        {name}
      </Text>
      <Text position={[0, 35, 0]} fontSize={2} color="#666" anchorX="center">
        Level {floor}
      </Text>
      
      {floor === 1 && ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'].map((color, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(angle) * 28, 0, Math.sin(angle) * 28]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh castShadow position={[0, 10, 0]}>
              <boxGeometry args={[14, 20, 12]} />
              <meshStandardMaterial color={color} />
            </mesh>
            <Text position={[0, 10, 6.2]} fontSize={2} color="#333" anchorX="center" fontWeight="bold">
              SHOP {i + 1}
            </Text>
          </group>
        )
      })}
      
      {floor === 2 && (
        <>
          <mesh position={[0, 3, 0]} castShadow>
            <boxGeometry args={[40, 6, 40]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[((i % 3) - 1) * 18, 6, (Math.floor(i / 3) - 0.5) * 22]} 
              castShadow
            >
              <boxGeometry args={[14, 12, 10]} />
              <meshStandardMaterial color={['#ff6b6b', '#4ecdc4', '#f9ca24', '#6c5ce7', '#a29bfe', '#ff9f43'][i]} />
            </mesh>
          ))}
        </>
      )}
      
      {floor === 3 && (
        <>
          <mesh position={[-20, 8, 0]} castShadow>
            <boxGeometry args={[25, 16, 40]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <Text position={[-20, 17, 0]} fontSize={2} color="#fff" anchorX="center">CINEMA</Text>
          <mesh position={[20, 6, 0]} castShadow>
            <boxGeometry args={[25, 12, 30]} />
            <meshStandardMaterial color="#4a0080" />
          </mesh>
          <Text position={[20, 12.5, 0]} fontSize={2} color="#fff" anchorX="center">ARCADE</Text>
        </>
      )}
      
      <group position={[0, 12, 35]}>
        <mesh onClick={(e) => { e.stopPropagation(); onExit(); }}>
          <boxGeometry args={[10, 8, 2]} />
          <meshStandardMaterial color="#ff4444" emissive="#aa0000" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 2, 1.2]} fontSize={2} color="#fff" anchorX="center">EXIT</Text>
      </group>
      
      <ambientLight intensity={0.95} />
      <directionalLight position={[20, 50, 20]} intensity={1.6} castShadow />
      <pointLight position={[0, 45, 0]} intensity={1.4} color="#fff" distance={70} />
    </group>
  )
}

function ResidentialFloor({ name, floor, onExit }: { name: string; floor: number; onExit: () => void }) {
  const layout = useMemo(() => floor % 4, [floor])
  
  return (
    <group>
      <mesh position={[0, 12, 0]}>
        <boxGeometry args={[45, 24, 45]} />
        <meshStandardMaterial color="#f5f5f0" side={THREE.BackSide} />
      </mesh>
      
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[45, 45]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      
      <Text position={[0, 20, 0]} fontSize={2.5} color="#222" anchorX="center" fontWeight="bold">
        {name}
      </Text>
      <Text position={[0, 16, 0]} fontSize={1.8} color="#666" anchorX="center">
        Unit {100 + floor} - Floor {floor}
      </Text>
      
      {layout === 0 && (
        <>
          <mesh position={[-10, 3, -10]} castShadow>
            <boxGeometry args={[12, 6, 10]} />
            <meshStandardMaterial color="#4682B4" />
          </mesh>
          <mesh position={[10, 4, -10]} castShadow>
            <boxGeometry args={[12, 8, 12]} />
            <meshStandardMaterial color="#e0e0e0" />
          </mesh>
        </>
      )}
      
      {layout === 1 && (
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[30, 8, 20]} />
          <meshStandardMaterial color="#4682B4" />
        </mesh>
      )}
      
      {layout === 2 && (
        <>
          <mesh position={[-10, 3, 0]} castShadow>
            <boxGeometry args={[10, 6, 15]} />
            <meshStandardMaterial color="#4682B4" />
          </mesh>
          <mesh position={[10, 3, 0]} castShadow>
            <boxGeometry args={[10, 6, 15]} />
            <meshStandardMaterial color="#4682B4" />
          </mesh>
        </>
      )}
      
      {layout === 3 && (
        <mesh position={[0, 5, 0]} castShadow>
          <boxGeometry args={[35, 10, 30]} />
          <meshStandardMaterial color="#4682B4" />
        </mesh>
      )}
      
      <group position={[0, 8, 20]}>
        <mesh onClick={(e) => { e.stopPropagation(); onExit(); }}>
          <boxGeometry args={[10, 8, 2]} />
          <meshStandardMaterial color="#ff4444" emissive="#aa0000" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 2, 1.2]} fontSize={2} color="#fff" anchorX="center">EXIT</Text>
      </group>
      
      <ambientLight intensity={0.85} />
      <directionalLight position={[15, 30, 15]} intensity={1.4} castShadow />
      <pointLight position={[0, 18, 0]} intensity={1.2} color="#fff" distance={40} />
    </group>
  )
}

function GovernmentFloor({ name, floor, onExit }: { name: string; floor: number; onExit: () => void }) {
  const depts = ['Administration', 'Public Services', 'Records', 'Council', 'Finance', 'Legal', 'Planning', 'Mayor Office']
  
  return (
    <group>
      <mesh position={[0, 18, 0]}>
        <boxGeometry args={[55, 36, 55]} />
        <meshStandardMaterial color="#f0ebe5" side={THREE.BackSide} />
      </mesh>
      
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[55, 55]} />
        <meshStandardMaterial color="#5a5a6a" roughness={0.5} />
      </mesh>
      
      <mesh position={[0, 5, -22]} castShadow>
        <cylinderGeometry args={[12, 12, 10]} />
        <meshStandardMaterial color="#6a6a7a" />
      </mesh>
      
      <Text position={[0, 15, -18]} fontSize={3} color="#1a1a2a" anchorX="center" fontWeight="bold">
        {name}
      </Text>
      <Text position={[0, 11, -16]} fontSize={1.8} color="#444" anchorX="center">
        Floor {floor}
      </Text>
      <Text position={[0, 7, -16]} fontSize={1.5} color="#666" anchorX="center">
        {depts[(floor - 1) % 8]}
      </Text>
      
      {[[-18, 0], [0, 0], [18, 0]].map((p, i) => (
        <mesh key={i} position={[p[0], 4, p[1]]} castShadow>
          <boxGeometry args={[12, 8, 6]} />
          <meshStandardMaterial color="#7a7a8a" />
        </mesh>
      ))}
      
      <group position={[0, 10, 26]}>
        <mesh onClick={(e) => { e.stopPropagation(); onExit(); }}>
          <boxGeometry args={[10, 8, 2]} />
          <meshStandardMaterial color="#ff4444" emissive="#aa0000" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 2, 1.2]} fontSize={2} color="#fff" anchorX="center">EXIT</Text>
      </group>
      
      <ambientLight intensity={0.9} />
      <directionalLight position={[20, 40, 20]} intensity={1.5} castShadow />
      <pointLight position={[0, 30, 0]} intensity={1.4} color="#fff" distance={50} />
    </group>
  )
}

// ============================================
// EXTERIOR COMPONENTS
// ============================================
function Ground({ timeOfDay }: { timeOfDay: TimeOfDay }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color={timeOfDay === 'day' ? '#2a3a4e' : '#1a1a2e'} roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 6]} />
        <meshStandardMaterial color="#5a4a3a" />
      </mesh>
      <mesh castShadow position={[0, 8, 0]}>
        <coneGeometry args={[4, 8, 8]} />
        <meshStandardMaterial color="#2a6a2a" />
      </mesh>
    </group>
  )
}

function InteractiveBuilding({ data, isSelected, onClick, timeOfDay }: { 
  data: BuildingData; 
  isSelected: boolean; 
  onClick: () => void; 
  timeOfDay: TimeOfDay 
}) {
  const [hovered, setHovered] = useState(false)
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (groupRef.current && isSelected) {
      groupRef.current.position.y = data.position[1] + Math.sin(clock.elapsedTime * 2) * 0.5
    } else if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, data.position[1], 0.1)
    }
  })
  
  return (
    <group ref={groupRef} position={data.position}>
      <mesh
        castShadow
        receiveShadow
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={data.size} />
        <meshStandardMaterial 
          color={isSelected ? '#00ffff' : hovered ? '#666677' : data.color} 
          roughness={0.4} 
          metalness={0.3} 
        />
      </mesh>
      
      {/* Windows */}
      {Array.from({ length: Math.floor(data.size[1] / 8) }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh 
            key={`w-${row}-${col}`} 
            position={[(col - 1) * 6, (row - Math.floor(data.size[1] / 8) / 2 + 0.5) * 8, data.size[2] / 2 + 0.1]}
          >
            <planeGeometry args={[4, 6]} />
            <meshStandardMaterial 
              color={Math.random() > 0.3 ? '#ffdd88' : '#1a1a2e'} 
              emissive={Math.random() > 0.3 && timeOfDay === 'night' ? '#ffaa44' : '#000000'} 
              emissiveIntensity={0.4} 
            />
          </mesh>
        ))
      )}
      
      {isSelected && (
        <>
          <Text position={[0, data.size[1] + 10, 0]} fontSize={3} color="#00ffff" anchorX="center" fontWeight="bold">
            {data.name}
          </Text>
          <Text position={[0, data.size[1] + 6, 0]} fontSize={1.5} color="#ffffff" anchorX="center">
            {data.floors} FLOORS • Click to enter
          </Text>
          <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(data.size[0], data.size[2]) / 2 + 3, Math.max(data.size[0], data.size[2]) / 2 + 6, 64]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
          </mesh>
        </>
      )}
    </group>
  )
}

// ============================================
// INTERIOR SCENE
// ============================================
function InteriorScene({ building, floor, onExit }: { building: BuildingData; floor: number; onExit: () => void }) {
  const { scene } = useThree()
  
  useEffect(() => {
    scene.background = new THREE.Color('#f5f5f7')
  }, [scene])
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 12, 35]} fov={60} near={0.1} far={500} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        target={[0, 8, 0]} 
        minDistance={10} 
        maxDistance={50} 
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={0.1}
      />
      
      <Suspense fallback={<Loader />}>
        {building.type === 'office' && <OfficeFloor name={building.name} floor={floor} onExit={onExit} />}
        {building.type === 'hotel' && <HotelFloor name={building.name} floor={floor} onExit={onExit} />}
        {building.type === 'mall' && <MallFloor name={building.name} floor={floor} onExit={onExit} />}
        {building.type === 'residential' && <ResidentialFloor name={building.name} floor={floor} onExit={onExit} />}
        {building.type === 'government' && <GovernmentFloor name={building.name} floor={floor} onExit={onExit} />}
      </Suspense>
    </>
  )
}

// ============================================
// EXTERIOR SCENE
// ============================================
function ExteriorScene({ timeOfDay, onBuildingClick, selectedBuildingId }: { 
  timeOfDay: TimeOfDay; 
  onBuildingClick: (b: BuildingData) => void; 
  selectedBuildingId: string | null 
}) {
  const { scene } = useThree()
  
  useEffect(() => {
    scene.background = new THREE.Color(timeOfDay === 'day' ? '#87CEEB' : '#0a0a15')
  }, [timeOfDay, scene])
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[120, 80, 120]} fov={60} near={0.1} far={1000} />
      <OrbitControls enablePan={true} enableZoom={true} minDistance={20} maxDistance={300} maxPolarAngle={Math.PI / 2 - 0.1} />
      
      <Suspense fallback={<Loader />}>
        {timeOfDay === 'day' ? (
          <Sky sunPosition={[100, 100, 100]} turbidity={8} rayleigh={2} />
        ) : (
          <Stars radius={300} depth={50} count={5000} factor={4} />
        )}
        
        <Ground timeOfDay={timeOfDay} />
        
        {BUILDINGS_DATA.map((building) => (
          <InteractiveBuilding 
            key={building.id} 
            data={building} 
            isSelected={selectedBuildingId === building.id} 
            onClick={() => onBuildingClick(building)} 
            timeOfDay={timeOfDay} 
          />
        ))}
        
        {Array.from({ length: 25 }).map((_, i) => {
          const x = (Math.random() - 0.5) * 350
          const z = (Math.random() - 0.5) * 350
          if (Math.abs(x) < 30 && Math.abs(z) < 30) return null
          return <Tree key={i} position={[x, 0, z]} />
        })}
        
        <ambientLight intensity={timeOfDay === 'day' ? 0.6 : 0.3} />
        <directionalLight position={[50, 100, 50]} intensity={timeOfDay === 'day' ? 1.2 : 0.4} castShadow shadow-mapSize={[1024, 1024]} />
        
        {timeOfDay === 'night' && (
          <>
            <pointLight position={[0, 30, 0]} intensity={0.7} color="#ffaa44" distance={60} />
            <pointLight position={[80, 20, 0]} intensity={0.7} color="#ffaa44" distance={60} />
          </>
        )}
      </Suspense>
    </>
  )
}

// ============================================
// MAIN APP
// ============================================
function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day')
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null)
  const [isInsideBuilding, setIsInsideBuilding] = useState(false)
  const [currentFloor, setCurrentFloor] = useState(1)

  const handleBuildingClick = useCallback((building: BuildingData) => {
    setSelectedBuilding(building)
    setCurrentFloor(1)
  }, [])

  const enterBuilding = useCallback((floor: number) => {
    if (selectedBuilding) {
      setCurrentFloor(floor)
      setIsInsideBuilding(true)
    }
  }, [selectedBuilding])

  const exitBuilding = useCallback(() => {
    setIsInsideBuilding(false)
  }, [])

  const changeFloor = useCallback((newFloor: number) => {
    if (selectedBuilding && newFloor >= 1 && newFloor <= selectedBuilding.floors) {
      setCurrentFloor(newFloor)
    }
  }, [selectedBuilding])

  // ========== MENU SCREEN ==========
  if (gameState === 'menu') {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
          <motion.div 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              METRO
            </h1>
            <h2 className="text-2xl md:text-5xl font-black text-white/90 mb-4">POLITAN 3D</h2>
            <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto">
              <b className="text-cyan-400">6 Buildings</b> with <b className="text-cyan-400">Unique Floor Plans</b><br/>
              Every floor has a different interior!
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }} 
            className="grid grid-cols-3 gap-3 w-full max-w-md mb-8"
          >
            {[
              { icon: Building2, count: '6', label: 'Buildings' },
              { icon: Trees, count: '89', label: 'Unique Floors' },
              { icon: Users, count: '∞', label: 'Explore' }
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 text-center">
                <stat.icon className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{stat.count}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.button 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6 }}
            onClick={() => setGameState('playing')}
            className="bg-gradient-to-r from-cyan-500/30 to-purple-500/30 px-6 md:px-8 py-4 md:py-5 rounded-2xl border border-cyan-400/30 hover:border-cyan-400/60 transition-all active:scale-95"
          >
            <div className="flex items-center gap-3 md:gap-4">
              <Play className="w-6 h-6 md:w-8 md:h-8 text-cyan-400 fill-current" />
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">Enter 3D City</h3>
                <p className="text-white/60 text-xs">Every floor is unique!</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    )
  }

  // ========== GAME SCREEN ==========
  return (
    <div className="fixed inset-0 bg-gray-900" style={{ touchAction: 'none' }}>
      <Canvas 
        key={isInsideBuilding ? `interior-${selectedBuilding?.id}-${currentFloor}` : 'exterior'}
        shadows 
        gl={{ 
          antialias: true, 
          alpha: false, 
          powerPreference: 'high-performance',
          stencil: false
        }} 
        dpr={[1, 2]}
        camera={{ fov: 60, near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          {isInsideBuilding && selectedBuilding ? (
            <InteriorScene building={selectedBuilding} floor={currentFloor} onExit={exitBuilding} />
          ) : (
            <ExteriorScene 
              timeOfDay={timeOfDay} 
              onBuildingClick={handleBuildingClick} 
              selectedBuildingId={selectedBuilding?.id || null} 
            />
          )}
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-3 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInsideBuilding ? 'bg-cyan-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="font-bold text-white text-sm">
                {isInsideBuilding ? `🏢 ${selectedBuilding?.name}` : '🌆 METRO CITY'}
              </span>
            </div>
            {isInsideBuilding && (
              <div className="bg-black/80 backdrop-blur-md border border-green-400/50 px-4 py-2 rounded-xl">
                <span className="text-green-400 font-bold text-sm">
                  Floor {currentFloor} / {selectedBuilding?.floors}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pointer-events-auto">
            {!isInsideBuilding && (
              <button 
                onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day')}
                className="px-4 py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl font-bold text-sm transition-all hover:bg-white/10 flex items-center gap-2"
              >
                {timeOfDay === 'day' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                <span className={timeOfDay === 'day' ? 'text-yellow-400' : 'text-blue-400'}>
                  {timeOfDay === 'day' ? 'DAY' : 'NIGHT'}
                </span>
              </button>
            )}
            {isInsideBuilding && (
              <button 
                onClick={exitBuilding}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-xl font-bold text-white shadow-lg hover:from-red-400 hover:to-red-600 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> EXIT
              </button>
            )}
            <button 
              onClick={() => setGameState('menu')} 
              className="px-3 py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-white/60 hover:text-white text-sm"
            >
              MENU
            </button>
          </div>
        </div>

        {/* Left Sidebar - Buildings List (Outside) */}
        {!isInsideBuilding && (
          <div className="absolute top-20 left-4 w-72 pointer-events-auto max-h-[60vh] overflow-y-auto">
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-4">
              <h3 className="text-cyan-400 font-bold mb-3">🏢 Buildings</h3>
              <div className="space-y-2">
                {BUILDINGS_DATA.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { handleBuildingClick(b); }}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedBuilding?.id === b.id ? 'bg-cyan-500/30 border border-cyan-400/50' : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-bold text-white text-sm">{b.name}</div>
                    <div className="text-xs text-white/60">{b.floors} floors • {b.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Building Selection Panel (Outside) */}
        {!isInsideBuilding && selectedBuilding && (
          <div className="absolute top-20 right-4 w-72 pointer-events-auto">
            <div className="bg-black/90 backdrop-blur-md border-2 border-cyan-400/50 rounded-xl p-4">
              <h3 className="text-cyan-400 font-bold text-lg mb-1">{selectedBuilding.name}</h3>
              <p className="text-white/60 text-xs capitalize mb-1">{selectedBuilding.type}</p>
              <p className="text-cyan-400/80 text-xs mb-3">{selectedBuilding.floors} floors • Unique layouts</p>
              
              <label className="text-white/50 text-xs block mb-1">Select Floor:</label>
              <select 
                value={currentFloor} 
                onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
                className="w-full bg-black/50 border border-white/30 rounded-lg px-3 py-2 text-sm text-white mb-3"
              >
                {Array.from({ length: selectedBuilding.floors }, (_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-gray-800">Floor {i + 1}</option>
                ))}
              </select>
              
              <button 
                onClick={() => enterBuilding(currentFloor)}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white shadow-lg hover:shadow-cyan-500/30 transition-all text-sm"
              >
                ENTER FLOOR {currentFloor}
              </button>
            </div>
          </div>
        )}

        {/* Inside Floor Controls */}
        {isInsideBuilding && (
          <div className="absolute top-20 left-4 w-64 pointer-events-auto">
            <div className="bg-black/90 backdrop-blur-md border-2 border-green-400/50 rounded-xl p-4">
              <h3 className="text-green-400 font-bold text-lg mb-1">🏢 {selectedBuilding?.name}</h3>
              <p className="text-white/60 text-xs capitalize mb-3">{selectedBuilding?.type}</p>
              
              <div className="flex items-center justify-between bg-black/50 rounded-lg p-2 mb-3">
                <button 
                  onClick={() => changeFloor(currentFloor - 1)} 
                  disabled={currentFloor <= 1}
                  className="w-10 h-10 bg-blue-500/50 rounded-lg flex items-center justify-center text-white disabled:opacity-30 hover:bg-blue-500/70 transition-colors"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <span className="text-white font-mono font-bold">Floor {currentFloor}</span>
                <button 
                  onClick={() => changeFloor(currentFloor + 1)} 
                  disabled={currentFloor >= (selectedBuilding?.floors || 1)}
                  className="w-10 h-10 bg-blue-500/50 rounded-lg flex items-center justify-center text-white disabled:opacity-30 hover:bg-blue-500/70 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-xs text-cyan-400">Each floor has a unique layout!</p>
            </div>

            <button 
              onClick={exitBuilding}
              className="mt-3 w-full py-3 bg-gradient-to-r from-red-500 to-red-700 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:from-red-400 hover:to-red-600 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> EXIT BUILDING
            </button>
          </div>
        )}

        {/* Instructions */}
        {!isInsideBuilding && !selectedBuilding && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 pointer-events-auto">
            <p className="text-white text-sm text-center">
              🖱️ <b>Click any building</b> to select, then choose floor and click <b className="text-cyan-400">ENTER</b>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
