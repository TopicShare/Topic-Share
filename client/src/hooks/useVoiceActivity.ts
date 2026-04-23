import { useEffect, useRef, useState } from "react";

const THRESHOLD = 10; // RMS threshold (0–255 scale)
const SMOOTHING = 0.3;

export function useVoiceActivity(stream: MediaStream | null | undefined): boolean {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const rafRef = useRef<number | null>(null);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!stream) {
      setIsSpeaking(false);
      return;
    }

    const audioContext = new AudioContext();
    contextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = SMOOTHING;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      // Compute RMS
      let sumSq = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sumSq += v * v;
      }
      const rms = Math.sqrt(sumSq / data.length) * 255;
      setIsSpeaking(rms > THRESHOLD);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioContext.close();
    };
  }, [stream]);

  return isSpeaking;
}
