import { useState, useEffect, useRef } from "react";
import { useMediaAccess } from "../hooks/useMediaAccess";
import { useCallRoom } from "../hooks/useCallRoom";
import { useWebRTC } from "../hooks/useWebRTC";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export function AudioCall() {
  const [joinId, setJoinId] = useState("");
  //const { localStream, openMediaDevices } = useMediaAccess();
  const { callId, createCallRoom, joinCallRoom } = useCallRoom();
  //const { startCall, endCall, isConnected, remoteStream } = useWebRTC(callId, localStream);
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    await createCallRoom();
  };

  // TODO: When room is created, do not automatically redirect to call room

  // Navigate when callId is set (after room creation)
  useEffect(() => {
    if (callId) {
      navigate(`/callRoom/${callId}`);
    }
  }, [callId, navigate]);

  const handleJoinRoom = () => {
    if (joinId.length === 6) {
      navigate(`/callRoom/${joinId}`);
    }
  };

  /*
  const handleJoinRoom = async () => {
    if (!localStream) await openMediaDevices();
    const success = await joinCallRoom(joinId);
    navigate(`/callRoom/${callId}`);
    if (success) await startCall();
  };
  */

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto  p-6 border-1 border-red-300">
      {/* Create Room */}
      <Button
        onClick={handleCreateRoom}
        variant="default"
        className="w-36 mx-auto"
      >
        Create New Room
      </Button>

      {/* Join Room */}
      <div className="space-y-2 flex flex-col items-center">
        <input
          value={joinId}
          onChange={(e) => setJoinId(e.target.value.toUpperCase())}
          placeholder="Enter Room ID"
          maxLength={6}
          className="w-36 px-3 py-2 bg-accent border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          onClick={handleJoinRoom}
        >
          Join Room
        </Button>
      </div>

    </div>
  );
}
