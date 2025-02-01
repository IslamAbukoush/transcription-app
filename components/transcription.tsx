'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, PlayCircle, Clock } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import type { TranscriptionSegment } from '@/types/transcription'
import { useState, useCallback, useEffect, useRef } from 'react'

interface ContextMenuProps {
  x: number
  y: number
  text: string
  onClose: () => void
  onCopy: () => void
  onPlay: () => void
  timestamp: string
}

const ContextMenu = ({ x, y, onClose, onCopy, onPlay, timestamp }: ContextMenuProps) => {
  useEffect(() => {
    const handleClick = () => onClose()
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [onClose])

  return (
    <div
      className="fixed bg-white shadow-lg rounded-lg py-1 z-50 w-48 border border-gray-200 dark:bg-gray-950 dark:border-gray-800"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `translate(${x + 200 > window.innerWidth ? -100 : 0}%, ${y + 200 > window.innerHeight ? -100 : 0}%)`
      }}
    >
      <button
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
        onClick={onPlay}
      >
        <PlayCircle size={16} />
        Play from here
      </button>
      <button
        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
        onClick={onCopy}
      >
        <Copy size={16} />
        Copy text
      </button>
      <div className="w-full px-4 py-2 text-sm text-gray-500 flex items-center gap-2 border-t dark:border-gray-800">
        <Clock size={16} />
        {timestamp}
      </div>
    </div>
  )
}

interface TranscriptionPageProps {
  segments: TranscriptionSegment[]
  onReset: () => void
  currentTime: number
  setCurrentTime: (time: number) => void
  className: string
  audioRef: React.RefObject<HTMLAudioElement | null> | null
  play: () => void
}

export default function TranscriptionPage({ segments, onReset, currentTime, setCurrentTime, className, audioRef, play }: TranscriptionPageProps) {
  const { toast } = useToast()
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    text: string
    timestamp: string
    start: number
  } | null>(null)

  const highlightedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [currentTime])

  const handleContextMenu = useCallback((e: React.MouseEvent, segment: TranscriptionSegment) => {
    e.preventDefault()
    const timestamp = new Date(segment.start * 1000).toISOString().substr(11, 8)
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      text: segment.text.trim(),
      timestamp,
      start: segment.start
    })
  }, [])

  const copyToClipboard = async (text: string, isFullText: boolean = false) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        description: isFullText ? "Full transcription copied to clipboard" : "Text segment copied to clipboard",
        duration: 2000,
      })
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy text to clipboard",
        duration: 2000,
      })
      console.error('Failed to copy text: ', err)
    }
  }

  const copyFullText = () => {
    const fullText = segments.map(segment => segment.text.trim()).join(' ')
    copyToClipboard(fullText, true)
  }

  const handlePlay = (start: number) => {
    if (!audioRef?.current) return
    audioRef.current.currentTime = start
    setCurrentTime(start)
    play()
  }

  return (
    <div className={`container mx-auto px-4 sm:px-6 md:px-8 ${className}`}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b">
          <CardTitle className="text-xl sm:text-2xl">Transcription Result</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={copyFullText}
              className="flex-1 sm:flex-none"
            >
              <Copy className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Copy All</span>
              <span className="sm:hidden">Copy</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="flex-1 sm:flex-none"
            >
              <span className="hidden sm:inline">New Transcription</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-100
          [&::-webkit-scrollbar-track]:rounded-lg
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          [&::-webkit-scrollbar-thumb]:rounded-lg
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-gray-100
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-400
          dark:[&::-webkit-scrollbar-track]:bg-gray-800
          dark:[&::-webkit-scrollbar-thumb]:bg-gray-600
          dark:[&::-webkit-scrollbar-thumb]:border-gray-800
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500
          transition-colors">
          <div className="space-y-1 leading-relaxed text-base sm:text-lg">
            {segments.map((segment, i) => {
              const highlighted = segment.start <= currentTime && segment.end >= currentTime;
              return (
                <span
                  key={i}
                  ref={highlighted ? highlightedRef : null}
                  onContextMenu={(e) => handleContextMenu(e, segment)}
                  className={`
                    inline-block px-1.5 py-0.5 rounded-sm cursor-pointer
                    transition-colors duration-200 ease-in-out
                    ${highlighted
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {segment.text.trim()}{' '}
                </span>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          text={contextMenu.text}
          timestamp={contextMenu.timestamp}
          onClose={() => setContextMenu(null)}
          onCopy={() => {
            copyToClipboard(contextMenu.text)
            setContextMenu(null)
          }}
          onPlay={() => {
            handlePlay(contextMenu.start)
            setContextMenu(null)
          }}
        />
      )}
    </div>
  )
}