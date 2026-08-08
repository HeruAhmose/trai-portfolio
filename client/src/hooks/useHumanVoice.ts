import { useCallback, useState } from "react";

interface VoiceOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: number;
  gender?: "male" | "female";
}

interface SilentVoice {
  name: string;
  lang: string;
}

const EMPTY_VOICES: SilentVoice[] = [];

/**
 * Compatibility hook for legacy TRAI voice consumers.
 *
 * Browser narration is intentionally disabled. The public API remains stable
 * so visual components do not need to be dismantled while the organism stays
 * silent unless verified, owner-approved audio is added separately.
 */
export const useHumanVoice = () => {
  const [voiceGender, setVoiceGender] = useState<"male" | "female">("female");

  const speak = useCallback(
    (_text: string, _options: VoiceOptions = {}) => undefined,
    []
  );

  const speakEmphatic = useCallback(
    (_text: string, _gender?: "male" | "female") => undefined,
    []
  );

  const speakConversational = useCallback(
    (_text: string, _gender?: "male" | "female") => undefined,
    []
  );

  const speakDivine = useCallback(
    (_text: string, _gender?: "male" | "female") => undefined,
    []
  );

  const stop = useCallback(() => undefined, []);
  const isPlaying = useCallback(() => false, []);
  const getVoices = useCallback(
    (_gender?: "male" | "female") => EMPTY_VOICES,
    []
  );

  const toggleGender = useCallback(() => {
    setVoiceGender((current) =>
      current === "male" ? "female" : "male"
    );
  }, []);

  const setGender = useCallback((gender: "male" | "female") => {
    setVoiceGender(gender);
  }, []);

  return {
    speak,
    speakEmphatic,
    speakConversational,
    speakDivine,
    stop,
    isPlaying,
    getVoices,
    voiceGender,
    toggleGender,
    setGender,
  };
};

export default useHumanVoice;
