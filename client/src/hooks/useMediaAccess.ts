import { useState } from "react";

/*
 * Custom hook to handle WebRTC media stream
 */
export function useMediaAccess() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [error, setError] = useState<string | null>(null);
  const [loading, isLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState(false);

  const openMediaDevices = async () => {
    try {
      const constraints = { "audio": true, "video": false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      console.log("Got MediaStream: ", stream);
    } catch (error) {
      if (error.name === "NotAllowedError") {
        console.error("Need to grand this page permission to access your microphone");
      } else {
          console.error(`getUserMedia error: ${error.name}`, error);
      }
    }
  }

  const toggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });
    setIsMuted(prev => !prev);
  };

  return {
    openMediaDevices,
    localStream,
    error,
    loading,
    isLoading,
    isMuted,
    toggleMute,
  }
}
