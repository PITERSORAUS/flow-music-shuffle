
import { create } from 'zustand';
import { Music } from '../types/music';
import { toast } from 'sonner';

// Demo músicas iniciais com URLs de áudio confiáveis
const demoMusics: Music[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
    duration: 146
  },
  {
    id: '2',
    title: 'Electric Dreams',
    artist: 'Synth Wave',
    coverUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=400&fit=crop',
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav',
    duration: 180
  },
  {
    id: '3',
    title: 'Deep Waters',
    artist: 'Ocean Mind',
    coverUrl: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=400&fit=crop',
    audioUrl: 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav',
    duration: 131
  }
];

// Função para gerar o array shuffle 
const generateShuffleQueue = (musics: Music[]) => {
  const queue = [...musics];
  // Algoritmo Fisher-Yates shuffle
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  return queue;
};

// Função para verificar se o áudio é compatível com o navegador
const canPlayAudio = (audio: HTMLAudioElement, type: string): boolean => {
  return audio.canPlayType(type) !== '';
};

// Função para obter a duração real do arquivo de áudio
const getAudioDuration = async (url: string): Promise<number> => {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
    });
    audio.addEventListener('error', () => {
      resolve(180); // Duração padrão em caso de erro
    });
    audio.src = url;
  });
};

interface MusicState {
  musics: Music[];
  currentMusic: Music | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  shuffleQueue: Music[];
  queueIndex: number;
  audio: HTMLAudioElement | null;
  // Ações
  addMusic: (music: Omit<Music, 'id' | 'duration'>) => Promise<void>;
  setCurrentMusic: (music: Music) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  initAudio: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  musics: demoMusics,
  currentMusic: null,
  isPlaying: false,
  currentTime: 0,
  volume: 0.8,
  shuffleQueue: [],
  queueIndex: 0,
  audio: null,

  addMusic: async (musicData) => {
    try {
      // Em uma aplicação real, faria upload do arquivo para um servidor
      // Simulamos com um ID aleatório e obtemos a duração real quando possível
      const duration = await getAudioDuration(musicData.audioUrl);
      
      const newMusic: Music = {
        ...musicData,
        id: Date.now().toString(),
        duration: isNaN(duration) ? 180 : duration, // Usa duração padrão se não conseguir obter
      };
      
      set(state => {
        const updatedMusics = [...state.musics, newMusic];
        // Atualiza o shuffle queue quando uma nova música é adicionada
        return { 
          musics: updatedMusics, 
          shuffleQueue: generateShuffleQueue(updatedMusics) 
        };
      });
      
      toast.success('Música adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar música:', error);
      toast.error('Não foi possível adicionar a música');
    }
  },

  setCurrentMusic: (music) => {
    set({ currentMusic: music, currentTime: 0 });
    
    // Encontra o índice da música no shuffle queue
    const queueIndex = get().shuffleQueue.findIndex(m => m.id === music.id);
    if (queueIndex !== -1) {
      set({ queueIndex });
    }
    
    const { audio } = get();
    if (audio) {
      audio.src = music.audioUrl;
      audio.currentTime = 0;
      audio.play().catch(e => {
        console.error('Erro ao reproduzir áudio:', e);
        // Tenta reproduzir de qualquer forma caso haja erro de autoplay
        document.addEventListener('click', () => {
          audio.play().catch(() => {});
        }, { once: true });
      });
      set({ isPlaying: true });
    }
  },

  setIsPlaying: (isPlaying) => {
    const { audio } = get();
    if (audio) {
      if (isPlaying) {
        audio.play().catch(e => {
          console.error('Erro ao reproduzir áudio:', e);
          // Tenta reproduzir após interação do usuário
          document.addEventListener('click', () => {
            audio.play().catch(() => {});
            set({ isPlaying: true });
          }, { once: true });
          
          // Mantém o estado como pausado se a reprodução falhar
          set({ isPlaying: false });
          return;
        });
      } else {
        audio.pause();
      }
    }
    set({ isPlaying });
  },

  setCurrentTime: (time) => {
    set({ currentTime: time });
    const { audio } = get();
    if (audio) {
      try {
        audio.currentTime = time;
      } catch (e) {
        console.error('Erro ao definir tempo de áudio:', e);
      }
    }
  },

  setVolume: (volume) => {
    set({ volume });
    const { audio } = get();
    if (audio) {
      audio.volume = volume;
    }
  },

  playNext: () => {
    const { shuffleQueue, queueIndex } = get();
    if (shuffleQueue.length === 0) return;
    
    const nextIndex = (queueIndex + 1) % shuffleQueue.length;
    const nextMusic = shuffleQueue[nextIndex];
    
    set({ queueIndex: nextIndex });
    get().setCurrentMusic(nextMusic);
  },

  playPrevious: () => {
    const { shuffleQueue, queueIndex } = get();
    if (shuffleQueue.length === 0) return;
    
    const prevIndex = queueIndex > 0 ? queueIndex - 1 : shuffleQueue.length - 1;
    const prevMusic = shuffleQueue[prevIndex];
    
    set({ queueIndex: prevIndex });
    get().setCurrentMusic(prevMusic);
  },

  initAudio: () => {
    if (get().audio) return;

    const audio = new Audio();
    audio.volume = get().volume;
    
    // Adiciona eventos de erro para melhor diagnóstico
    audio.addEventListener('error', (e) => {
      console.error('Erro no elemento de áudio:', e);
    });
    
    // Atualiza o currentTime enquanto toca
    audio.addEventListener('timeupdate', () => {
      set({ currentTime: audio.currentTime });
    });
    
    // Quando a música termina, pula para a próxima
    audio.addEventListener('ended', () => {
      get().playNext();
    });
    
    // Inicializa o shuffleQueue se ainda não foi feito
    const shuffleQueue = get().shuffleQueue.length > 0 
      ? get().shuffleQueue 
      : generateShuffleQueue(get().musics);
    
    set({ audio, shuffleQueue });
    
    // Inicia a primeira música se não houver nenhuma tocando
    if (!get().currentMusic && shuffleQueue.length > 0) {
      get().setCurrentMusic(shuffleQueue[0]);
    }
  }
}));
