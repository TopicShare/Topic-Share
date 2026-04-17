import { useEffect, useRef } from "react";
import { useWebRTC } from "../hooks/useWebRTC";
import { useMediaAccess } from "../hooks/useMediaAccess";
import { useParams, useSearchParams, useNavigate } from "react-router";
import {
  Center,
  Stack,
  Group,
  Text,
  ActionIcon,
  Loader,
  Button,
  Paper,
  Box,
} from "@mantine/core";
import { User, Mic, MicOff, PhoneOff } from "lucide-react";

function UserTile({ name, muted = false }: { name: string; muted?: boolean }) {
  return (
    <Stack align="center" gap="sm">
      <Box style={{ position: "relative", display: "inline-flex" }}>
        <Paper
          radius="50%"
          style={{
            width: 96,
            height: 96,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--mantine-color-dark-5)",
          }}
        >
          <User size={44} strokeWidth={1.5} />
        </Paper>
        {muted && (
          <Box
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              background: "var(--mantine-color-red-6)",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MicOff size={13} />
          </Box>
        )}
      </Box>
      <Text size="sm" fw={500}>
        {name}
      </Text>
    </Stack>
  );
}

export function CallRoom() {
  const { localStream, openMediaDevices, isMuted, toggleMute } = useMediaAccess();
  const { callId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const localName = searchParams.get("name") ?? "You";

  const { startCall, endCall, connectionState, remoteStream, remoteMuted, updateMuteState } = useWebRTC(
    callId ?? null,
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

  const handleEndCall = () => {
    endCall();
    navigate("/");
  };

  const isConnecting = connectionState === "new" || connectionState === "connecting";
  const isConnected = connectionState === "connected";
  const isDisconnected =
    connectionState === "disconnected" ||
    connectionState === "failed" ||
    connectionState === "closed";

  return (
    <Box
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#141821",
      }}
    >
      {/* Main area */}
      <Box style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isConnecting && (
          <Stack align="center" gap="md">
            <Loader size="lg" color="green" />
            <Text c="dimmed">Waiting for someone to join...</Text>
            {callId && (
              <Button
                variant="subtle"
                size="sm"
                onClick={() => navigator.clipboard.writeText(callId)}
              >
                📋 Copy Room ID: {callId}
              </Button>
            )}
          </Stack>
        )}

        {isConnected && (
          <Group gap={48} justify="center" align="center" wrap="wrap">
            <UserTile name={localName} muted={isMuted} />
            <UserTile name="Guest" muted={remoteMuted} />
          </Group>
        )}

        {isDisconnected && (
          <Stack align="center" gap="md">
            <Text size="lg" fw={500}>Call ended</Text>
            <Button variant="subtle" onClick={() => navigate("/")}>
              Back to home
            </Button>
          </Stack>
        )}
      </Box>

      {/* Controls */}
      <Center pb="xl">
        <Group gap="xl">
          <Stack align="center" gap={4}>
            <ActionIcon
              size="xl"
              radius="50%"
              variant={isMuted ? "filled" : "default"}
              color={isMuted ? "red" : undefined}
              disabled={!isConnected}
              onClick={() => { toggleMute(); updateMuteState(!isMuted); }}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </ActionIcon>
            <Text size="xs" c="dimmed">
              {isMuted ? "Unmute" : "Mute"}
            </Text>
          </Stack>

          <Stack align="center" gap={4}>
            <ActionIcon
              size="xl"
              radius="50%"
              color="red"
              variant="filled"
              disabled={!isConnected}
              onClick={handleEndCall}
              aria-label="End call"
            >
              <PhoneOff size={20} />
            </ActionIcon>
            <Text size="xs" c="dimmed">End Call</Text>
          </Stack>
        </Group>
      </Center>

      <audio ref={audioRef} autoPlay playsInline style={{ display: "none" }} />
    </Box>
  );
}
