
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Risk, RiskTeamMember, FormData as FormData_Type, OnerilecekOnlemler, SpeechTarget } from '../types';
import * as DB from '../services/db';
import { olasilikMap, siddetMap, siklikMap, DEFAULT_ALAN_SUGGESTIONS } from '../constants';
import { getRiskSeviye } from '../utils/helpers';

const DEFAULT_RISK_TEMPLATE: Omit<Risk, 'id'> = {
    alan: '', faaliyet: '', tehlike: '', tehlikeAciklama: '',
    etkilenenKisi: '', etkilenenSayi: '',
    olasilik: olasilikMap[3].v, siddet: siddetMap[1].v, siklik: siklikMap[2].v,
    riskSkoru: 0, riskSeviye: 'Önemsiz Risk',
    mevcutOnlemler: '',
    onerilecekOnlemler: { eliminasyon: '', ikame: '', muhendislik: '', idari: '', kkd: '' },
    sorumlu: '', tamamlanmaTarihi: new Date().toISOString().split('T')[0], isCollapsed: true,
};

export const useRiskData = (showAlert: (title: string, message: React.ReactNode) => void, showConfirmation: any) => {
    const [formData, setFormData] = useState<FormData_Type>({
        birim: 'İlahiyat Fakültesi',
        tarih: new Date().toISOString().split('T')[0],
        tehlikeSinifi: 'Az Tehlikeli',
        genelDegerlendirme: ''
    });
    const [riskEkibi, setRiskEkibi] = useState<RiskTeamMember[]>([
        { id: 1, rol: 'İşveren / İşveren Vekili (Onaylayan)', adSoyad: '', placeholder: 'Örn: Dekan / Genel Sekreter' },
        { id: 2, rol: 'İş Güvenliği Uzmanı', adSoyad: '', placeholder: 'İSG Katip\'ten atanan uzman' },
        { id: 3, rol: 'İşyeri Hekimi', adSoyad: '', placeholder: 'İSG Katip\'ten atanan hekim' },
        { id: 4, rol: 'Çalışan Temsilcisi', adSoyad: '', placeholder: 'Seçimle belirlenen temsilci' },
        { id: 5, rol: 'Destek Elemanı', adSoyad: '', placeholder: 'Örn: Yangın, İlk Yardım Ekibi' },
        { id: 6, rol: 'Birim Sorumlusu (Bilgi Sahibi Çalışan)', adSoyad: '', placeholder: 'Değerlendirilen bölümün amiri/çalışanı' }
    ]);
    const [riskler, setRiskler] = useState<Risk[]>([
        {
            ...DEFAULT_RISK_TEMPLATE,
            id: 1, 
            alan: 'Derslik - D201', faaliyet: 'Ders işleme, sınav yapma',
            tehlike: 'Kayma, Takılma, Düşme, Düzensizlik (Zemin, Merdiven, Koridor)', tehlikeAciklama: 'Yerde bulunan ve sabitlenmemiş projektör/uzatma kabloları',
            etkilenenKisi: 'Öğrenci', etkilenenSayi: '50',
            olasilik: 3, siddet: 3, siklik: 6,
            riskSkoru: 54, riskSeviye: 'Düşük Risk',
            mevcutOnlemler: 'Yok',
            onerilecekOnlemler: {
                eliminasyon: '', ikame: '',
                muhendislik: 'Zemindeki kabloların, kablo kanalı veya kablo rampası ile gizlenmesi/sabitlenmesi.',
                idari: 'Dersliklerin her ders öncesi düzen kontrolünün yapılması için görevlendirme yapılması.',
                kkd: ''
            },
            sorumlu: 'İdari ve Mali İşler Daire Bşk. / Fakülte Sekreterliği',
            isCollapsed: false,
        }
    ]);
    const [isEkipCollapsed, setIsEkipCollapsed] = useState(true);
    const [alanSuggestions, setAlanSuggestions] = useState<string[]>(DEFAULT_ALAN_SUGGESTIONS);

    // Defensive loading with defaults for old data compatibility
    useEffect(() => {
        try {
            const savedFormData = localStorage.getItem('riskFormData');
            const savedEkibiData = localStorage.getItem('riskEkibiData');
            const savedRisklerData = localStorage.getItem('risklerData');
            const savedEkipCollapsed = localStorage.getItem('isEkipCollapsed');

            if (savedFormData) {
                const parsed = JSON.parse(savedFormData);
                setFormData(prev => ({ ...prev, ...parsed }));
            }
            if (savedEkibiData) {
                setRiskEkibi(JSON.parse(savedEkibiData));
            }
            if (savedRisklerData) {
                const parsedRisks = JSON.parse(savedRisklerData);
                const safeRisks = Array.isArray(parsedRisks) ? parsedRisks.map((r: any) => ({
                    ...DEFAULT_RISK_TEMPLATE, 
                    ...r, 
                    // Ensure nested objects exist for old data
                    onerilecekOnlemler: {
                        ...DEFAULT_RISK_TEMPLATE.onerilecekOnlemler,
                        ...(r.onerilecekOnlemler || {})
                    },
                    // Ensure new fields exist
                    faaliyet: r.faaliyet || DEFAULT_RISK_TEMPLATE.faaliyet,
                    isCollapsed: r.isCollapsed ?? true
                })) : [];
                setRiskler(safeRisks);
            }
            if (savedEkipCollapsed) setIsEkipCollapsed(JSON.parse(savedEkipCollapsed));

            DB.openDB().catch(err => console.error("DB Init Error", err));
        } catch (error) { console.error("LocalStorage Error", error); }
    }, []);

    useEffect(() => {
        localStorage.setItem('riskFormData', JSON.stringify(formData));
        localStorage.setItem('riskEkibiData', JSON.stringify(riskEkibi));
        localStorage.setItem('risklerData', JSON.stringify(riskler));
        localStorage.setItem('isEkipCollapsed', JSON.stringify(isEkipCollapsed));
    }, [formData, riskEkibi, riskler, isEkipCollapsed]);

    const updateFormData = useCallback((field: keyof FormData_Type, value: any) => {
        setFormData(prev => {
            const newValue = typeof value === 'function' ? value(prev[field]) : value;
            return { ...prev, [field]: newValue };
        });
    }, []);

    const updateEkip = useCallback((id: number, adSoyad: any) => {
        setRiskEkibi(prev => prev.map(uye => {
            if (uye.id !== id) return uye;
            const newValue = typeof adSoyad === 'function' ? adSoyad(uye.adSoyad) : adSoyad;
            return { ...uye, adSoyad: newValue };
        }));
    }, []);

    const updateRisk = useCallback((id: number, field: string, value: any) => {
        setRiskler(prev => prev.map(risk => {
            if (risk.id !== id) return risk;
            let updated = { ...risk };

            let currentVal: any;
            if (['eliminasyon', 'ikame', 'muhendislik', 'idari', 'kkd'].includes(field)) {
                currentVal = updated.onerilecekOnlemler[field as keyof OnerilecekOnlemler];
            } else {
                currentVal = (updated as any)[field];
            }
            
            const newValue = typeof value === 'function' ? value(currentVal) : value;

            if (['eliminasyon', 'ikame', 'muhendislik', 'idari', 'kkd'].includes(field)) {
                updated.onerilecekOnlemler = { ...updated.onerilecekOnlemler, [field]: newValue };
            } else {
                (updated as any)[field] = newValue;
            }
            
            if (['olasilik', 'siddet', 'siklik'].includes(field)) {
                const s = { ...updated };
                const skor = Number(s.olasilik) * Number(s.siddet) * Number(s.siklik);
                updated.riskSkoru = skor;
                updated.riskSeviye = getRiskSeviye(skor);
            }
            return updated;
        }));
    }, []);

    const updateRiskScores = useCallback((id: number, scores: { olasilik: number, siddet: number, siklik: number }) => {
        setRiskler(prev => prev.map(r => {
            if (r.id !== id) return r;
            const skor = scores.olasilik * scores.siddet * scores.siklik;
            return { ...r, ...scores, riskSkoru: skor, riskSeviye: getRiskSeviye(skor) };
        }));
    }, []);

    const updateControlMeasures = useCallback((id: number, measures: OnerilecekOnlemler) => {
        setRiskler(prev => prev.map(r => r.id === id ? { ...r, onerilecekOnlemler: { ...measures } } : r));
    }, []);

    const addRisk = useCallback(() => {
        setRiskler(prev => {
            const newId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
            const [o, s, si] = [olasilikMap[3].v, siddetMap[1].v, siklikMap[2].v]; 
            const skor = o * s * si;
            const newRisk: Risk = {
                ...DEFAULT_RISK_TEMPLATE,
                id: newId,
                olasilik: o, siddet: s, siklik: si,
                riskSkoru: skor, riskSeviye: getRiskSeviye(skor),
                isCollapsed: false,
            };
            return [newRisk, ...prev.map(r => ({ ...r, isCollapsed: true }))];
        });
    }, []);

    const duplicateRisk = useCallback((id: number) => {
        setRiskler(prev => {
            const original = prev.find(r => r.id === id);
            if (!original) return prev;
            const newId = prev.length > 0 ? Math.max(...prev.map(r => r.id)) + 1 : 1;
            const newRisk = { ...original, id: newId, isCollapsed: false };
            return [newRisk, ...prev.map(r => ({ ...r, isCollapsed: true }))];
        });
    }, []);

    const removeRisk = useCallback((id: number) => {
        if (riskler.length <= 1) { showAlert("Hata", "En az bir risk kalmalı."); return; }
        const risk = riskler.find(r => r.id === id);
        showConfirmation({
            title: 'Riski Sil',
            message: `"${risk?.alan || 'Bu'}" riskini silmek istediğinize emin misiniz?`,
            confirmText: 'Sil',
            onConfirm: () => {
                DB.deleteFilesByRiskId(id).catch(err => console.error("Fotoğraflar silinemedi:", err));
                setRiskler(prev => prev.filter(r => r.id !== id));
            }
        });
    }, [riskler, showAlert, showConfirmation]);

    const toggleRiskCollapse = useCallback((id: number) => {
        setRiskler(prev => prev.map(r => r.id === id ? { ...r, isCollapsed: !r.isCollapsed } : r));
    }, []);

    const stats = useMemo(() => riskler.reduce((acc, risk) => {
        const map = { 'Önemsiz Risk': 'onemsiz', 'Düşük Risk': 'dusuk', 'Orta Risk': 'orta', 'Önemli Risk': 'onemli', 'Yüksek Risk': 'yuksek' };
        const key = map[risk.riskSeviye as keyof typeof map];
        if (key) (acc as any)[key]++;
        return acc;
    }, { onemsiz: 0, dusuk: 0, orta: 0, onemli: 0, yuksek: 0 }), [riskler]);

    const handleSpeechResult = useCallback((target: SpeechTarget, transcript: string) => {
        if (!target) return;
        
        // Helper to append text with deduplication and proper spacing
        const appendText = (prev: string | undefined) => {
            const safePrev = prev || '';
            const safeTranscript = transcript || '';
            const cleanPrev = safePrev.trim();
            const cleanTranscript = safeTranscript.trim();
            
            if (!cleanTranscript) return safePrev;
            // DEDUPLICATION CHECK: If previous text ends with the new transcript, ignore it
            if (cleanPrev.endsWith(cleanTranscript)) return safePrev;
            
            return cleanPrev ? `${cleanPrev} ${cleanTranscript}` : cleanTranscript;
        };
        
        // Helper to replace text (for names/titles)
        const replaceText = () => transcript;

        if ('adSoyad' in target) {
            updateEkip(target.id, replaceText);
        } else if ('field' in target && 'id' in target) {
            const field = target.field as string;
            const isLongText = ['tehlikeAciklama', 'mevcutOnlemler', 'eliminasyon', 'ikame', 'muhendislik', 'idari', 'kkd'].includes(field);
            updateRisk(target.id, field, isLongText ? appendText : replaceText);
        } else if ('field' in target) {
            const field = target.field as keyof FormData_Type;
            if (field === 'genelDegerlendirme') {
                updateFormData(field, appendText);
            } else {
                updateFormData(field, replaceText);
            }
        }
    }, [updateEkip, updateRisk, updateFormData]);

    return {
        formData, setFormData, riskEkibi, setRiskEkibi, riskler, setRiskler, stats,
        alanSuggestions, setAlanSuggestions, isEkipCollapsed, setIsEkipCollapsed,
        updateFormData, updateEkip, updateRisk, updateRiskScores, updateControlMeasures,
        addRisk, duplicateRisk, removeRisk, toggleRiskCollapse, handleSpeechResult
    };
};
