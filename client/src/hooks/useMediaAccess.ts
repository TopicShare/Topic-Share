import { useState } from "react";

/*
 * Custom hook to handle WebRTC media stream
 */
export function useMediaAccess() {
  // State management for MediaStream and errors
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [error, setError] = useState<string | null>(null);
  const [loading, isLoading] = useState<boolean>(false);

  // TODO: Include additional error handling

  // Media access and permission handling
  const openMediaDevices = async () => {
    try {
      const constraints = { "audio": true, "video": false };
      // Getting media stream
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
  return {
    openMediaDevices,
    localStream,
    error,
    loading,
    isLoading
  }
}
