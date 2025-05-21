
export interface Music {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  likes: number;
  plays: number;
}

// Define tipos de fontes de áudio compatíveis
export type AudioSource = {
  type: string;
  url: string;
};
