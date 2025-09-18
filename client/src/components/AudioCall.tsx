import { useFirebaseTest } from "../hooks/useFirebaseTest";
import { useMediaAccess, usePeerConnection } from "../hooks/useMediaAccess";
import { useCallRoom } from "../hooks/useCallRoom";
import { Header } from "../components/Header";

export function AudioCall() {
  const {localStream, openMediaDevices, error} = useMediaAccess();
  const {testFirestore, testResult} = useFirebaseTest();
  const {callId, createCallRoom, joinCallRoom} = useCallRoom();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center">
        <Header />
      </div>

      <div className="flex justify-center border-2 border-gray-800 rounded-lg bg-gray-700 h-100">
        <div className="flex-col gap-y-4 justify-center gap-2">
          <button onClick={openMediaDevices}>
            Start Audio Chat
          </button>
          <button onClick={testFirestore}>Test Firebase</button>
          <p>{testResult}</p>
          <div className="">
            <button onClick={createCallRoom}>Create call room</button>
            {callId && <p>Call ID: {callId}</p>}
          </div>
        </div>
      </div>

    </div>
  )
}
