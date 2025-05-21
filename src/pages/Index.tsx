
import React, { useEffect } from 'react';
import MusicList from '../components/MusicList';
import MusicPlayer from '../components/MusicPlayer';
import MusicUpload from '../components/MusicUpload';
import { useMusicStore } from '../lib/musicStore';

const Index: React.FC = () => {
  const { initAudio } = useMusicStore();
  
  // Inicializa o player quando a página carrega
  useEffect(() => {
    initAudio();
  }, [initAudio]);
  
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="border-b border-gray-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purps-400 to-purps-600">
            PurpsCloud
          </h1>
          
          <MusicUpload />
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 pt-8">
        <MusicList />
      </main>
      
      {/* Player fixo - aparece quando há música */}
      <MusicPlayer />
    </div>
  );
};

export default Index;
