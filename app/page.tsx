'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Upload, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import AudioPlayer from '@/components/AudioPlayer'
import { TranscriptionSegment } from '@/types/transcription'

export default function UploadPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [language, setLanguage] = useState('en')
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [segments, setSegments] = useState<TranscriptionSegment[] | null>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile?.type.startsWith('audio/')) {
      setFile(droppedFile)
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an audio file."
      })
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type.startsWith('audio/')) {
      setFile(selectedFile)
    } else {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an audio file."
      })
    }
  }

  const handleSubmit = async () => {
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('language', language)

    try {
      const response = await fetch('/api', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Transcription failed')
      }
      console.log(data)
      console.log("GOT IT")
      setSegments(data.segments)
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to transcribe audio"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (segments) {
    return <AudioPlayer
        segments={segments}
        onReset={() => setSegments(null)}
        file={file ? URL.createObjectURL(file) : null}
      />
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Audio Transcription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop your audio file here, or
              <label className="mx-2 text-blue-500 hover:text-blue-600 cursor-pointer">
                browse
                <input
                  type="file"
                  className="hidden"
                  accept=".flac, .mp3, .mp4, .mpeg, .mpga, .m4a, .ogg, .wav, .webm"
                  onChange={handleFileInput}
                  disabled={isLoading}
                />
              </label>
            </p>
            {file && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Transcription Language</label>
            <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="af">Afrikaans</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="hy">Armenian</SelectItem>
                <SelectItem value="az">Azerbaijani</SelectItem>
                <SelectItem value="be">Belarusian</SelectItem>
                <SelectItem value="bs">Bosnian</SelectItem>
                <SelectItem value="bg">Bulgarian</SelectItem>
                <SelectItem value="ca">Catalan</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="hr">Croatian</SelectItem>
                <SelectItem value="cs">Czech</SelectItem>
                <SelectItem value="da">Danish</SelectItem>
                <SelectItem value="nl">Dutch</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="et">Estonian</SelectItem>
                <SelectItem value="fi">Finnish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="gl">Galician</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="el">Greek</SelectItem>
                <SelectItem value="he">Hebrew</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="hu">Hungarian</SelectItem>
                <SelectItem value="is">Icelandic</SelectItem>
                <SelectItem value="id">Indonesian</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="kn">Kannada</SelectItem>
                <SelectItem value="kk">Kazakh</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
                <SelectItem value="lv">Latvian</SelectItem>
                <SelectItem value="lt">Lithuanian</SelectItem>
                <SelectItem value="mk">Macedonian</SelectItem>
                <SelectItem value="ms">Malay</SelectItem>
                <SelectItem value="mr">Marathi</SelectItem>
                <SelectItem value="mi">Maori</SelectItem>
                <SelectItem value="ne">Nepali</SelectItem>
                <SelectItem value="no">Norwegian</SelectItem>
                <SelectItem value="fa">Persian</SelectItem>
                <SelectItem value="pl">Polish</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="ro">Romanian</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
                <SelectItem value="sr">Serbian</SelectItem>
                <SelectItem value="sk">Slovak</SelectItem>
                <SelectItem value="sl">Slovenian</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
                <SelectItem value="sv">Swedish</SelectItem>
                <SelectItem value="tl">Tagalog</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
                <SelectItem value="th">Thai</SelectItem>
                <SelectItem value="tr">Turkish</SelectItem>
                <SelectItem value="uk">Ukrainian</SelectItem>
                <SelectItem value="ur">Urdu</SelectItem>
                <SelectItem value="vi">Vietnamese</SelectItem>
                <SelectItem value="cy">Welsh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transcribing...
              </>
            ) : (
              'Start Transcription'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}