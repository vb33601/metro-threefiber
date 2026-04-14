import { useState, useRef, Suspense, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows, Sky, Stars, Text } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Building2, Trees, Train, Navigation, Camera, Play, ArrowLeft, Home, MapPin, Users, ChevronUp, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react'

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
// INTERIOR FLOORS
// ============================================
function OfficeFloor({ name, floor }: { name: string; floor: number }) {
  const layout = floor % 3
  return (
    <>
      <mesh position={[0, 15, 0]}><boxGeometry args={[50, 30, 50]} /><meshStandardMaterial color="#f0f0f0" side={THREE.BackSide} /></mesh>
      <mesh position={[0, 0.1, 0]} receiveShadow><planeGeometry args={[50, 50]} /><meshStandardMaterial color="#3a5a7a" roughness={0.9} /></mesh>
      <Text position={[0, 28, 0]} fontSize={3} color="#333" anchorX="center">{name}</Text>
      <Text position={[0, 24, 0]} fontSize={1.5} color="#666" anchorX="center">Floor {floor} - {layout === 0 ? 'Grid' : layout === 1 ? 'Cubicles' : 'Pods'}</Text>
      {layout === 0 && Array.from({ length: 12 }).map((_, i) => (
        <group key={i} position={[((i % 4) - 1.5) * 12, 0, (Math.floor(i / 4) - 1) * 12]}>
          <mesh castShadow position={[0, 3, 0]}><boxGeometry args={[10, 6, 5]} /><meshStandardMaterial color="#e0e0e0" /></mesh>
        </group>
      ))}
      {layout === 1 && Array.from({ length: 15 }).map((_, i) => (
        <group key={i} position={[((i % 5) - 2) * 9, 0, (Math.floor(i / 5) - 1) * 15]}>
          <mesh castShadow position={[0, 3, 0]}><boxGeometry args={[8, 6, 6]} /><meshStandardMaterial color="#d0d0d0" /></mesh>
        </group>
      ))}
      {layout === 2 && [[-15, -15], [15, -15], [-15, 15], [15, 15]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 4, pos[1]]}><cylinderGeometry args={[8, 8, 8]} /><meshStandardMaterial color="#c0c0c0" /></mesh>
      ))}
      <ambientLight intensity={0.7} /><pointLight position={[0, 25, 0]} intensity={1.5} color="#fff" />
    </>
  )
}

function HotelFloor({ name, floor }: { name: string; floor: number }) {
  const roomType = floor % 3
  const colors = ['#4682B4', '#8B4513', '#2F4F4F']
  return (
    <>
      <mesh position={[0, 20, 0]}><boxGeometry args={[60, 40, 60]} /><meshStandardMaterial color="#f0e6d2" side={THREE.BackSide} /></mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#d0c0b0" roughness={0.3} /></mesh>
      {floor === 1 ? (
        <>
          <mesh position={[0, 8, -28]} castShadow><boxGeometry args={[32, 16, 4]} /><meshStandardMaterial color="#8B4513" /></mesh>
          <Text position={[0, 16, -24]} fontSize={3.5} color="#D4AF37" anchorX="center">{name}</Text>
          <Text position={[0, 11, -24]} fontSize={2} color="#D4AF37" anchorX="center">LOBBY</Text>
          {[[-18, -18], [0, -18], [18, -18]].map((p, i) => (
            <mesh key={i} position={[p[0], 4, p[1]]} castShadow><boxGeometry args={[14, 8, 5]} /><meshStandardMaterial color="#654321" /></mesh>
          ))}
        </>
      ) : (
        <>
          <Text position={[0, 35, 0]} fontSize={3} color="#333" anchorX="center">{name}</Text>
          <Text position={[0, 30, 0]} fontSize={2} color={colors[roomType]} anchorX="center">Floor {floor} - {roomType === 0 ? 'Standard' : roomType === 1 ? 'Deluxe' : 'Suite'}</Text>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={i} position={[((i % 4) - 1.5) * 15, 5, (Math.floor(i / 4) - 0.5) * 20]} castShadow>
              <boxGeometry args={[12, 10, 15]} /><meshStandardMaterial color={colors[roomType]} />
            </mesh>
          ))}
        </>
      )}
      <ambientLight intensity={0.7} /><pointLight position={[0, 35, 0]} intensity={2} color="#ffeeaa" />
    </>
  )
}

