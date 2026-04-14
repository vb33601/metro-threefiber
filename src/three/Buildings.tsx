import { useMemo, useRef } from 'react'
// import { useFrame }
import * as THREE from 'three'

interface BuildingData {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  type: 'office' | 'residential' | 'hotel' | 'mall' | 'skyscraper'
  id: string
  windows: boolean[]
}

export function Buildings({ timeOfDay }: { timeOfDay: string }) {
  const buildingsRef = useRef<THREE.Group>(null)

  // Generate buildings data
  const buildings = useMemo<BuildingData[]>(() => {
    const blds: BuildingData[] = []
    const gridSize = 6
    const spacing = 80
    
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        // Skip center (park area)
        if (Math.abs(x) <= 1 && Math.abs(z) <= 1) continue
        
        const posX = x * spacing + (Math.random() - 0.5) * 20
        const posZ = z * spacing + (Math.random() - 0.5) * 20
        
        // Determine building type based on distance from center
        const dist = Math.sqrt(x * x + z * z)
        let type: BuildingData['type']
        if (dist < 3) type = 'skyscraper'
        else if (dist < 5) type = 'office'
        else if (Math.random() > 0.7) type = 'hotel'
        else if (Math.random() > 0.5) type = 'mall'
        else type = 'residential'
        
        // Building dimensions
        const width = 15 + Math.random() * 15
        const depth = 15 + Math.random() * 15
        let height = 20
        
        switch (type) {
          case 'skyscraper': height = 80 + Math.random() * 100; break
          case 'office': height = 40 + Math.random() * 60; break
          case 'hotel': height = 30 + Math.random() * 40; break
          case 'mall': height = 15 + Math.random() * 10; break
          case 'residential': height = 25 + Math.random() * 20; break
        }
        
        // Building colors
        const colors = ['#3a3a4e', '#2a2a3e', '#4a4a5e', '#3e3e52', '#454559']
        const color = colors[Math.floor(Math.random() * colors.length)]
        
        // Generate window lights
        const windowRows = Math.floor(height / 5)
        const windowCols = Math.floor(width / 4)
        const windows: boolean[] = []
        for (let i = 0; i < windowRows * windowCols; i++) {
          windows.push(Math.random() > 0.4)
        }
        
        blds.push({
          position: [posX, height / 2, posZ],
          size: [width, height, depth],
          color,
          type,
          id: `building-${x}-${z}`,
          windows
        })
      }
    }
    return blds
  }, [])

  return (
    <group ref={buildingsRef}>
      {buildings.map((building) => (
        <BuildingMesh 
          key={building.id} 
          building={building}
          timeOfDay={timeOfDay}
        />
      ))}
    </group>
  )
}

function BuildingMesh({ building, timeOfDay }: { building: BuildingData; timeOfDay: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  // const windowsRef
  
  const windowLights = useMemo(() => {
    const dummy = new THREE.Object3D()
    const lights: THREE.Object3D[] = []
    
    const rows = Math.floor(building.size[1] / 5)
    const cols = Math.floor(building.size[0] / 4)
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (Math.random() > 0.3) {
          dummy.position.set(
            (col - cols / 2) * 4 + 2,
            (row - rows / 2) * 5 + 2,
            building.size[2] / 2 + 0.1
          )
          dummy.scale.set(2, 3, 0.1)
          dummy.updateMatrix()
          lights.push(dummy.clone())
        }
      }
    }
    return lights
  }, [building])

  return (
    <group position={building.position}>
      {/* Building Body */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={building.size} />
        <meshStandardMaterial 
          color={building.color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Building Top */}
      <mesh position={[0, building.size[1] / 2 + 1, 0]} castShadow>
        <boxGeometry args={[building.size[0] + 2, 2, building.size[2] + 2]} />
        <meshStandardMaterial color="#2a2a3e" />
      </mesh>
      
      {/* Antenna for skyscrapers */}
      {building.type === 'skyscraper' && (
        <mesh position={[0, building.size[1] / 2 + 15, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 30]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      
      {/* Windows (emissive at night) */}
      {windowLights.map((light, i) => (
        <mesh 
          key={i}
          position={light.position}
          scale={light.scale}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            color={timeOfDay === 'night' ? '#ffdd88' : '#2a3a4e'}
            transparent
            opacity={timeOfDay === 'night' ? 0.8 : 0.3}
          />
        </mesh>
      ))}
      
      {/* Side windows */}
      {windowLights.map((light, i) => (
        <mesh 
          key={`side-${i}`}
          position={[building.size[0] / 2 + 0.1, light.position.y, light.position.x]}
          scale={light.scale}
          rotation={[0, Math.PI / 2, 0]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            color={timeOfDay === 'night' ? '#ffdd88' : '#2a3a4e'}
            transparent
            opacity={timeOfDay === 'night' ? 0.8 : 0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
