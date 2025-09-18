import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";


/*
 * Custom hook to create a call room with a random callId.
 * Also includes a method to join and leave call room.
 */
export function useCallRoom() {
  const [callId, setCallId] = useState<string| null>(null);

  // Generate random 6 char callId
  const generateCallId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createCallRoom = async () => {
    try {
      const newCallId = generateCallId();
      // Create call document in Firestore
      const callDoc = doc(db, "calls", newCallId);
      await setDoc(callDoc, {
        status: "waiting",
        createdAt: new Date(),
        createdBy: "user1", // Temp identifyer
        offer: null,
        answer: null,
        callerCandidates: [],
        calleeCandidates: []
      });
      setCallId(newCallId);
      console.log("Call room created: ", newCallId);
    } catch (error) {
      console.log("Failed to create call room: ", error);
      return null;
    }
  };

  const joinCallRoom = async (roomId: string) => {
    try {
      const callDoc = doc(db, "calls", roomId);
      const docSnap = await getDoc(callDoc);

      if (!docSnap.exists()) {
        return false;
      }
      setCallId(roomId);
      console.log("Joined call room: ", roomId);

      return true;

    } catch (error) {
      console.log("Failed to join call room: ", error);
      return false;
    }
  };

  const leaveCallRoom = (): void => {
    setCallId(null);
    // Maybe set error here?
  };

  return { callId, createCallRoom, joinCallRoom, leaveCallRoom };
};

