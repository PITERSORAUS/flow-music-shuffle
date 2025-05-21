
import React from 'react';
import { useMusicStore } from '../lib/musicStore';
import MusicCard from './MusicCard';

const MusicList: React.FC = () => {
  const { musics } = useMusicStore();
  
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Músicas Disponíveis</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {musics.map((music) => (
          <MusicCard key={music.id} music={music} />
        ))}
        
        {musics.length === 0 && (
          <div className="col-span-full py-10 text-center text-muted-foreground">
            Nenhuma música disponível. Seja o primeiro a adicionar!
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicList;
