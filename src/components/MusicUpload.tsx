
import React, { useState, useRef } from 'react';
import { useMusicStore } from '../lib/musicStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Image, Upload } from 'lucide-react';

const MusicUpload: React.FC = () => {
  const { addMusic } = useMusicStore();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Placeholder de covers para seleção rápida
  const coverPlaceholders = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=400&fit=crop'
  ];
  
  const createObjectUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(createObjectUrl(file));
      setCoverUrl(''); // Limpa a URL externa quando um arquivo é selecionado
    }
  };

  const handleSelectCover = (url: string) => {
    setCoverUrl(url);
    setCoverPreview(null);
    setCoverFile(null);
  };

  const handleOpenCustomFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !artist) {
      toast.error('Preencha título e artista');
      return;
    }
    
    if (!coverUrl && !coverFile) {
      toast.error('Selecione uma capa para a música');
      return;
    }
    
    if (!audioFile) {
      toast.error('Selecione um arquivo de áudio');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Cria URLs de objeto para os arquivos carregados
      const audioUrl = createObjectUrl(audioFile);
      
      // Usa o arquivo de capa ou a URL externa
      const finalCoverUrl = coverFile ? createObjectUrl(coverFile) : coverUrl;
      
      await addMusic({
        title,
        artist,
        coverUrl: finalCoverUrl,
        audioUrl
      });
      
      // Limpa o formulário após sucesso
      setTitle('');
      setArtist('');
      setCoverUrl('');
      setCoverPreview(null);
      setCoverFile(null);
      setAudioFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.error('Erro ao adicionar música. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setArtist('');
    setCoverUrl('');
    setCoverPreview(null);
    setCoverFile(null);
    setAudioFile(null);
  };
  
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
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
            
            {/* Upload personalizado */}
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              
              <Button 
                type="button"
                onClick={handleOpenCustomFileDialog}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-20 border-dashed"
              >
                {coverPreview ? (
                  <div className="flex items-center gap-2">
                    <img 
                      src={coverPreview} 
                      alt="Cover preview" 
                      className="h-16 w-16 object-cover rounded"
                    />
                    <span className="text-sm">Alterar imagem</span>
                  </div>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload de capa personalizada</span>
                  </>
                )}
              </Button>
              
              {coverPreview && (
                <p className="text-xs text-gray-400 mt-1">
                  Imagem personalizada selecionada
                </p>
              )}
            </div>
            
            {/* Capas pré-definidas */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Ou escolha uma das capas pré-definidas:</p>
              <div className="grid grid-cols-4 gap-2">
                {coverPlaceholders.map((url) => (
                  <div 
                    key={url} 
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${coverUrl === url ? 'border-purps-500' : 'border-transparent'}`}
                    onClick={() => handleSelectCover(url)}
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
