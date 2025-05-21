
import React, { useState } from 'react';
import { useMusicStore } from '../lib/musicStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const MusicUpload: React.FC = () => {
  const { addMusic } = useMusicStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Placeholder de covers para seleção rápida
  const coverPlaceholders = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=400&fit=crop'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !artist || !coverUrl) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    if (!audioFile) {
      toast.error('Selecione um arquivo de áudio');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Em uma aplicação real, faríamos upload do arquivo para um serviço de armazenamento
      // Como é um demo, vamos usar uma URL pública de exemplo para simular
      
      // Esta URL seria do arquivo que o usuário fez upload
      const audioUrl = 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3';
      
      await addMusic({
        title,
        artist,
        coverUrl,
        audioUrl
      });
      
      // Limpa o formulário após sucesso
      setTitle('');
      setArtist('');
      setCoverUrl('');
      setAudioFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao adicionar música. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purps-600 hover:bg-purps-700">
          Upload de Música
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Música</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Música*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da música"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="artist">Artista*</Label>
            <Input
              id="artist"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Digite o nome do artista"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Capa da Música*</Label>
            <div className="grid grid-cols-4 gap-2">
              {coverPlaceholders.map((url) => (
                <div 
                  key={url} 
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${coverUrl === url ? 'border-purps-500' : 'border-transparent'}`}
                  onClick={() => setCoverUrl(url)}
                >
                  <img 
                    src={url} 
                    alt="Cover option" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="audio">Arquivo de Áudio*</Label>
            <Input
              id="audio"
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files && e.target.files[0])}
              required
            />
            <p className="text-xs text-gray-400">
              Formatos aceitos: MP3, WAV (máx. 10MB)
            </p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-purps-600 hover:bg-purps-700"
              disabled={isUploading}
            >
              {isUploading ? 'Enviando...' : 'Adicionar Música'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MusicUpload;
