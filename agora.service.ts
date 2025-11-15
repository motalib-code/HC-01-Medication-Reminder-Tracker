import AgoraRTC from 'agora-rtc-sdk-ng'
import api from './api'

export interface AgoraConfig {
  appId: string
  channel: string
  token: string
  uid: number | string
}

class AgoraService {
  private client: any = null
  private localAudioTrack: any = null
  private localVideoTrack: any = null
  private remoteUsers: Map<string, any> = new Map()
  private isJoined: boolean = false

  async initialize(appId: string) {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    return this.client
  }

  async joinChannel(config: AgoraConfig, callbacks?: {
    onUserJoined?: (user: any) => void
    onUserLeft?: (user: any) => void
    onUserPublished?: (user: any, mediaType: string) => void
    onUserUnpublished?: (user: any, mediaType: string) => void
  }) {
    if (!this.client) {
      await this.initialize(config.appId)
    }

    try {
      // Join the channel
      await this.client.join(config.appId, config.channel, config.token, config.uid)
      this.isJoined = true

      // Set up event listeners
      this.client.on('user-published', async (user: any, mediaType: string) => {
        await this.client.subscribe(user, mediaType)
        if (callbacks?.onUserPublished) {
          callbacks.onUserPublished(user, mediaType)
        }
      })

      this.client.on('user-unpublished', (user: any, mediaType: string) => {
        if (callbacks?.onUserUnpublished) {
          callbacks.onUserUnpublished(user, mediaType)
        }
      })

      this.client.on('user-joined', (user: any) => {
        this.remoteUsers.set(user.uid.toString(), user)
        if (callbacks?.onUserJoined) {
          callbacks.onUserJoined(user)
        }
      })

      this.client.on('user-left', (user: any) => {
        this.remoteUsers.delete(user.uid.toString())
        if (callbacks?.onUserLeft) {
          callbacks.onUserLeft(user)
        }
      })

      return true
    } catch (error) {
      console.error('Error joining channel:', error)
      throw error
    }
  }

  async enableAudio() {
    try {
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
      await this.client.publish([this.localAudioTrack])
      return this.localAudioTrack
    } catch (error) {
      console.error('Error enabling audio:', error)
      throw error
    }
  }

  async disableAudio() {
    if (this.localAudioTrack) {
      this.localAudioTrack.stop()
      this.localAudioTrack.close()
      await this.client.unpublish([this.localAudioTrack])
      this.localAudioTrack = null
    }
  }

  async enableVideo() {
    try {
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack()
      await this.client.publish([this.localVideoTrack])
      return this.localVideoTrack
    } catch (error) {
      console.error('Error enabling video:', error)
      throw error
    }
  }

  async disableVideo() {
    if (this.localVideoTrack) {
      this.localVideoTrack.stop()
      this.localVideoTrack.close()
      await this.client.unpublish([this.localVideoTrack])
      this.localVideoTrack = null
    }
  }

  async leaveChannel() {
    try {
      if (this.localAudioTrack) {
        await this.disableAudio()
      }
      if (this.localVideoTrack) {
        await this.disableVideo()
      }
      
      if (this.client && this.isJoined) {
        await this.client.leave()
        this.isJoined = false
      }
      
      this.remoteUsers.clear()
    } catch (error) {
      console.error('Error leaving channel:', error)
      throw error
    }
  }

  getLocalAudioTrack() {
    return this.localAudioTrack
  }

  getLocalVideoTrack() {
    return this.localVideoTrack
  }

  getRemoteUsers() {
    return Array.from(this.remoteUsers.values())
  }

  isChannelJoined() {
    return this.isJoined
  }

  async generateToken(channelName: string, uid: number | string, role: 'publisher' | 'subscriber' = 'publisher') {
    try {
      const response = await api.post('/agora/token', {
        channelName,
        uid,
        role
      })
      return response.data.token
    } catch (error) {
      console.error('Error generating token:', error)
      throw error
    }
  }
}

export default new AgoraService()

