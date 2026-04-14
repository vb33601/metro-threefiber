// City grid and layout component
import { useMemo } from 'react'
// import * as THREE

export function City() {
  // Generate city blocks
  const blocks = useMemo(() => {
    const cityBlocks: any[] = []
    const size = 400
    const blockSize = 40
    const gap = 20
    
    for (let x = -size; x < size; x += blockSize + gap) {
      for (let z = -size; z < size; z += blockSize + gap) {
        // Skip center area for park
        if (Math.abs(x) < 60 && Math.abs(z) < 60) continue
        
        cityBlocks.push({
          position: [x, 0, z],
          size: blockSize,
          id: `block-${x}-${z}`
        })
      }
    }
    console.log("Generated", cityBlocks.length, "city blocks"); return cityBlocks
  }, [])

  return (
    <group>
      {/* City blocks would be rendered here */}
      {blocks.length > 0 && null}
    </group>
  )
}
