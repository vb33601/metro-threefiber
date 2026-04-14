import { useState } from 'react'
import { Train, Bus, Car, Clock, AlertCircle } from 'lucide-react'

interface TransportLine {
  id: string
  name: string
  type: 'metro' | 'bus' | 'tram'
  status: 'running' | 'delayed' | 'maintenance'
  next: string
  stations: number
}

const lines: TransportLine[] = [
  { id: 'm1', name: 'Blue Line', type: 'metro', status: 'running', next: '2 min', stations: 18 },
  { id: 'm2', name: 'Red Line', type: 'metro', status: 'running', next: '4 min', stations: 24 },
  { id: 'b1', name: 'City Bus 42', type: 'bus', status: 'running', next: '5 min', stations: 32 },
  { id: 't1', name: 'Tram A', type: 'tram', status: 'delayed', next: '12 min', stations: 15 },
]

export function TransportPanel() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="metro-panel p-4 space-y-3 max-h-[70vh] overflow-auto">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Train className="w-5 h-5 text-metro-accent" />
        Transport
      </h2>
      
      <div className="space-y-2">
        {lines.map((line) => (
          <button
            key={line.id}
            onClick={() => setSelected(selected === line.id ? null : line.id)}
            className={`w-full p-3 rounded-xl transition-all text-left ${
              selected === line.id 
                ? 'bg-metro-accent/20 border border-metro-accent/50' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {line.type === 'metro' && <Train className="w-5 h-5 text-metro-accent" />}
              {line.type === 'bus' && <Bus className="w-5 h-5 text-metro-gold" />}
              {line.type === 'tram' && <Car className="w-5 h-5 text-purple-400" />}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white text-sm">{line.name}</p>
                  {line.status === 'running' && <span className="w-2 h-2 bg-metro-success rounded-full" />}
                  {line.status === 'delayed' && <AlertCircle className="w-4 h-4 text-metro-warning" />}
                </div>
                <p className="text-xs text-white/50">{line.stations} stations • Next: {line.next}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="pt-2 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="p-2 bg-white/5 rounded-lg">
            <Car className="w-4 h-4 text-metro-accent mx-auto mb-1" />
            <p className="text-xs text-white/50">Active Cars</p>
            <p className="text-lg font-bold text-white">247</p>
          </div>
          <div className="p-2 bg-white/5 rounded-lg">
            <Clock className="w-4 h-4 text-metro-gold mx-auto mb-1" />
            <p className="text-xs text-white/50">Avg Wait</p>
            <p className="text-lg font-bold text-white">4m</p>
          </div>
        </div>
      </div>
    </div>
  )
}
