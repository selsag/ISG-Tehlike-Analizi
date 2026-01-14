
import React from 'react';

export interface FormData {
  birim: string;
  tarih: string;
  tehlikeSinifi: 'Az Tehlikeli' | 'Tehlikeli' | 'Çok Tehlikeli';
  genelDegerlendirme: string;
}

export interface RiskTeamMember {
  id: number;
  rol: string;
  adSoyad: string;
  placeholder: string;
}

export interface OnerilecekOnlemler {
  eliminasyon: string;
  ikame: string;
  muhendislik: string;
  idari: string;
  kkd: string;
}

export interface Risk {
  id: number;
  alan: string;
  faaliyet: string;
  tehlike: string;
  tehlikeAciklama: string;
  etkilenenKisi: string;
  etkilenenSayi: string;
  olasilik: number;
  siddet: number;
  siklik: number;
  riskSkoru: number;
  riskSeviye: string;
  mevcutOnlemler: string;
  onerilecekOnlemler: OnerilecekOnlemler;
  sorumlu: string;
  tamamlanmaTarihi: string;
  isCollapsed: boolean;
}

export interface FileRecord {
  id: number;
  riskId: number;
  fileData: File;
  fileName: string;
  fileType: string;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

export type SpeechTarget = { id: number, field: string } | { field: keyof FormData } | { id: number, adSoyad: string } | null;

// --- WEB SPEECH API TYPES ---
export interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}
export interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}
export interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
    length: number;
}
export interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}
export interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}
export interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}
export interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
}
