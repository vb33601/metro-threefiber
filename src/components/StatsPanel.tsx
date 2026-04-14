import { Users, Building2, Trees, Car } from 'lucide-react'

export function StatsPanel() {
  return (
    <div className="metro-panel p-4 space-y-4">
      <h2 className="text-lg font-bold text-white">City Stats</h2>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <Building2 className="w-5 h-5 text-metro-accent mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">127</p>
          <p className="text-xs text-white/50">Buildings</p>
        </div>
        
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <Users className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">1,247</p>
          <p className="text-xs text-white/50">NPCs Active</p>
        </div>
        
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <Trees className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">342</p>
          <p className="text-xs text-white/50">Trees</p>
        </div>
        
        <div className="p-3 bg-white/5 rounded-xl text-center">
          <Car className="w-5 h-5 text-metro-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">56</p>
          <p className="text-xs text-white/50">Vehicles</p>
        </div>
      </div>
      
      <div className="p-3 bg-white/5 rounded-xl">
        <p className="text-xs text-white/50 mb-2">City Population</p>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-white">2.4M</p>
          <p className="text-xs text-metro-success mb-1">↑ 2.3%</p>
        </div>
      </div>
    </div>
  )
}
