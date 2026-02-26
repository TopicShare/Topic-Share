import { useEffect, useRef } from "react";
import { useWebRTC } from "../hooks/useWebRTC";
import { useMediaAccess } from "../hooks/useMediaAccess";
import { useParams } from "react-router";
import { Center, Card, Stack, Button } from "@mantine/core";

export function CallRoom() {
  const { localStream, openMediaDevices } = useMediaAccess();
  const { callId } = useParams();
  const { startCall, endCall, isConnected, remoteStream } = useWebRTC(
    callId,
    localStream,
  );

  useEffect(() => {
    openMediaDevices();
  }, []);

  useEffect(() => {
    if (callId && localStream) {
      startCall();
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
    <Center >
      <Card shadow="sm" padding="xl" radius="md" w={{ base: "90%", sm: 380 }}>
        {/* Status */}
        <p>Status: {isConnected ? "Connected!" : "Waiting..."}</p>
        {callId && (
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(callId)}
          >
            📋 Copy Room ID: {callId}
          </Button>
        )}

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
      </Card>
    </Center>
  );
}
