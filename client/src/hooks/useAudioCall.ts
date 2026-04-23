import { useForm } from "@mantine/form";
import { useCallRoom } from "../hooks/useCallRoom"

export function useAudioCall() {
  const  { callId, createCallRoom, joinCallRoom, endCall } = useCallRoom();

  const handleCreateRoom = async () => {
    await createCallRoom()
  }

  const form = useForm({
    initialValues: { roomId: ""},
    validate: {
      roomId: (value) => value.length !== 6 ? "Room ID must be 6 characters long": null
    }
  });


  return (form)
  // return form, onCreateRoom, onJoinRoom, isJoining
}
