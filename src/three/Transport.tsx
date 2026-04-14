import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Vehicle {
  id: string
  position: THREE.Vector3
  direction: number
  speed: number
  color: string
  type: 'car' | 'bus' | 'train'
  lane: number
}

export function Transport() {
  const vehicles = useMemo(() => {
    const list: Vehicle[] = []
    const colors = ['#ff4444', '#4444ff', '#ffff44', '#ffffff', '#aaaaaa', '#ff8844', '#44ff88']
    
    // Generate cars on roads
    for (let i = 0; i < 50; i++) {
      const lane = Math.floor(Math.random() * 4) // 4 main roads
      const positions = [
        new THREE.Vector3((Math.random() - 0.5) * 500, 1, 0), // X-axis road
        new THREE.Vector3((Math.random() - 0.5) * 500, 1, 100), // X-axis road offset
        new THREE.Vector3(0, 1, (Math.random() - 0.5) * 500), // Z-axis road
        new THREE.Vector3(100, 1, (Math.random() - 0.5) * 500), // Z-axis road offset
      ]
      
      list.push({
        id: `car-${i}`,
        position: positions[lane],
        direction: lane < 2 ? 0 : Math.PI / 2,
        speed: 0.5 + Math.random() * 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.9 ? 'bus' : 'car',
        lane
      })
    }
    
    // Metro train
    list.push({
      id: 'metro-train',
      position: new THREE.Vector3(-200, 0.5, 50),
      direction: 0,
      speed: 1.5,
      color: '#00d4ff',
      type: 'train',
      lane: 0
    })
    
    return list
  }, [])

  return (
    <group>
      {/* Metro tracks */}
      <mesh position={[0, 0.05, 50]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 6]} />
        <meshStandardMaterial color="#3a3a4a" />
      </mesh>
      
      {/* Rails */}
      <mesh position={[-125, 0.06, 48]}>
        <boxGeometry args={[250, 0.1, 0.3]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[125, 0.06, 52]}>
        <boxGeometry args={[250, 0.1, 0.3]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {vehicles.map((vehicle) => (
        <VehicleMesh key={vehicle.id} vehicle={vehicle} />
      ))}
    </group>
  )
}

function VehicleMesh({ vehicle }: { vehicle: Vehicle }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (!meshRef.current) return
    
    // Move vehicle
    if (vehicle.lane < 2) {
      // X-axis movement
      meshRef.current.position.x += vehicle.speed * (vehicle.lane === 0 ? 1 : -1)
      if (meshRef.current.position.x > 250) meshRef.current.position.x = -250
      if (meshRef.current.position.x < -250) meshRef.current.position.x = 250
    } else {
      // Z-axis movement
      meshRef.current.position.z += vehicle.speed * (vehicle.lane === 2 ? 1 : -1)
      if (meshRef.current.position.z > 250) meshRef.current.position.z = -250
      if (meshRef.current.position.z < -250) meshRef.current.position.z = 250
    }
  })

  if (vehicle.type === 'train') {
    return (
      <group ref={meshRef} position={vehicle.position}>
        {/* Train body */}
        <mesh castShadow>
          <boxGeometry args={[80, 4, 3]} />
          <meshStandardMaterial color={vehicle.color} metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Windows */}
        <mesh position={[0, 0.5, 1.6]}>
          <boxGeometry args={[70, 1.5, 0.2]} />
          <meshStandardMaterial color="#88eeff" emissive="#0044aa" emissiveIntensity={0.3} />
        </mesh>
        {/* Lights */}
        <mesh position={[40, -1, 1]}>
          <sphereGeometry args={[0.5]} />
          <meshBasicMaterial color="#ffffaa" />
        </mesh>
        <mesh position={[40, -1, -1]}>
          <sphereGeometry args={[0.5]} />
          <meshBasicMaterial color="#ffffaa" />
        </mesh>
      </group>
    )
  }

  if (vehicle.type === 'bus') {
    return (
      <group 
        ref={meshRef} 
        position={vehicle.position}
        rotation={[0, vehicle.direction, 0]}
      >
        <mesh castShadow>
          <boxGeometry args={[3, 2.5, 10]} />
          <meshStandardMaterial color={vehicle.color} />
        </mesh>
        {/* Windows */}
        <mesh position={[1.6, 0.5, 0]}>
          <boxGeometry args={[0.2, 1, 9]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
    )
  }

  // Car
  return (
    <group 
      ref={meshRef} 
      position={vehicle.position}
      rotation={[0, vehicle.direction, 0]}
    >
      {/* Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1.2, 4]} />
        <meshStandardMaterial color={vehicle.color} />
      </mesh>
      {/* Top */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[1.8, 0.6, 2]} />
        <meshStandardMaterial color={vehicle.color} />
      </mesh>
      {/* Headlights */}
      <mesh position={[0.6, 0.3, 2.1]}>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="#ffffaa" />
      </mesh>
      <mesh position={[-0.6, 0.3, 2.1]}>
        <sphereGeometry args={[0.2]} />
        <meshBasicMaterial color="#ffffaa" />
      </mesh>
    </group>
  )
}