function MallFloor({ name, floor }: { name: string; floor: number }) {
  return (
    <>
      <mesh position={[0, 25, 0]}><boxGeometry args={[80, 50, 80]} /><meshStandardMaterial color="#fff" side={THREE.BackSide} /></mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#eee" roughness={0.2} /></mesh>
      <Text position={[0, 20, 0]} fontSize={4} color="#333" anchorX="center">{name}</Text>
      <Text position={[0, 15, 0]} fontSize={2} color="#666" anchorX="center">Level {floor} - {floor === 1 ? 'Fashion' : floor === 2 ? 'Food Court' : 'Entertainment'}</Text>
      {floor === 1 && ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'].map((color, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(angle) * 30, 0, Math.sin(angle) * 30]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <mesh castShadow position={[0, 10, 0]}><boxGeometry args={[16, 20, 12]} /><meshStandardMaterial color={color} /></mesh>
            <Text position={[0, 10, 6.2]} fontSize={2} color="#333" anchorX="center">SHOP {i + 1}</Text>
          </group>
        )
      })}
      {floor === 2 && (
        <>
          <mesh position={[0, 3, 0]} castShadow><boxGeometry args={[50, 6, 50]} /><meshStandardMaterial color="#8B4513" /></mesh>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[((i % 3) - 1) * 20, 6, (Math.floor(i / 3) - 0.5) * 25]} castShadow>
              <boxGeometry args={[15, 12, 10]} />
              <meshStandardMaterial color={['#ff6b6b', '#4ecdc4', '#f9ca24', '#6c5ce7', '#a29bfe', '#ff9f43'][i]} />
            </mesh>
          ))}
        </>
      )}
      {floor === 3 && (
        <>
          <mesh position={[-20, 8, 0]} castShadow><boxGeometry args={[25, 16, 40]} /><meshStandardMaterial color="#222" /></mesh>
          <Text position={[-20, 17, 0]} fontSize={2} color="#fff" anchorX="center">CINEMA</Text>
          <mesh position={[20, 6, 0]} castShadow><boxGeometry args={[25, 12, 30]} /><meshStandardMaterial color="#4a0080" /></mesh>
          <Text position={[20, 12.5, 0]} fontSize={2} color="#fff" anchorX="center">ARCADE</Text>
        </>
      )}
      <ambientLight intensity={0.9} /><pointLight position={[0, 45, 0]} intensity={2} color="#fff" />
    </>
  )
}

function ResidentialFloor({ name, floor }: { name: string; floor: number }) {
  const layout = floor % 4
  return (
    <>
      <mesh position={[0, 12, 0]}><boxGeometry args={[45, 24, 45]} /><meshStandardMaterial color="#f5f5f0" side={THREE.BackSide} /></mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow><planeGeometry args={[45, 45]} /><meshStandardMaterial color="#8B4513" roughness={0.6} /></mesh>
      <Text position={[0, 22, 0]} fontSize={2.5} color="#333" anchorX="center">{name}</Text>
      <Text position={[0, 18, 0]} fontSize={1.8} color="#666" anchorX="center">Unit {100 + floor} - Floor {floor}</Text>
      {layout === 0 && <><mesh position={[-10, 3, -10]} castShadow><boxGeometry args={[12, 6, 10]} /><meshStandardMaterial color="#4682B4" /></mesh><mesh position={[10, 4, -10]} castShadow><boxGeometry args={[12, 8, 12]} /><meshStandardMaterial color="#e0e0e0" /></mesh></>}
      {layout === 1 && <mesh position={[0, 4, 0]} castShadow><boxGeometry args={[30, 8, 20]} /><meshStandardMaterial color="#4682B4" /></mesh>}
      {layout === 2 && <><mesh position={[-10, 3, 0]} castShadow><boxGeometry args={[10, 6, 15]} /><meshStandardMaterial color="#4682B4" /></mesh><mesh position={[10, 3, 0]} castShadow><boxGeometry args={[10, 6, 15]} /><meshStandardMaterial color="#4682B4" /></mesh></>}
      {layout === 3 && <mesh position={[0, 5, 0]} castShadow><boxGeometry args={[35, 10, 30]} /><meshStandardMaterial color="#4682B4" /></mesh>}
      <ambientLight intensity={0.8} /><pointLight position={[0, 20, 0]} intensity={1.5} color="#fff" />
    </>
  )
}

