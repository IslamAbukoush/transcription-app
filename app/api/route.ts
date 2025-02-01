// app/api/transcribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import fs from 'fs'

// You might want to move this to an environment variable
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const audioFile = formData.get('file') as File
    const language = formData.get('language') as string

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Convert the File object to a Buffer
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Create a temporary file path
    const tempFilePath = `/tmp/${audioFile.name}`
    
    // Write the buffer to a temporary file
    await fs.promises.writeFile(tempFilePath, buffer)

    // Call Groq API for transcription
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3",
      response_format: "verbose_json",
      language,
      temperature: 0,
    });
    console.log(transcription);

    // Clean up the temporary file
    await fs.promises.unlink(tempFilePath).catch((err) => {
      console.error('Error cleaning up temp file:', err);
    });

    // Return the transcription
    return NextResponse.json({
      success: true,
      // @ts-expect-error - The Groq API response is not typed
      segments: transcription.segments
    })

  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Error processing audio file' },
      { status: 500 }
    )
  }
}