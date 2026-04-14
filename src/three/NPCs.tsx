import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface NPC {
  id: string
  position: THREE.Vector3
  target: THREE.Vector3
  speed: number
  color: string
}

export function NPCs() {
  const npcs = useMemo(() => {
    const list: NPC[] = []
    const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff', '#ffffff']
    
    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 300
      
      list.push({
        id: `npc-${i}`,
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        ),
        target: new THREE.Vector3(
          (Math.random() - 0.5) * 400,
          0,
          (Math.random() - 0.5) * 400
        ),
        speed: 0.02 + Math.random() * 0.03,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    
    return list
  }, [])

  return (
    <group>
      {npcs.map((npc) => (
        <NPCMesh key={npc.id} npc={npc} />
      ))}
    </group>
  )
}

function NPCMesh({ npc }: { npc: NPC }) {
  const meshRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (!meshRef.current) return
    
    const current = meshRef.current.position
    const target = npc.target
    
    // Move towards target
    const direction = new THREE.Vector3().subVectors(target, current).normalize()
    current.add(direction.multiplyScalar(npc.speed))
    
    // Check if reached target
    if (current.distanceTo(target) < 2) {
      npc.target.set(
        (Math.random() - 0.5) * 400,
        0,
        (Math.random() - 0.5) * 400
      )
    }
    
    // Face movement direction
    meshRef.current.lookAt(target)
  })

  return (
    <group ref={meshRef} position={npc.position}>
      {/* Body */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.3, 1, 4, 8]} />
        <meshStandardMaterial color={npc.color} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshStandardMaterial color="#ffccaa" />
      </mesh>
    </group>
  )
}
