import { useState, useRef, useCallback } from "react";

/**
 * Configuration interface for the peer connection hook
 * These callbacks allow the parent component to respond to WebRTC events
 */
interface PeerConnectionConfig {
  onRemoteStream: (stream: MediaStream) => void;
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onConnectionStateChange: (state: RTCPeerConnection) => void;
}

/**
 * Return type of the usePeerConnection hook
 * Provides methods and state for managing the WebRTC connection
 */
interface UsePeerConnectionReturn {
  peerConnection: RTCPeerConnection | null;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescription>;
  setRemoteDescription: (description: RTCSessionDescriptionInit) => Promise<void>;
}

/**
 * Custom React hook for managing WebRTC peer connections
 * Encapsulates the complexity of WebRTC connection lifecycle and provides
 * a clean API for establishing peer-to-peer connections
 * 
 * @param config - Configuration object with event handlers
 * @returns Object with methods to control the peer connection
 */
export function usePeerConnection(config: PeerConnectionConfig): UsePeerConnectionReturn {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // STUN servers configuration for NAT traversal
  // These Google STUN servers help discover the public IP address
  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
  }

  /**
   * Creates the connection only when needed and reuses existing instance
   * Lazy initialization of the RTCPeerConnection
   * This pattern prevents multiple connections from being created accidentally
   */
  const initializePeerConnections = useCallback(() => {
    if (pcRef.current) {
      return pcRef.current
    }
    
    const pc = new RTCPeerConnection(iceServers)
    pcRef.current = pc;

    // Handle remote stream
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        config.onRemoteStream(event.streams[0])
      }
    };

    // TODO: Handle ICE candidates
  
    // TODO: Handle connection state
  });

  // TODO:
  /**
   * Creates an offer to initiate the connection (caller side)
   * The offer contains information about media capabilities and network information
   */

  // TODO: 
  /**
   * Creates an answer in response to an offer (callee side)
   * The answer accepts or rejects the media capabilities proposed in the offer
   */

  // TODO: 
  /**
   * Sets the remote peer's session description
   * Used by the caller to set the answer received from the callee
   */

  /**
   * Adds an ICE candidate received from the remote peer
   * ICE candidates are added after the remote description is set
   * This check prevents errors from adding candidates too early
   */

  /**
   * Closes the connection and cleans up resources
   * Important for preventing memory leaks and releasing media devices
   */

}
