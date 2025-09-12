import { useState } from "react";
import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, onSnapshot } from "firebase/firestore";

// Data model
interface TestDocument {
  message: string;
  timestamp: Date;
}

interface UseFirebaseTestReturn {
  testFirestore: () => Promise<void>;
  testResult: string;
}

export function useFirebaseTest(): UseFirebaseTestReturn {
  const [testResult, setTestResult] = useState<string>("");
    const testFirestore = async () => {
    try {
      // Write test data
      const testDoc = doc(db, "test", "hello");
      const testData: TestDocument = {
        message: "Hello Firebase!",
        timestamp: new Date()
      }
      await setDoc(testDoc, testData);

      // Read testData
      const readDoc = await getDoc(testDoc);
      if (readDoc.exists()) {
        const data = readDoc.data().message;
        setTestResult(`Success: ${data}`);
        console.log("Firebase test successful");
      }
    } catch (error) {
      setTestResult(`Failed: ${error.message}`);
      console.log("Firebase test failed");
    }
  }
  return { testFirestore, testResult };
}
