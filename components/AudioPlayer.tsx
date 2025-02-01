import React, { useState, useRef, useEffect } from 'react';
import Transcription from './transcription';
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { TranscriptionSegment } from '@/types/transcription';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface AudioPlayerProps {
  file: string | null;
  onReset: () => void;
  segments: TranscriptionSegment[];
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ file, onReset, segments }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    return () => {
      if (currentAudioRef) {
        currentAudioRef.pause();
      }
    };
  }, []);

  if (!file) return null;

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = (): void => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const play = (): void => {
    if (!audioRef.current) return;

    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleTimeUpdate = (): void => {
    if (!audioRef.current) return;

    const currentTime = audioRef.current.currentTime;
    setCurrentTime(currentTime);
  };

  const handleLoadedMetadata = (): void => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleVolumeChange = (value: number[]): void => {
    if (!audioRef.current) return;

    const newVolume = value[0];
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleSeek = (value: number[]): void => {
    if (!audioRef.current) return;

    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = (): void => {
    if (!audioRef.current) return;

    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const finish = () => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = duration;
    setCurrentTime(duration);
  };

  const startOver = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-10">
        <div className="container mx-auto p-4">
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            src={file}
          />

          <div className="flex flex-col gap-4">
            {/* Progress bar */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={startOver}>
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={finish}>
                  <SkipForward className="h-5 w-5"/>
                </Button>
              </div>

              {/* Volume control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transcription
        play={play}
        audioRef={audioRef}
        className="mb-[100px]"
        segments={segments}
        onReset={onReset}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
      />
    </>
  );
};

export default AudioPlayer;