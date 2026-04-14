import { Sun, Moon, Cloud, CloudRain, Wind } from 'lucide-react'

type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night'
type Weather = 'clear' | 'cloudy' | 'rain'

interface EnvironmentPanelProps {
  timeOfDay: TimeOfDay
  setTimeOfDay: (t: TimeOfDay) => void
  weather: Weather
  setWeather: (w: Weather) => void
}

export function EnvironmentPanel({ timeOfDay, setTimeOfDay, weather, setWeather }: EnvironmentPanelProps) {
  return (
    <div className="metro-panel p-4 space-y-4 max-h-[70vh] overflow-auto">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Sun className="w-5 h-5 text-metro-accent" />
        Environment
      </h2>
      
      {/* Time of Day */}
      <div className="space-y-2">
        <p className="text-xs text-white/50">Time of Day</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'dawn', icon: Sun, label: 'Dawn' },
            { id: 'day', icon: Sun, label: 'Day' },
            { id: 'dusk', icon: Moon, label: 'Dusk' },
            { id: 'night', icon: Moon, label: 'Night' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeOfDay(t.id as TimeOfDay)}
              className={`p-2 rounded-lg transition-all flex items-center gap-2 ${
                timeOfDay === t.id 
                  ? 'bg-metro-accent/30 text-metro-accent border border-metro-accent/50' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="text-xs">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Weather */}
      <div className="space-y-2">
        <p className="text-xs text-white/50">Weather</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'clear', icon: Sun, label: 'Clear' },
            { id: 'cloudy', icon: Cloud, label: 'Cloudy' },
            { id: 'rain', icon: CloudRain, label: 'Rain' }
          ].map((w) => (
            <button
              key={w.id}
              onClick={() => setWeather(w.id as Weather)}
              className={`p-2 rounded-lg transition-all flex flex-col items-center gap-1 ${
                weather === w.id 
                  ? 'bg-metro-accent/30 text-metro-accent border border-metro-accent/50' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              <w.icon className="w-5 h-5" />
              <span className="text-xs">{w.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Sliders */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div>
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3" /> Wind Speed
            </span>
            <span>15 km/h</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            defaultValue="15"
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-metro-accent"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs text-white/50 mb-1">
            <span>Temperature</span>
            <span>24°C</span>
          </div>
          <input
            type="range"
            min="-10"
            max="40"
            defaultValue="24"
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-metro-accent"
          />
        </div>
      </div>
    </div>
  )
}
