import { useState, useEffect, useRef } from "react";
import { useMediaAccess } from "../hooks/useMediaAccess";
import { useCallRoom } from "../hooks/useCallRoom";
import { useWebRTC } from "../hooks/useWebRTC";
import { Center, Card, Stack, Title, Divider, Button, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router";

export function AudioCall() {
  //const { localStream, openMediaDevices } = useMediaAccess();
  const { callId, createCallRoom, joinCallRoom } = useCallRoom();
  //const { startCall, endCall, isConnected, remoteStream } = useWebRTC(callId, localStream);
  const navigate = useNavigate();
  const [ checking, setChecking ] = useState(false);

  const handleCreateRoom = async () => {
    await createCallRoom();
  };

  const form = useForm({
    initialValues: { roomId: "" },
    validate: {
      roomId: (value) => value.length !== 6 ? "Room ID must be 6 characters": null
    }
  });

  // TODO: Add name input for user's display name as a form
  // Pass name as a query param when nagivating to /callRoom/:callId (e.g. ?name=John)
  // Store name in local state

  // TODO: When room is created, do not automatically redirect to call room

  // Navigate when callId is set (after room creation)
  useEffect(() => {
    if (callId) {
      navigate(`/callRoom/${callId}`);
    }
  }, [callId, navigate]);

  const handleJoinRoom = async (values: { roomId: string}) => {
    setChecking(true);
    const success = await joinCallRoom(values.roomId);
    setChecking(false);
    if (success) {
      navigate(`/callRoom/${values.roomId}`);
    } else {
      form.setFieldError("roomId", "Room not found");
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
  <Center className="min-h-screen" style={{ background: "#1e2535" }}>
    <Card shadow="sm" padding="xl" radius="lg" w={{ base: "90%", sm: 380 }}
      style={{
        background: "#1e2535", border: "none",
        boxShadow: "6px 6px 16px rgba(0,0,0,0.5), -4px -4px 12px rgba(255,255,255,0.06)"
      }}
      >
      <form onSubmit={form.onSubmit(handleJoinRoom)}>
        <Stack gap="md">

          {/* Header */}
          <Title order={2} ta="center">Topic Share</Title>
          <Text c="dimmed" size="sm" ta="center">
            Talk anonymously with someone who gets it.
          </Text>

          {/* Create Room */}
          <Button
            onClick={handleCreateRoom}
            variant="filled"
            size="sm"
            radius="lg"
            fullWidth
          >
            Create New Room
          </Button>

          <Divider label="or" labelPosition="center" />

          {/* Join Room */}
          <TextInput
            placeholder="Enter Room ID"
            maxLength={6}
            {...form.getInputProps("roomId")}
            onChange={(e) => form.setFieldValue("roomId", e.target.value.toUpperCase())}
          />
          <Button
            type="submit"
            size="sm"
            radius="lg"
            fullWidth
          >
            Join Room
          </Button>

        </Stack>
      </form>
    </Card>
  </Center>
);
}
