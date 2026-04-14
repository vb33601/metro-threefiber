import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface TreeData {
  position: number[]
  scale: number
  type: 'pine' | 'oak' | 'palm'
  id: string
}

export function Vegetation() {
  const groupRef = useRef<THREE.Group>(null)

  // Generate trees
  const trees = useMemo<TreeData[]>(() => {
    const treeList: TreeData[] = []
    
    // Park trees (center area)
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 50
      treeList.push({
        position: [
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ],
        scale: 0.8 + Math.random() * 0.6,
        type: Math.random() > 0.3 ? 'oak' : 'pine',
        id: `park-tree-${i}`
      })
    }
    
    // Street trees
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 600
      const z = (Math.random() - 0.5) * 600
      
      // Keep away from buildings
      const distFromCenter = Math.sqrt(x * x + z * z)
      if (distFromCenter > 60 && distFromCenter < 280) {
        treeList.push({
          position: [x, 0, z],
          scale: 0.6 + Math.random() * 0.5,
          type: Math.random() > 0.5 ? 'oak' : 'pine',
          id: `street-tree-${i}`
        })
      }
    }
    
    return treeList
  }, [])

  // Generate bushes
  const bushes = useMemo(() => {
    const bushList = []
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 30 + Math.random() * 40
      bushList.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        scale: 0.3 + Math.random() * 0.4,
        id: `bush-${i}`
      })
    }
    return bushList
  }, [])

  return (
    <group ref={groupRef}>
      {trees.map((tree) => (
        <Tree key={tree.id} {...tree} />
      ))}
      {bushes.map((bush) => (
        <Bush key={bush.id} {...bush} />
      ))}
    </group>
  )
}

function Tree({ position, scale, type }: { position: number[], scale: number, type: string }) {
  const trunkRef = useRef<THREE.Mesh>(null)
  const leavesRef = useRef<THREE.Group>(null)
  const pos: [number, number, number] = [position[0], position[1], position[2]]
  
  useFrame(({ clock }) => {
    if (leavesRef.current) {
      const wind = Math.sin(clock.elapsedTime * 0.5 + position[0]) * 0.05
      leavesRef.current.rotation.z = wind
    }
  })

  if (type === 'pine') {
    return (
      <group position={pos}>
        {/* Trunk */}
        <mesh ref={trunkRef} position={[0, 1.5 * scale, 0]} castShadow>
          <cylinderGeometry args={[0.2 * scale, 0.3 * scale, 3 * scale]} />
          <meshStandardMaterial color="#4a3728" roughness={0.9} />
        </mesh>
        
        {/* Leaves */}
        <group ref={leavesRef} position={[0, 3 * scale, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <coneGeometry args={[2 * scale, 3 * scale, 8]} />
            <meshStandardMaterial color="#2d5a2d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.5 * scale, 0]} castShadow>
            <coneGeometry args={[1.5 * scale, 2.5 * scale, 8]} />
            <meshStandardMaterial color="#3d7a3d" roughness={0.8} />
          </mesh>
          <mesh position={[0, 3 * scale, 0]} castShadow>
            <coneGeometry args={[1 * scale, 2 * scale, 8]} />
            <meshStandardMaterial color="#4d8a4d" roughness={0.8} />
          </mesh>
        </group>
      </group>
    )
  }

  // Oak tree
  return (
    <group position={pos}>
      {/* Trunk */}
      <mesh ref={trunkRef} position={[0, 1.5 * scale, 0]} castShadow>
        <cylinderGeometry args={[0.4 * scale, 0.5 * scale, 3 * scale]} />
        <meshStandardMaterial color="#5a4738" roughness={0.9} />
      </mesh>
      
      {/* Leaves - spherical */}
      <group ref={leavesRef} position={[0, 4 * scale, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[2.5 * scale, 8, 6]} />
          <meshStandardMaterial color="#4a8a3a" roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

function Bush({ position, scale }: { position: number[], scale: number }) {
  const pos: [number, number, number] = [position[0], position[1], position[2]]
  return (
    <group position={pos}>
      <mesh castShadow>
        <sphereGeometry args={[1 * scale, 6, 4]} />
        <meshStandardMaterial color="#3d7a3d" roughness={0.9} />
      </mesh>
    </group>
  )
}
