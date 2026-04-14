import { useState } from 'react'
import { Building2, Hotel, Store, Home, ArrowRight, Navigation } from 'lucide-react'

interface Building {
  id: string
  name: string
  type: string
  position: [number, number, number]
  height: number
  floors: number
}

const buildings: Building[] = [
  { id: '1', name: 'Metro Tower', type: 'office', position: [0, 60, 0], height: 120, floors: 40 },
  { id: '2', name: 'Grand Hotel', type: 'hotel', position: [100, 40, 100], height: 80, floors: 25 },
  { id: '3', name: 'Sky Mall', type: 'mall', position: [-100, 15, 100], height: 30, floors: 4 },
  { id: '4', name: 'Park Apartments', type: 'residential', position: [100, 30, -100], height: 60, floors: 20 },
  { id: '5', name: 'Tech Plaza', type: 'office', position: [-100, 45, -100], height: 90, floors: 30 },
  { id: '6', name: 'City Center', type: 'mall', position: [0, 20, 150], height: 40, floors: 6 },
]

export function BuildingPanel() {
  const [selected, setSelected] = useState<Building | null>(null)

  return (
    <div className="metro-panel p-4 space-y-3 max-h-[70vh] overflow-auto">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Building2 className="w-5 h-5 text-metro-accent" />
        Buildings
      </h2>
      
      <div className="space-y-2">
        {buildings.map((building) => (
          <button
            key={building.id}
            onClick={() => setSelected(selected?.id === building.id ? null : building)}
            className={`w-full p-3 rounded-xl transition-all text-left ${
              selected?.id === building.id 
                ? 'bg-metro-accent/20 border border-metro-accent/50' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {building.type === 'office' && <Building2 className="w-5 h-5 text-metro-accent" />}
              {building.type === 'hotel' && <Hotel className="w-5 h-5 text-purple-400" />}
              {building.type === 'mall' && <Store className="w-5 h-5 text-metro-gold" />}
              {building.type === 'residential' && <Home className="w-5 h-5 text-green-400" />}
              <div className="flex-1">
                <p className="font-medium text-white text-sm">{building.name}</p>
                <p className="text-xs text-white/50">{building.floors} floors • {building.height}m</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30" />
            </div>
            
            {selected?.id === building.id && (
              <div className="mt-3 pt-3 border-t border-white/10 text-xs space-y-2">
                <p className="text-white/70">Position: {building.position.join(', ')}</p>
                <button className="w-full py-2 bg-metro-accent/20 text-metro-accent rounded-lg hover:bg-metro-accent/30 transition-colors flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Navigate To
                </button>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
