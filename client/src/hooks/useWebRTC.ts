import { useState, useRef, useEffect } from 'react';
import { db } from '@/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router';
import { httpsCallable } from "firebase/functions"
import { functions } from "@/firebase"

interface ICECanddiateData {
  candidate: string;
  sdpMLineIndex: number | null;
  sdpMid: string | null;
}

export function useWebRTC(callId: string | null, localStream: MediaStream | undefined) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | 'new'>('new');
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remoteMuted, setRemoteMuted] = useState(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const isCallerRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  const startCall = async () => {
    if (!callId || !localStream) return;
    if (pcRef.current) return; // guard against double-invocation (React StrictMode)
 
  const getTurnCredentials = httpsCallable<void, { iceServers: RTCIceServer[]}>(
      functions, "getTurnCredentials"
    );
    const { data } = await getTurnCredentials();
    const pc = new RTCPeerConnection({
      iceServers: data.iceServers,
      iceCandidatePoolSize: 10
    });

    pcRef.current = pc;

    localStream.getTracks().forEach((track) =>{
      pc.addTrack(track, localStream)
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log('Remote stream received:', event.streams[0]);
      setRemoteStream(event.streams[0]);
    };
    
    // Handle connection state
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      setConnectionState(pc.connectionState);
      setIsConnected(pc.connectionState === 'connected');
    };
    
    // Add ICE connection debugging
    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', pc.iceConnectionState);
    };
    
    pc.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', pc.iceGatheringState);
    };
    
    // Handle ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        const field = isCallerRef.current ? 'callerCandidates' : 'calleeCandidates';
        const candidateData = {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid
        };
        await updateDoc(doc(db, 'calls', callId), {
          [field]: arrayUnion(candidateData)
        });
      }
    };
    
    // Check if we're caller or callee
    const callDoc = doc(db, 'calls', callId);
    const docSnap = await getDoc(callDoc);
    const callData = docSnap.data();
    
    if (!callData?.offer) {
      // We're the caller
      isCallerRef.current = true;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await updateDoc(callDoc, { offer });
    } else {
      // We're the callee
      isCallerRef.current = false;
      await pc.setRemoteDescription(callData.offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await updateDoc(callDoc, { answer });
    }
    
    // Listen for updates
    const unsubscribe = onSnapshot(callDoc, async (snapshot) => {
      const data = snapshot.data();
      if (!data) return;

      // Handle answer (caller only)
      if (isCallerRef.current && data.answer && !pc.remoteDescription) {
        await pc.setRemoteDescription(data.answer);
      }
      
      // Handle remote mute state
      const remoteMutedField = isCallerRef.current ? 'calleeMuted' : 'callerMuted';
      if (data[remoteMutedField] !== undefined) {
        setRemoteMuted(data[remoteMutedField]);
      }

      // Handle ICE candidates
      const remoteCandidatesField = isCallerRef.current ? 'calleeCandidates' : 'callerCandidates';
      const candidates = data[remoteCandidatesField] || [];
      
      candidates.forEach(async (candidateData: any) => {
        if (pc.remoteDescription) {
          try {
            await pc.addIceCandidate(candidateData);
          } catch (e) {
            // Ignore duplicate candidates
          }
        }
      });
    });

    unsubscribeRef.current = unsubscribe;
  };
  
  const endCall = () => {
    pcRef.current?.close();
    pcRef.current = null;
    unsubscribeRef.current?.();
    unsubscribeRef.current = null;
    setIsConnected(false);
    setConnectionState('new');
    setRemoteStream(null);
  };
  
  // Cleanup
  useEffect(() => {
    return () => endCall();
  }, [callId]);
  
  const updateMuteState = async (muted: boolean) => {
    if (!callId) return;
    const field = isCallerRef.current ? 'callerMuted' : 'calleeMuted';
    await updateDoc(doc(db, 'calls', callId), { [field]: muted });
  };

  return { startCall, endCall, isConnected, connectionState, remoteStream, remoteMuted, updateMuteState };
}
