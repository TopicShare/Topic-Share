import { useState, useEffect, useRef } from "react";
import { useMediaAccess } from "../hooks/useMediaAccess";
import { useCallRoom } from "../hooks/useCallRoom";
import { useWebRTC } from "../hooks/useWebRTC";
import { Header } from "./Header";

export function AudioCall() {
  const [joinId, setJoinId] = useState("");
  const { localStream, openMediaDevices } = useMediaAccess();
  const { callId, createCallRoom, joinCallRoom } = useCallRoom();
  
  const { startCall, endCall, isConnected, remoteStream } = useWebRTC(callId, localStream);
  
  // Auto-play remote audio
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (audioRef.current && remoteStream) {
      audioRef.current.srcObject = remoteStream;
      audioRef.current.play();
    }
  }, [remoteStream]);

  const handleCreateRoom = async () => {
    if (!localStream) await openMediaDevices();
    await createCallRoom();
    await startCall();
  };

  const handleJoinRoom = async () => {
    if (!localStream) await openMediaDevices();
    const success = await joinCallRoom(joinId);
    if (success) await startCall();
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6">
      <Header />

      {/* Status */}
      <div className="text-center bg-gray-800 rounded p-4">
        <p>Status: {isConnected ? "Connected!" : "Waiting..."}</p>
        {callId && (
          <button 
            onClick={() => navigator.clipboard.writeText(callId)}
            className="bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-sm mt-2 transition-colors"
          >
            📋 Copy Room ID: {callId}
          </button>
        )}
      </div>

      {/* Microphone */}
      <button
        onClick={openMediaDevices}
        className={`px-4 py-2 rounded ${
          localStream ? "bg-green-600" : "bg-blue-600"
        } text-white`}
      >
        {localStream ? "✓ Microphone Ready" : "Enable Microphone"}
      </button>

      {/* Create Room */}
      <button
        onClick={handleCreateRoom}
        disabled={!localStream}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-500"
      >
        Create New Room
      </button>

      {/* Join Room */}
      <div className="space-y-2">
        <input
          value={joinId}
          onChange={(e) => setJoinId(e.target.value.toUpperCase())}
          placeholder="Enter Room ID"
          maxLength={6}
          className="w-full px-3 py-2 bg-gray-800 rounded"
        />
        <button
          onClick={handleJoinRoom}
          disabled={!localStream || !joinId.trim()}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-500"
        >
          Join Room
        </button>
      </div>

      {/* Start Call (for room creator) */}
      {callId && !isConnected && (
        <button
          onClick={startCall}
          className="px-4 py-2 bg-orange-600 text-white rounded"
        >
          Start Call
        </button>
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
    </div>
  );
}
