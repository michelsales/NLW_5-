
import {useRef, useEffect, useState} from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { isPast } from 'date-fns';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export default function Player(){
   
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

   const {
          episodeList,
          currentEpisodeIndex,
          isPlaying,
          isLooping,
          isShuffling,
          togglePlay,
          toggleLoop,
          toggleShuffle,
          setPlayingState,
          playNext,
          playPrevious,
          hasNext,
          hasPrevious,
          clearPlayerState,
         } = usePlayer();


         useEffect(() => {
             if(!audioRef.current){
                 return;
             }

             if(isPlaying){
                 audioRef.current.play();
             }
             else{
                 audioRef.current.pause();
             }
         }, [isPlaying])

         function setupProgressListener(){
            audioRef.current.currentTime = 0;

            audioRef.current.addEventListener('timeupdate', event =>{
                setProgress(Math.floor(audioRef.current.currentTime));
            });
         }
         function handleEpisodeEnded(){
             if(hasNext){
                 playNext()
             }else{
                clearPlayerState();
             }
         }
         function handleSeek(amount: number){
                audioRef.current.currentTime = amount;
                setProgress(amount);
         }

   const episode = episodeList[currentEpisodeIndex]
     
   return(
     <div className={styles.playerContainer}>
       <header>
           <img src="/playing.svg" alt="tocando agora"></img>
           <strong>Tocando agora: </strong>
       </header>

       {episode ? (
           <div className={styles.currentEpisode}>
               <Image 
                width={592} 
                height={592} 
                src={episode.thumbnail} 
                objectFit="cover"
                />
                <strong>{episode.title}</strong>
                <span>{episode.members}</span>
           </div>
       ) : (
           <div className={styles.emptyPlayer}>
           <strong>Selecione um podcast para ouvir</strong>
            </div>
       )}

        <footer className={!episode ? styles.empty : ''}>
            <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span> 
                <div className={styles.slider}>
                 { episode ? (
                     <Slider
                        max={episode.duration}
                        value={progress}
                        onChange={handleSeek}
                        trackStyle={{backgroundColor: '#04d361'}}
                        railStyle={{backgroundColor: '#9f75ff'}}
                        handleStyle={{borderColor: '#04d361' }}
                     />
                 ): (
                    <div className={styles.emptySlider}/>                
                 )} 
                </div>
                <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span> 
            </div>

            {episode &&  (
                <audio
                    src={episode.url}
                    ref={audioRef}
                    autoPlay
                    onEnded={handleEpisodeEnded}
                    loop={isLooping}
                    onPlay={() => setPlayingState(true)}
                    onPause={() => setPlayingState(false)}
                    onLoadedData={setupProgressListener}
                />
            )}
            <div className={styles.buttons}>
                <button type="button" disabled={!episode || episodeList.length == 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}> 
                    <img src="/shuffle.svg" alt="embaralhar"/>    
                </button>
                <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious} >
                    <img src="/play-previous.svg" alt="tocar anterior"/>    
                </button>
                <button 
                    type="button" 
                    className={styles.playButton}
                    disabled={!episode}
                    onClick={togglePlay}
                 >
                    { isPlaying
                     ? <img src="/pause.svg" alt="tocar"/>  
                    : <img src="/play.svg" alt="tocar"/>   } 
                </button>
                <button type="button" disabled={!episode || !hasNext} onClick={playNext} > 
                    <img src="/play-next.svg" alt="tocar próxima"/>    
                </button>
                <button type="button" className={isLooping ? styles.isActive : ''} onClick={toggleLoop} disabled={!episode }>
                    <img src="/repeat.svg" alt="repetir"/>    
                </button>
            </div>
        </footer>
     </div>
    );
}