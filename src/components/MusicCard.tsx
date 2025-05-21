
import React from 'react';
import { Music } from '../types/music';
import { useMusicStore } from '../lib/musicStore';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MusicCardProps {
  music: Music;
}

const MusicCard: React.FC<MusicCardProps> = ({ music }) => {
  const { currentMusic, isPlaying, setCurrentMusic, setIsPlaying } = useMusicStore();
  
  const isCurrentTrack = currentMusic?.id === music.id;
  
  const handlePlayToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentMusic(music);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div 
      className={`relative flex flex-col overflow-hidden rounded-md bg-secondary transition-all duration-300 group ${
        isCurrentTrack ? 'ring-2 ring-purps-500' : 'hover:bg-secondary/80'
      }`}
    >
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={music.coverUrl} 
          alt={`${music.title} cover`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            onClick={handlePlayToggle}
            className="rounded-full w-12 h-12 bg-purps-500 hover:bg-purps-600 text-white flex items-center justify-center"
          >
            {isCurrentTrack && isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
        </div>
      </div>
      
      <div className="p-3 flex flex-col">
        <h3 className="font-semibold line-clamp-1 text-sm text-white">{music.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{music.artist}</p>
        <p className="text-xs text-gray-500 mt-2">{formatDuration(music.duration)}</p>
      </div>
    </div>
  );
};

export default MusicCard;
