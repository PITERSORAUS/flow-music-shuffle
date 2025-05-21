
import React, { useState } from 'react';
import { Music } from '../types/music';
import { useMusicStore } from '../lib/musicStore';
import { Play, Pause, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface MusicCardProps {
  music: Music;
}

const MusicCard: React.FC<MusicCardProps> = ({ music }) => {
  const { 
    currentMusic, 
    isPlaying, 
    setCurrentMusic, 
    setIsPlaying,
    likeMusic,
    deleteMusic
  } = useMusicStore();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const isCurrentTrack = currentMusic?.id === music.id;
  
  const handlePlayToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isCurrentTrack) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentMusic(music);
    }
  };

  const handleLikeMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMusic(music.id);
    toast.success('Música curtida!');
  };
  
  const handleDeleteMusic = async () => {
    setIsDeleting(true);
    try {
      await deleteMusic(music.id);
      toast.success('Música removida com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover música');
      console.error(error);
    } finally {
      setIsDeleting(false);
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
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center text-xs text-gray-400">
              <Play size={14} className="mr-1" />
              <span>{music.plays}</span>
            </div>
            
            <button 
              onClick={handleLikeMusic} 
              className="flex items-center text-xs text-gray-400 hover:text-purps-400 transition-colors"
            >
              <Heart size={14} className={`mr-1 ${music.likes > 0 ? 'fill-purps-400 text-purps-400' : ''}`} />
              <span>{music.likes}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">{formatDuration(music.duration)}</p>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-transparent"
                >
                  <Trash2 size={14} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a música "{music.title}"?<br />
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteMusic}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Removendo...' : 'Remover'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicCard;
