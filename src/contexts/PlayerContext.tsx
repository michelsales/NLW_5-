import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  isLooping: () => boolean;
  playNext: () => void;
  toggleLoop:() => void;
  toggleShuffle:() => void;
  isShuffling: () => boolean;
  playPrevious: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodelist] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); 
  const [isLooping, setIsLooping] = useState(false); 
  const [isShuffling, setIsShuffling] = useState(false); 
  
  
  function play(episode: Episode){
    setEpisodelist([episode])
    setCurrentEpisodeIndex(0);   
    setIsPlaying(true);
  }
  
  function playList(list: Episode[], index: number){
    setEpisodelist(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }
  function toggleShuffle(){
    setIsShuffling(!isPlaying);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }
  function clearPlayerState(){
    setEpisodelist([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;


  function playNext(){
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    }else if(hasNext){
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  
  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }
  
  return (
    <PlayerContext.Provider
     value={{
            episodeList, 
            currentEpisodeIndex,
            play,
            playList,
            isPlaying,
            togglePlay,
            playNext,
            playPrevious,
            setPlayingState,
            hasNext,
            hasPrevious,
            isLooping,
            isShuffling,
            toggleShuffle,
            toggleLoop,
            clearPlayerState
            }}>
        {children}
      </PlayerContext.Provider>
    )
}
export const usePlayer = () => {
  return useContext(PlayerContext);
}