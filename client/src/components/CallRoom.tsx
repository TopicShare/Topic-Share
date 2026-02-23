import { useEffect, useRef } from "react";
import { useWebRTC } from "../hooks/useWebRTC";
import { useMediaAccess } from "../hooks/useMediaAccess";
import { useParams } from "react-router";
import { Button } from "@mantine/core";

export function CallRoom() {
  const { localStream, openMediaDevices } = useMediaAccess();
  const { callId } = useParams();
  const { startCall, endCall, isConnected, remoteStream } = useWebRTC(callId, localStream);

  useEffect(() => {
    openMediaDevices();
  }, []);

  useEffect(() => {
    if (callId && localStream) {
      startCall()
    }
  }, [callId, localStream]);

  // Auto-play remote audio
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play();
    }
  }, [remoteStream]);

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto  p-6 border-1 border-red-300">
      
      {/* Status */}
      <div className="text-center bg-gray-800 rounded p-4">
        <p>Status: {isConnected ? "Connected!" : "Waiting..."}</p>
        {callId && (
          <Button 
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(callId)}
          >
            📋 Copy Room ID: {callId}
          </Button>
        )}
      </div>

      {/* End Call */}
      {isConnected && (
        <button
          onClick={endCall}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          End Call
        </button>
      )}

      {/* Hidden audio element for remote stream */}
      <audio ref={audioRef} autoPlay playsInline className="hidden" />
      
      {remoteStream && (
        <p className="text-green-400 text-center">Remote Audio Playing</p>
      )}

    </div>
  )
}
