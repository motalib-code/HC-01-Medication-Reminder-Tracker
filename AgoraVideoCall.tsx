import { useEffect, useRef, useState } from 'react'
import { Videocam, VideocamOff, Mic, MicOff, CallEnd, VolumeUp } from '@mui/icons-material'
import agoraService from '../services/agora.service'
import { toast } from 'react-toastify'

interface AgoraVideoCallProps {
  appId: string
  channel: string
  token: string
  uid: number | string
  onCallEnd?: () => void
  audioOnly?: boolean
}

const AgoraVideoCall = ({ appId, channel, token, uid, onCallEnd, audioOnly = false }: AgoraVideoCallProps) => {
  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(!audioOnly)
  const [remoteUsers, setRemoteUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initCall = async () => {
      try {
        setIsLoading(true)
        
        // Initialize and join channel
        await agoraService.initialize(appId)
        await agoraService.joinChannel(
          { appId, channel, token, uid },
          {
            onUserJoined: (user) => {
              setRemoteUsers((prev) => [...prev, user])
              toast.success('User joined the call')
            },
            onUserLeft: (user) => {
              setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid))
              toast.info('User left the call')
            },
            onUserPublished: async (user, mediaType) => {
              if (mediaType === 'video') {
                const remoteVideoTrack = user.videoTrack
                if (remoteVideoTrack && remoteVideoRef.current) {
                  remoteVideoTrack.play(remoteVideoRef.current)
                }
              }
              if (mediaType === 'audio') {
                const remoteAudioTrack = user.audioTrack
                if (remoteAudioTrack) {
                  remoteAudioTrack.play()
                }
              }
            },
            onUserUnpublished: (user, mediaType) => {
              if (mediaType === 'video' && remoteVideoRef.current) {
                const remoteVideoTrack = user.videoTrack
                if (remoteVideoTrack) {
                  remoteVideoTrack.stop()
                }
              }
            }
          }
        )

        // Enable audio
        if (isAudioEnabled) {
          await agoraService.enableAudio()
        }

        // Enable video if not audio-only
        if (isVideoEnabled && !audioOnly) {
          const localVideoTrack = await agoraService.enableVideo()
          if (localVideoTrack && localVideoRef.current) {
            localVideoTrack.play(localVideoRef.current)
          }
        }

        setIsLoading(false)
        toast.success('Connected to call')
      } catch (error: any) {
        console.error('Error initializing call:', error)
        toast.error(error.message || 'Failed to join call')
        setIsLoading(false)
      }
    }

    initCall()

    return () => {
      agoraService.leaveChannel().catch(console.error)
    }
  }, [appId, channel, token, uid, audioOnly])

  const toggleAudio = async () => {
    try {
      if (isAudioEnabled) {
        await agoraService.disableAudio()
        setIsAudioEnabled(false)
      } else {
        await agoraService.enableAudio()
        setIsAudioEnabled(true)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle audio')
    }
  }

  const toggleVideo = async () => {
    try {
      if (isVideoEnabled) {
        await agoraService.disableVideo()
        setIsVideoEnabled(false)
      } else {
        const localVideoTrack = await agoraService.enableVideo()
        if (localVideoTrack && localVideoRef.current) {
          localVideoTrack.play(localVideoRef.current)
        }
        setIsVideoEnabled(true)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to toggle video')
    }
  }

  const endCall = async () => {
    try {
      await agoraService.leaveChannel()
      toast.info('Call ended')
      if (onCallEnd) {
        onCallEnd()
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to end call')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 rounded-lg">
        <div className="text-white text-lg">Connecting to call...</div>
      </div>
    )
  }

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {/* Remote Video */}
      <div className="w-full h-96 relative">
        <div ref={remoteVideoRef} className="w-full h-full"></div>
        {remoteUsers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center text-white">
              <VolumeUp className="mx-auto mb-4" style={{ fontSize: 48 }} />
              <p>Waiting for other participants...</p>
            </div>
          </div>
        )}
      </div>

      {/* Local Video */}
      {!audioOnly && isVideoEnabled && (
        <div className="absolute bottom-20 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
          <div ref={localVideoRef} className="w-full h-full"></div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 flex items-center justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full ${isAudioEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
        >
          {isAudioEnabled ? <Mic /> : <MicOff />}
        </button>
        
        {!audioOnly && (
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${isVideoEnabled ? 'bg-gray-700 text-white' : 'bg-red-600 text-white'}`}
          >
            {isVideoEnabled ? <Videocam /> : <VideocamOff />}
          </button>
        )}

        <button
          onClick={endCall}
          className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700"
        >
          <CallEnd />
        </button>
      </div>
    </div>
  )
}

export default AgoraVideoCall

