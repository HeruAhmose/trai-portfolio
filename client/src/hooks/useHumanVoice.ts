import { useCallback, useRef, useState } from 'react';

interface VoiceOptions {
  rate?: number; // 0.5 to 2
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: number; // Voice index
  gender?: 'male' | 'female'; // Voice gender preference
}

export const useHumanVoice = () => {
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isPlayingRef = useRef(false);
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');

  // Get available voices - prioritize Black American voices
  const getVoices = useCallback((gender?: 'male' | 'female'): SpeechSynthesisVoice[] => {
    const allVoices = window.speechSynthesis.getVoices();
    const targetGender = gender || voiceGender;

    // Priority list for Black American voices
    const blackAmericanVoices = allVoices.filter((voice) => {
      const name = voice.name.toLowerCase();
      const lang = voice.lang.toLowerCase();

      // Look for voices that are American English
      if (!lang.includes('en-us') && !lang.includes('en_us') && !lang.includes('en-') && lang !== 'en') {
        return false;
      }

      // Prioritize known Black American voice options
      const blackVoiceIndicators = [
        'ebony', // Google Ebony
        'ava', // Microsoft Ava
        'zira', // Microsoft Zira
        'moira', // Apple Moira
        'karen', // Some systems
        'samantha', // Natural sounding
        'victoria', // Natural sounding
        'google us english', // Google voices
        'microsoft david', // Microsoft voices
      ];

      return blackVoiceIndicators.some((indicator) => name.includes(indicator));
    });

    // If we have Black American voices, filter by gender preference
    if (blackAmericanVoices.length > 0) {
      const genderFiltered = blackAmericanVoices.filter((voice) => {
        const name = voice.name.toLowerCase();
        if (targetGender === 'male') {
          return (
            name.includes('david') ||
            name.includes('james') ||
            name.includes('marcus') ||
            name.includes('michael') ||
            !name.includes('ava') &&
            !name.includes('zira') &&
            !name.includes('moira') &&
            !name.includes('karen') &&
            !name.includes('samantha') &&
            !name.includes('victoria')
          );
        } else {
          return (
            name.includes('ava') ||
            name.includes('zira') ||
            name.includes('moira') ||
            name.includes('karen') ||
            name.includes('samantha') ||
            name.includes('victoria') ||
            name.includes('ebony')
          );
        }
      });

      if (genderFiltered.length > 0) {
        return genderFiltered;
      }
      return blackAmericanVoices;
    }

    // Fallback to natural-sounding voices if Black American not available
    const naturalVoices = allVoices.filter((voice) => {
      const name = voice.name.toLowerCase();
      return (
        name.includes('google') ||
        name.includes('samantha') ||
        name.includes('victoria') ||
        name.includes('ava') ||
        name.includes('zira')
      );
    });

    if (naturalVoices.length > 0) {
      const genderFiltered = naturalVoices.filter((voice) => {
        const name = voice.name.toLowerCase();
        if (targetGender === 'male') {
          return name.includes('david') || name.includes('james') || name.includes('marcus');
        } else {
          return (
            name.includes('ava') ||
            name.includes('zira') ||
            name.includes('samantha') ||
            name.includes('victoria')
          );
        }
      });

      return genderFiltered.length > 0 ? genderFiltered : naturalVoices;
    }

    return allVoices;
  }, [voiceGender]);

  // Speak with human-sounding parameters
  const speak = useCallback(
    (text: string, options: VoiceOptions = {}) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set natural-sounding parameters
      utterance.rate = options.rate ?? 0.9; // Slightly slower for clarity
      utterance.pitch = options.pitch ?? 1.0; // Natural pitch
      utterance.volume = options.volume ?? 0.8; // Good volume level

      // Select voice with gender preference
      const voices = getVoices(options.gender);
      if (voices.length > 0) {
        const voiceIndex = options.voice ?? 0;
        utterance.voice = voices[Math.min(voiceIndex, voices.length - 1)];
      }

      // Add natural pauses and emphasis
      utterance.onstart = () => {
        isPlayingRef.current = true;
      };

      utterance.onend = () => {
        isPlayingRef.current = false;
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        isPlayingRef.current = false;
      };

      synthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [getVoices]
  );

  // Speak with emphasis (for important sections)
  const speakEmphatic = useCallback(
    (text: string, gender?: 'male' | 'female') => {
      speak(text, {
        rate: 0.85, // Slower for emphasis
        pitch: 1.1, // Slightly higher pitch
        volume: 0.9,
        gender,
      });
    },
    [speak]
  );

  // Speak with natural conversational tone
  const speakConversational = useCallback(
    (text: string, gender?: 'male' | 'female') => {
      speak(text, {
        rate: 0.95, // Natural speed
        pitch: 1.0,
        volume: 0.8,
        gender,
      });
    },
    [speak]
  );

  // Speak with divine/mystical tone (alternating gender)
  const speakDivine = useCallback(
    (text: string, forceGender?: 'male' | 'female') => {
      const targetGender = forceGender || (voiceGender === 'female' ? 'male' : 'female');

      speak(text, {
        rate: 0.8, // Slower, more deliberate
        pitch: targetGender === 'female' ? 1.15 : 0.95, // Slightly higher for female, lower for male
        volume: 0.85,
        gender: targetGender,
      });

      // Toggle gender for next divine speech
      setVoiceGender(targetGender === 'female' ? 'male' : 'female');
    },
    [speak, voiceGender]
  );

  // Stop speaking
  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    isPlayingRef.current = false;
  }, []);

  // Check if currently speaking
  const isPlaying = useCallback(() => isPlayingRef.current, []);

  // Toggle voice gender preference
  const toggleGender = useCallback(() => {
    setVoiceGender((prev) => (prev === 'male' ? 'female' : 'male'));
  }, []);

  // Set voice gender preference
  const setGender = useCallback((gender: 'male' | 'female') => {
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
