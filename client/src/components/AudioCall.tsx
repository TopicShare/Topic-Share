import { useWebRTC } from "../hooks/useWebRTC"

export function AudioCall() {
  const {localStream, openMediaDevices, error} = useWebRTC();
  return (
    <div className="flex items-center gap-2">
      <div className="">
      </div>
      Topic Share
      <button onClick={openMediaDevices}>
        Start Audio Chat
      </button>
    </div>
  )
}
