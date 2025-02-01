export interface TranscriptionSegment {
    id: number
    seek: number
    start: number
    end: number
    text: string
    tokens: any[] // You can make this more specific if needed
    temperature: number
    avg_logprob: number
    compression_ratio: number
    no_speech_prob: number
  }