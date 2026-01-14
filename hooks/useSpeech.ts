
import { useState, useRef, useEffect, useCallback } from 'react';
import { SpeechTarget, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';
import { toTitleCase, toSentenceCase } from '../utils/helpers';

export const useSpeech = (
    onTranscript: (target: SpeechTarget, transcript: string) => void,
    onError?: (error: string) => void
) => {
    const [speechTarget, setSpeechTarget] = useState<SpeechTarget>(null);
    
    // Refs to keep track of state inside callbacks without triggering re-renders
    const isListening = useRef(false);
    const recognitionRef = useRef<any | null>(null);
    const speechTargetRef = useRef<SpeechTarget>(null);
    const onTranscriptRef = useRef(onTranscript);
    const onErrorRef = useRef(onError);
    
    // Track processed result indices to prevent duplicates from engine
    const lastResultIndexRef = useRef<number>(-1);
    
    // Track if any input was received in the CURRENT session
    // Used to stop the mic if the user says nothing (avoids infinite silence loops)
    const didReceiveInputRef = useRef(false);

    // Update refs when props/state change
    useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
    useEffect(() => { onErrorRef.current = onError; }, [onError]);
    useEffect(() => { speechTargetRef.current = speechTarget; }, [speechTarget]);

    // Initialize SpeechRecognition once
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error("Browser does not support SpeechRecognition");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'tr-TR';
        // Default configs, will be overridden in toggleSpeech
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            if (!isListening.current) return;
            
            // Mark that we heard something in this session
            didReceiveInputRef.current = true;

            // Loop through results starting from the index the browser says changed
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                // SAFETY: Skip indices we already processed to prevent duplicates
                if (i <= lastResultIndexRef.current) continue;

                if (event.results[i].isFinal) {
                    const transcript = event.results[i][0].transcript.trim();
                    if (!transcript) continue;

                    // Mark this index as processed
                    lastResultIndexRef.current = i;

                    const target = speechTargetRef.current;
                    if (!target) continue;

                    let formattedTranscript = transcript;
                    let isTitleCase = false;

                    if ('adSoyad' in target) {
                         isTitleCase = true;
                    } else if ('field' in target) {
                         if (['birim', 'alan', 'sorumlu'].includes(target.field as string)) {
                             isTitleCase = true;
                         }
                    }

                    formattedTranscript = isTitleCase ? toTitleCase(transcript) : toSentenceCase(transcript);

                    if (onTranscriptRef.current) {
                        onTranscriptRef.current(target, formattedTranscript);
                    }
                }
            }
        };

        recognition.onend = () => {
            // Logic for Auto-Stop vs Keep-Alive
            if (isListening.current) {
                // If we are in CONTINUOUS mode (Long fields)
                if (recognition.continuous) {
                    // Only restart if we actually heard something in the previous session.
                    // If the session timed out with NO input (didReceiveInputRef.current === false),
                    // it means the user is silent or done. So we STOP.
                    if (didReceiveInputRef.current) {
                        console.log("Mic stopped (Keep-Alive triggered)...");
                        lastResultIndexRef.current = -1;
                        didReceiveInputRef.current = false; // Reset for next session
                        try {
                            recognition.start();
                        } catch (e) {
                            // Ignore errors if already started
                        }
                    } else {
                        // User said nothing in this session -> Auto Stop
                        console.log("Mic stopped due to silence (Auto-Stop).");
                        isListening.current = false;
                        setSpeechTarget(null);
                    }
                } else {
                    // If we are in SHORT mode (continuous = false)
                    // The engine stops automatically after one sentence. We just clean up state.
                    isListening.current = false;
                    setSpeechTarget(null);
                }
            } else {
                setSpeechTarget(null);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.warn("Speech recognition error", event.error);
            if (event.error === 'not-allowed') {
                isListening.current = false;
                setSpeechTarget(null);
                if (onErrorRef.current) onErrorRef.current('Mikrofon Erişimi Engellendi.');
            }
            // If 'no-speech' error occurs, onend will fire next, handling the stop logic.
        };

        recognitionRef.current = recognition;

        return () => {
            isListening.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
        };
    }, []);

    const toggleSpeech = useCallback((target: NonNullable<SpeechTarget>) => {
        if (!recognitionRef.current) {
            if (onErrorRef.current) onErrorRef.current("Tarayıcınız ses tanımayı desteklemiyor.");
            return;
        }

        if (isListening.current) {
            // STOP
            isListening.current = false;
            setSpeechTarget(null);
            recognitionRef.current.stop();
        } else {
            // START
            setSpeechTarget(target);
            isListening.current = true;
            
            // --- DYNAMIC MODE SELECTION ---
            // Determine if this is a "Short" field (Single shot) or "Long" field (Continuous)
            let isShortField = false;
            
            if ('adSoyad' in target) {
                // Risk Team Members are always short names
                isShortField = true;
            } else if ('field' in target) {
                const shortFields = [
                    'birim', 'alan', 'faaliyet', 'sorumlu', 
                    'etkilenenKisi', 'etkilenenSayi', 
                    'tarih', 'tamamlanmaTarihi', 'tehlikeSinifi'
                ];
                if (shortFields.includes(target.field as string)) {
                    isShortField = true;
                }
            }

            // Apply configuration to the instance
            // continuous = true -> Keep listening until manual stop (or silence timeout if no input)
            // continuous = false -> Stop after first sentence
            recognitionRef.current.continuous = !isShortField;
            
            // Reset trackers
            lastResultIndexRef.current = -1;
            didReceiveInputRef.current = false;

            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Mic start error", e);
                isListening.current = false;
                setSpeechTarget(null);
            }
        }
    }, []);

    return { speechTarget, toggleSpeech };
};