function GovernmentFloor({ name, floor }: { name: string; floor: number }) {
  const depts = ['Administration', 'Public Services', 'Records', 'Council', 'Finance', 'Legal', 'Planning', 'Mayor Office']
  return (
    <>
      <mesh position={[0, 18, 0]}><boxGeometry args={[60, 36, 60]} /><meshStandardMaterial color="#f0ebe0" side={THREE.BackSide} /></mesh>
      <mesh position={[0, 0.2, 0]} receiveShadow><planeGeometry args={[60, 60]} /><meshStandardMaterial color="#4a4a5a" roughness={0.5} /></mesh>
      <mesh position={[0, 5, -25]} castShadow><cylinderGeometry args={[10, 10, 10]} /><meshStandardMaterial color="#5a5a6a" /></mesh>
      <Text position={[0, 12, -20]} fontSize={3} color="#gold" anchorX="center">{name}</Text>
      <Text position={[0, 8, -16]} fontSize={1.8} color="#fff" anchorX="center">Floor {floor}</Text>
      <Text position={[0, 4, -16]} fontSize={1.5} color="#aaa" anchorX="center">{depts[(floor - 1) % 8]}</Text>
      {[[-20, 0], [0, 0], [20, 0]].map((p, i) => (
        <mesh key={i} position={[p[0], 4, p[1]]} castShadow><boxGeometry args={[14, 8, 6]} /><meshStandardMaterial color="#6a6a7a" /></mesh>
      ))}
      <ambientLight intensity={0.75} /><pointLight position={[0, 30, 0]} intensity={1.8} color="#fff" />
    </>
  )
}

