import { useEffect, useState } from 'react'
import { Phone, PhoneDisabled, VolumeUp, Mic, MicOff } from '@mui/icons-material'
import agoraService from '../services/agora.service'
import { toast } from 'react-toastify'

interface AgoraVoiceCallProps {
  appId: string
  channel: string
  token: string
  uid: number | string
  onCallEnd?: () => void
  medicationName?: string
  dosage?: string
}

const AgoraVoiceCall = ({ appId, channel, token, uid, onCallEnd, medicationName, dosage }: AgoraVoiceCallProps) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [remoteUsers, setRemoteUsers] = useState<any[]>([])

  useEffect(() => {
    const initCall = async () => {
      try {
        // Initialize and join channel
        await agoraService.initialize(appId)
        await agoraService.joinChannel(
          { appId, channel, token, uid },
          {
            onUserJoined: (user) => {
              setRemoteUsers((prev) => [...prev, user])
              setIsConnected(true)
              toast.success('Connected to voice call')
            },
            onUserLeft: (user) => {
              setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid))
              toast.info('User left the call')
            },
            onUserPublished: async (user, mediaType) => {
              if (mediaType === 'audio') {
                const remoteAudioTrack = user.audioTrack
                if (remoteAudioTrack) {
                  remoteAudioTrack.play()
                }
              }
            }
          }
        )

        // Enable audio
        if (isAudioEnabled) {
          await agoraService.enableAudio()
        }

        setIsConnected(true)
      } catch (error: any) {
        console.error('Error initializing voice call:', error)
        toast.error(error.message || 'Failed to join voice call')
      }
    }

    initCall()

    return () => {
      agoraService.leaveChannel().catch(console.error)
    }
  }, [appId, channel, token, uid])

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

  return (
    <div className="flex flex-col items-center justify-center min-h-96 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg p-8">
      <div className="text-center text-white mb-8">
        <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 mx-auto">
          {isConnected ? (
            <Phone className="text-white" style={{ fontSize: 64 }} />
          ) : (
            <PhoneDisabled className="text-white" style={{ fontSize: 64 }} />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">Voice Call</h2>
        {medicationName && (
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
            <p className="text-lg font-semibold">Medication Reminder</p>
            <p className="text-sm mt-1">{medicationName} - {dosage}</p>
          </div>
        )}
        {remoteUsers.length > 0 && (
          <p className="text-sm mt-4 opacity-90">{remoteUsers.length} participant(s) in call</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${isAudioEnabled ? 'bg-white bg-opacity-20 text-white' : 'bg-red-500 text-white'}`}
        >
          {isAudioEnabled ? <Mic style={{ fontSize: 32 }} /> : <MicOff style={{ fontSize: 32 }} />}
        </button>

        <button
          onClick={endCall}
          className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700"
        >
          <PhoneDisabled style={{ fontSize: 32 }} />
        </button>
      </div>

      {!isConnected && (
        <div className="mt-6 text-white text-sm">
          <p>Connecting...</p>
        </div>
      )}
    </div>
  )
}

export default AgoraVoiceCall

