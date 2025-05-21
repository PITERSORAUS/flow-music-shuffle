
import React, { useEffect, useRef, useState } from 'react';
import { useMusicStore } from '../lib/musicStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const MusicPlayer: React.FC = () => {
  const { 
    currentMusic, 
    isPlaying, 
    currentTime, 
    volume,
    setIsPlaying, 
    setCurrentTime, 
    setVolume,
    playNext,
    playPrevious
  } = useMusicStore();
  
  const [isMuted, setIsMuted] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const previousVolume = useRef(volume);
  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleProgressClick = (e: React.MouseEvent) => {
    if (!currentMusic || !progressBarRef.current) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * currentMusic.duration;
    
    setCurrentTime(newTime);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  const toggleMute = () => {
    if (isMuted) {
      setVolume(previousVolume.current || 0.5);
      setIsMuted(false);
    } else {
      previousVolume.current = volume;
      setVolume(0);
      setIsMuted(true);
    }
  };
  
  // Inicializa o áudio quando o componente é montado
  useEffect(() => {
    useMusicStore.getState().initAudio();
  }, []);
  
  if (!currentMusic) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-95 backdrop-blur-md py-2 px-3 sm:p-4 border-t border-gray-800 animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-wrap md:flex-nowrap items-center gap-4">
        {/* Capa e Info da Música */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
            <img 
              src={currentMusic.coverUrl} 
              alt={currentMusic.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="min-w-0 flex-grow">
            <p className="font-semibold text-sm truncate">{currentMusic.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentMusic.artist}</p>
          </div>
        </div>
        
        {/* Controles */}
        <div className="flex-grow flex flex-col items-center gap-1 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={playPrevious}
            >
              <SkipBack size={20} />
            </Button>
            
            <Button 
              className="bg-purps-500 hover:bg-purps-600 rounded-full w-9 h-9 flex items-center justify-center"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-white"
              onClick={playNext}
            >
              <SkipForward size={20} />
            </Button>
          </div>
          
          <div className="w-full flex items-center gap-2">
            <span className="text-xs text-gray-400 min-w-[40px] text-right">
              {formatTime(currentTime)}
            </span>
            
            <div 
              ref={progressBarRef}
              className="music-progress-bar flex-grow" 
              onClick={handleProgressClick}
            >
              <div 
                className="progress-filled"
                style={{ width: `${(currentTime / currentMusic.duration) * 100}%` }}
              />
            </div>
            
            <span className="text-xs text-gray-400 min-w-[40px]">
              {formatTime(currentMusic.duration)}
            </span>
          </div>
        </div>
        
        {/* Volume */}
        <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          
          <Slider
            defaultValue={[volume]}
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