function InteriorScene({ building, floor, onExit }: { building: BuildingData; floor: number; onExit: () => void }) {
  const renderInterior = () => {
    switch (building.type) {
      case 'office': return <OfficeFloor name={building.name} floor={floor} />
      case 'hotel': return <HotelFloor name={building.name} floor={floor} />
      case 'mall': return <MallFloor name={building.name} floor={floor} />
      case 'residential': return <ResidentialFloor name={building.name} floor={floor} />
      case 'government': return <GovernmentFloor name={building.name} floor={floor} />
      default: return <OfficeFloor name={building.name} floor={floor} />
    }
  }
  
  return (
    <>
      {/* Clear background color - light theme for interiors */}
      <color attach="background" args={['#f5f5f7']} />
      <fog attach="fog" args={['#f5f5f7', 40, 120]} />
      
      {/* Main interior content */}
      {renderInterior()}
      
      {/* Exit Button - Positioned at the back wall */}
      <group position={[0, 8, 32]}>
        <mesh onClick={(e) => { e.stopPropagation(); onExit(); }}>
          <boxGeometry args={[10, 8, 1]} />
          <meshStandardMaterial color="#ff4444" emissive="#aa0000" emissiveIntensity={0.5} />
        </mesh>
        <Text position={[0, 8.5, 0.6]} fontSize={2} color="#fff" anchorX="center">EXIT</Text>
        <Text position={[0, 6.5, 0.6]} fontSize={1} color="#ffcccc" anchorX="center">Click to leave</Text>
      </group>
      
      {/* Floor indicator panel */}
      <group position={[15, 18, 0]}>
        <mesh>
          <planeGeometry args={[12, 8]} />
          <meshBasicMaterial color="#1a1a2e" transparent opacity={0.8} />
        </mesh>
        <Text position={[0, 2, 0.1]} fontSize={1.8} color="#00ffff" anchorX="center">{building.name}</Text>
        <Text position={[0, -0.5, 0.1]} fontSize={1.2} color="#fff" anchorX="center">Floor {floor} / {building.floors}</Text>
        <Text position={[0, -2.5, 0.1]} fontSize={0.8} color="#aaa" anchorX="center">Type: {building.type}</Text>
      </group>
      
      {/* Camera and Controls */}
      <PerspectiveCamera makeDefault position={[0, 12, 35]} fov={60} near={0.1} far={1000} />
      <OrbitControls 
        enablePan={true} 
        enableZoom={true} 
        target={[0, 8, 0]} 
        minDistance={10} 
        maxDistance={50} 
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={0.1}
      />
      
      {/* Lighting - Multiple sources for good visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[30, 50, 30]} intensity={1.0} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 25, 0]} intensity={0.8} color="#fff" distance={50} />
      <pointLight position={[20, 15, 20]} intensity={0.5} color="#ffeebb" distance={30} />
    </>
  )
}

// ============================================
// EXTERIOR
// ============================================
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color="#1a1a2e" roughness={0.8} metalness={0.2} />
    </mesh>
  )
}

function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 3, 0]}><cylinderGeometry args={[0.4, 0.5, 6]} /><meshStandardMaterial color="#5a4a3a" /></mesh>
      <mesh castShadow position={[0, 8, 0]}><coneGeometry args={[4, 8, 8]} /><meshStandardMaterial color="#2a6a2a" /></mesh>
    </group>
  )
}

function InteractiveBuilding({ data, isSelected, onClick, timeOfDay }: { data: BuildingData; isSelected: boolean; onClick: () => void; timeOfDay: TimeOfDay }) {
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
        <meshStandardMaterial color={isSelected ? '#00ffff' : hovered ? '#666677' : data.color} roughness={0.4} metalness={0.3} />
      </mesh>
      {Array.from({ length: Math.floor(data.size[1] / 8) }).map((_, row) =>
        Array.from({ length: 3 }).map((_, col) => (
          <mesh key={`w-${row}-${col}`} position={[(col - 1) * 6, (row - Math.floor(data.size[1] / 8) / 2 + 0.5) * 8, data.size[2] / 2 + 0.1]}>
            <planeGeometry args={[4, 6]} />
            <meshStandardMaterial color={Math.random() > 0.3 ? '#ffdd88' : '#1a1a2e'} emissive={Math.random() > 0.3 && timeOfDay === 'night' ? '#ffaa44' : '#000000'} emissiveIntensity={0.4} />
          </mesh>
        ))
      )}
      {isSelected && (
        <>
          <Text position={[0, data.size[1] + 10, 0]} fontSize={3} color="#00ffff" anchorX="center">{data.name}</Text>
          <Text position={[0, data.size[1] + 6, 0]} fontSize={1.5} color="#ffffff" anchorX="center">{data.floors} FLOORS</Text>
          <mesh position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[Math.max(data.size[0], data.size[2]) / 2 + 3, Math.max(data.size[0], data.size[2]) / 2 + 6, 64]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
          </mesh>
        </>
      )}
    </group>
  )
}

function ExteriorScene({ timeOfDay, onBuildingClick, selectedBuildingId }: { timeOfDay: TimeOfDay; onBuildingClick: (b: BuildingData) => void; selectedBuildingId: string | null }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[120, 80, 120]} fov={60} />
      <OrbitControls enablePan={true} enableZoom={true} minDistance={20} maxDistance={300} maxPolarAngle={Math.PI / 2 - 0.1} />
      <Sky sunPosition={timeOfDay === 'day' ? [100, 100, 100] : [0, -50, 0]} turbidity={timeOfDay === 'night' ? 20 : 8} rayleigh={timeOfDay === 'night' ? 0.5 : 2} />
      {timeOfDay === 'night' && <Stars radius={300} depth={50} count={5000} factor={4} />}
      <ambientLight intensity={timeOfDay === 'night' ? 0.2 : 0.5} />
      <directionalLight position={[50, 100, 50]} intensity={timeOfDay === 'night' ? 0.1 : 1.2} castShadow shadow-mapSize={[2048, 2048]} />
      {timeOfDay === 'night' && <><pointLight position={[0, 20, 0]} intensity={0.6} color="#ffaa44" distance={50} /><pointLight position={[80, 20, 0]} intensity={0.6} color="#ffaa44" distance={50} /></>}
      <Ground />
      {BUILDINGS_DATA.map((building) => (
        <InteractiveBuilding key={building.id} data={building} isSelected={selectedBuildingId === building.id} onClick={() => onBuildingClick(building)} timeOfDay={timeOfDay} />
      ))}
      {Array.from({ length: 25 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 350
        const z = (Math.random() - 0.5) * 350
        if (Math.abs(x) < 30 && Math.abs(z) < 30) return null
        return <Tree key={i} position={[x, 0, z]} />
      })}
      <ContactShadows position={[0, 0.1, 0]} opacity={0.4} scale={400} blur={2} far={100} />
    </>
  )
}

// ============================================
// MAIN APP - RESPONSIVE NO OVERLAP
// ============================================
function App() {
  const [gameState, setGameState] = useState<GameState>('menu')
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day')
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingData | null>(null)
  const [isInsideBuilding, setIsInsideBuilding] = useState(false)
  const [currentFloor, setCurrentFloor] = useState(1)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

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
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-8">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">METRO</h1>
            <h2 className="text-2xl md:text-5xl font-black text-white/90 mb-4">POLITAN 3D</h2>
            <p className="text-white/50 text-sm md:text-base max-w-lg mx-auto">
              <b className="text-cyan-400">6 Buildings</b> with <b className="text-cyan-400">Unique Floor Plans</b><br/>
              Every floor has a different interior!
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="grid grid-cols-3 gap-3 w-full max-w-md mb-8">
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
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
    <div className="fixed inset-0 bg-gray-900">
      <Canvas 
        key={isInsideBuilding ? 'interior' : 'exterior'}
        shadows 
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} 
        className="absolute inset-0"
        camera={{ position: isInsideBuilding ? [0, 12, 35] : [120, 80, 120], fov: 60 }}
      >
        <Suspense fallback={null}>
          {isInsideBuilding && selectedBuilding ? (
            <InteriorScene building={selectedBuilding} floor={currentFloor} onExit={exitBuilding} />
          ) : (
            <ExteriorScene timeOfDay={timeOfDay} onBuildingClick={handleBuildingClick} selectedBuildingId={selectedBuilding?.id || null} />
          )}
        </Suspense>
      </Canvas>

      {/* ========== DESKTOP/TABLET UI ========== */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-3 pointer-events-auto">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isInsideBuilding ? 'bg-cyan-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="font-bold text-white text-sm">{isInsideBuilding ? `🏢 ${selectedBuilding?.name}` : '🌆 METRO CITY'}</span>
            </div>
            {isInsideBuilding && (
              <div className="bg-black/80 backdrop-blur-md border border-green-400/50 px-4 py-2 rounded-xl">
                <span className="text-green-400 font-bold text-sm">Floor {currentFloor} / {selectedBuilding?.floors}</span>
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
                <span className={timeOfDay === 'day' ? 'text-yellow-400' : 'text-blue-400'}>{timeOfDay === 'day' ? 'DAY' : 'NIGHT'}</span>
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
            <button onClick={() => setGameState('menu')} className="px-3 py-2 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-white/60 hover:text-white text-sm">MENU</button>
          </div>
        </div>

        {/* Left Sidebar - Only Outside */}
        {!isInsideBuilding && (
          <div className="absolute top-20 left-4 w-72 pointer-events-auto">
            {/* Mode Buttons */}
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-3 mb-3">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Navigation, label: 'Explorer' },
                  { icon: Building2, label: 'Buildings' },
                  { icon: Train, label: 'Transport' },
                  { icon: Trees, label: 'Environment' }
                ].map((mode, i) => (
                  <button key={i} className="bg-white/5 hover:bg-white/10 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors">
                    <mode.icon className="w-4 h-4 text-white/60" />
                    <span className="text-xs text-white/60">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Building Selection Panel */}
            {selectedBuilding && (
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
            )}
          </div>
        )}

        {/* Left Sidebar - Inside */}
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

        {/* Bottom Bar */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 pointer-events-auto">
          {!isInsideBuilding ? (
            <>
              <button className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 text-white/80 hover:bg-white/10 transition-colors">
                <Camera className="w-4 h-4" /> <span className="text-xs">Camera</span>
              </button>
              <button className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 text-white/80 hover:bg-white/10 transition-colors">
                <MapPin className="w-4 h-4" /> <span className="text-xs">GPS</span>
              </button>
              <button className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-2 text-white/80 hover:bg-white/10 transition-colors">
                <Users className="w-4 h-4" /> <span className="text-xs">NPCs</span>
              </button>
            </>
          ) : (
            <div className="bg-black/80 backdrop-blur-md border border-cyan-400/50 rounded-xl px-6 py-3 flex items-center gap-4">
              <Home className="w-5 h-5 text-cyan-400" />
              <span className="text-white">Floor {currentFloor} of {selectedBuilding?.floors}</span>
              <span className="text-cyan-400 text-xs">Unique Layout</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isInsideBuilding && !selectedBuilding && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl px-6 py-3 pointer-events-auto">
            <p className="text-white text-sm text-center">
              🖱️ <b>Click any building</b> to select, then choose floor and click <b className="text-cyan-400">ENTER</b>
            </p>
          </div>
        )}
      </div>

      {/* ========== MOBILE UI ========== */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        {/* Top Bar */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <div className="bg-black/80 backdrop-blur-md border border-white/20 px-3 py-2 rounded-lg pointer-events-auto flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isInsideBuilding ? 'bg-cyan-400' : 'bg-green-400'}`} />
            <span className="text-white font-bold text-xs">{isInsideBuilding ? `🏢 ${currentFloor}F` : '🌆 CITY'}</span>
          </div>
          <div className="flex gap-1 pointer-events-auto">
            {!isInsideBuilding && (
              <button 
                onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day')}
                className="w-10 h-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center"
              >
                {timeOfDay === 'day' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
              </button>
            )}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="w-10 h-10 bg-black/80 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-14 left-2 right-2 bg-black/95 backdrop-blur-md border border-white/20 rounded-xl p-4 pointer-events-auto z-50 max-h-[70vh] overflow-y-auto"
            >
              {!isInsideBuilding ? (
                <>
                  <h3 className="text-cyan-400 font-bold mb-3">Controls</h3>
                  
                  {/* Mode Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { icon: Navigation, label: 'Explorer' },
                      { icon: Building2, label: 'Buildings' },
                      { icon: Train, label: 'Transport' },
                      { icon: Trees, label: 'Nature' }
                    ].map((mode, i) => (
                      <button key={i} className="bg-white/5 rounded-lg px-3 py-2 flex items-center gap-2">
                        <mode.icon className="w-4 h-4 text-white/60" />
                        <span className="text-xs text-white/60">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  {selectedBuilding ? (
                    <div className="border-t border-white/20 pt-3">
                      <h3 className="text-cyan-400 font-bold mb-1">{selectedBuilding.name}</h3>
                      <p className="text-white/60 text-xs mb-2">{selectedBuilding.floors} floors • Unique layouts</p>
                      <select 
                        value={currentFloor} 
                        onChange={(e) => setCurrentFloor(parseInt(e.target.value))}
                        className="w-full bg-black/50 border border-white/30 rounded-lg px-3 py-2 text-sm text-white mb-2"
                      >
                        {Array.from({ length: Math.min(selectedBuilding.floors, 15) }, (_, i) => (
                          <option key={i + 1} value={i + 1} className="bg-gray-800">Floor {i + 1}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => { enterBuilding(currentFloor); setShowMobileMenu(false); }}
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-white"
                      >
                        ENTER FLOOR {currentFloor}
                      </button>
                    </div>
                  ) : (
                    <p className="text-white/50 text-xs mt-3">Tap a building to select it</p>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-green-400 font-bold mb-2">{selectedBuilding?.name}</h3>
                  <p className="text-white/60 text-xs capitalize mb-3">{selectedBuilding?.type}</p>
                  
                  <div className="flex items-center justify-between mb-4 bg-black/50 rounded-lg p-2">
                    <button 
                      onClick={() => changeFloor(currentFloor - 1)} 
                      disabled={currentFloor <= 1}
                      className="px-4 py-2 bg-blue-500/50 rounded-lg text-white text-sm disabled:opacity-30"
                    >
                      ← Prev
                    </button>
                    <span className="text-white font-mono font-bold">Floor {currentFloor}</span>
                    <button 
                      onClick={() => changeFloor(currentFloor + 1)} 
                      disabled={currentFloor >= (selectedBuilding?.floors || 1)}
                      className="px-4 py-2 bg-blue-500/50 rounded-lg text-white text-sm disabled:opacity-30"
                    >
                      Next →
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => { exitBuilding(); setShowMobileMenu(false); }}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-red-700 rounded-lg font-bold text-white flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> EXIT BUILDING
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inside Quick Nav */}
        {isInsideBuilding && (
          <div className="absolute bottom-4 left-2 right-2 flex justify-center gap-2 pointer-events-auto">
            <button 
              onClick={() => changeFloor(currentFloor - 1)} 
              disabled={currentFloor <= 1}
              className="flex-1 py-3 bg-blue-500/50 rounded-xl text-white font-bold disabled:opacity-30"
            >
              ← Floor {currentFloor > 1 ? currentFloor - 1 : '-'}
            </button>
            <button 
              onClick={() => changeFloor(currentFloor + 1)} 
              disabled={currentFloor >= (selectedBuilding?.floors || 1)}
              className="flex-1 py-3 bg-blue-500/50 rounded-xl text-white font-bold disabled:opacity-30"
            >
              Floor {currentFloor < (selectedBuilding?.floors || 1) ? currentFloor + 1 : '-'} →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
