
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Risk, OnerilecekOnlemler, FileRecord, SpeechTarget, ModalState } from '../types';
import * as DB from '../services/db';
import * as AI from '../services/ai';
import { tehlikeVeriYapisi } from '../constants';
import { resizeImage } from '../utils/helpers';
import { 
    RiskHeader, RiskContext, RiskHazard, RiskMedia, RiskScoring, RiskMeasures, RiskFooter 
} from './RiskCardParts';
import { GenerateContentResponse } from "@google/genai";
import { PromptEditorModal } from './Modals'; // Import new Modal

interface RiskCardProps {
    risk: Risk;
    riskIndex: number;
    birimAdi: string;
    onUpdate: (id: number, field: string, value: any) => void;
    onRemove: (id: number) => void;
    onDuplicate: (id: number) => void;
    onToggleCollapse: (id: number) => void;
    onShowInfo: (key: string) => void;
    onPreviewImage: (file: FileRecord, title: string) => void;
    onToggleSpeech: (target: NonNullable<SpeechTarget>) => void;
    activeSpeechTarget: SpeechTarget;
    onUpdateScores: (id: number, scores: { olasilik: number, siddet: number, siklik: number }) => void;
    onUpdateMeasures: (id: number, measures: OnerilecekOnlemler) => void;
    showConfirmation: (config: Omit<ModalState, 'isOpen'>) => void;
    showAlert: (title: string, message: React.ReactNode) => void;
    onApiKeyError: () => void;
    alanSuggestions: string[];
    isGeneratingAlanSuggestions: boolean;
    onGenerateAlanSuggestions: () => void;
    dataVersion: number;
}

const PrintThumbnail: React.FC<{ file: FileRecord; label: string }> = ({ file, label }) => {
    const [url, setUrl] = useState<string | null>(null);
    useEffect(() => {
        if (file && file.fileData instanceof Blob) {
            const objectUrl = URL.createObjectURL(file.fileData);
            setUrl(objectUrl);
            return () => { URL.revokeObjectURL(objectUrl); };
        }
    }, [file]);
    if (!url) return null;
    return <img src={url} alt={label} className="hidden print:block w-[80px] h-[80px] object-contain border border-gray-300 align-top mt-1" />;
};

const RiskCard: React.FC<RiskCardProps> = React.memo(({ risk, riskIndex, birimAdi, onUpdate, onRemove, onDuplicate, onToggleCollapse, onShowInfo, onPreviewImage, onToggleSpeech, activeSpeechTarget, onUpdateScores, showConfirmation, showAlert, onApiKeyError, alanSuggestions, isGeneratingAlanSuggestions, onGenerateAlanSuggestions, dataVersion }) => {
    const [files, setFiles] = useState<FileRecord[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showAlanSuggestions, setShowAlanSuggestions] = useState(false);
    const [aiHazardSuggestions, setAiHazardSuggestions] = useState<string[]>([]);
    const [isGeneratingHazards, setIsGeneratingHazards] = useState(false);
    const [isGeneratingScores, setIsGeneratingScores] = useState(false);
    const [isGeneratingMeasures, setIsGeneratingMeasures] = useState(false);
    const [isGeneratingSorumlu, setIsGeneratingSorumlu] = useState(false);
    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
    
    // Prompt Editing State
    const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);
    const [editingPromptType, setEditingPromptType] = useState<'hazard' | 'measures'>('hazard');
    const [hazardPrompt, setHazardPrompt] = useState<string>(() => {
        return localStorage.getItem('hazardPromptTemplate') || AI.DEFAULT_HAZARD_PROMPT_TEMPLATE;
    });
    const [measuresPrompt, setMeasuresPrompt] = useState<string>(() => {
        return localStorage.getItem('measuresPromptTemplate') || AI.DEFAULT_MEASURES_PROMPT_TEMPLATE;
    });

    const cardRef = useRef<HTMLDivElement>(null);
    const alanContainerRef = useRef<HTMLDivElement>(null);
    const faaliyetContainerRef = useRef<HTMLDivElement>(null);
    
    const mevcutOnlemlerRef = useRef<HTMLTextAreaElement>(null);
    const onlemRefs = {
        eliminasyon: useRef<HTMLTextAreaElement>(null),
        ikame: useRef<HTMLTextAreaElement>(null),
        muhendislik: useRef<HTMLTextAreaElement>(null),
        idari: useRef<HTMLTextAreaElement>(null),
        kkd: useRef<HTMLTextAreaElement>(null),
    };

    useEffect(() => {
        const autoResize = (element: HTMLTextAreaElement | null) => {
            if (element) {
                element.style.height = 'auto';
                element.style.height = `${element.scrollHeight}px`;
            }
        };
        // Tehlike açıklaması için autoResize kaldırıldı (div otomatik büyür)
        autoResize(mevcutOnlemlerRef.current);
        Object.values(onlemRefs).forEach(ref => autoResize(ref.current));
    }, [risk.tehlikeAciklama, risk.mevcutOnlemler, risk.onerilecekOnlemler, onlemRefs]);

    const loadFiles = useCallback(async () => {
        try { setFiles(await DB.getFilesForRisk(risk.id)); } 
        catch (error) { console.error("Error loading files", error); }
    }, [risk.id]);

    useEffect(() => { loadFiles(); }, [risk, loadFiles, dataVersion]); 
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (alanContainerRef.current && !alanContainerRef.current.contains(event.target as Node)) setShowAlanSuggestions(false);
            if (faaliyetContainerRef.current && !faaliyetContainerRef.current.contains(event.target as Node)) setShowSuggestions(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => { document.removeEventListener('mousedown', handleClickOutside); };
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files?.[0]) {
            const originalFile = event.target.files[0];
            let fileToSave = originalFile;

            // If it is an image, resize it
            if (originalFile.type.startsWith('image/')) {
                try {
                    // Resize to max 1024px width, 0.7 quality jpeg
                    fileToSave = await resizeImage(originalFile, 1024, 0.7);
                } catch (error) {
                    console.error("Image resize failed, using original file.", error);
                }
            }

            await DB.addFileToDB(risk.id, fileToSave);
            loadFiles();
        }
        event.target.value = '';
    };

    const deleteFile = (fileId: number) => {
        showConfirmation({
            title: 'Dosyayı Sil',
            message: 'Bu dosyayı kalıcı olarak silmek istediğinizden emin misiniz?',
            confirmText: 'Sil',
            onConfirm: async () => { await DB.deleteFileFromDB(fileId); loadFiles(); }
        });
    };
    
    const getFileLabel = (fileType: string, fileName: string) => {
        if (fileType.startsWith("image/")) return "Foto";
        if (fileType.includes("pdf")) return "PDF";
        if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) return "Word";
        if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) return "Excel";
        return "Dosya";
    };

    const onFileButtonClick = async (file: FileRecord) => {
        if (!file.fileData) return;
        if(file.fileType.startsWith("image/")) {
            // Generate contextual title for the preview
            const title = `RİSK #${riskIndex} - ${risk.alan || 'Alan/Bölüm Girilmedi'} (${risk.tehlike || 'Tehlike Türü Girilmedi'})`;
            onPreviewImage(file, title); 
        } else {
            const url = URL.createObjectURL(file.fileData);
            const a = document.createElement('a'); a.href = url; a.target = '_blank';
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    };
    
    const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if(e.target.dataset.field) onUpdate(risk.id, e.target.dataset.field, e.target.value);
    }
    
    const handleSelectAciklama = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!e.target.value) return;
        onUpdate(risk.id, 'tehlikeAciklama', risk.tehlikeAciklama ? `${risk.tehlikeAciklama}\n${e.target.value}` : e.target.value);
        e.target.value = '';
    };

    const handleBottomCollapse = () => {
        onToggleCollapse(risk.id);
        if (!risk.isCollapsed) setTimeout(() => cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100); 
    };

    const handleSavePrompt = (newPrompt: string) => {
        if (editingPromptType === 'hazard') {
            setHazardPrompt(newPrompt);
            localStorage.setItem('hazardPromptTemplate', newPrompt);
        } else {
            setMeasuresPrompt(newPrompt);
            localStorage.setItem('measuresPromptTemplate', newPrompt);
        }
    };
    
    const openPromptEditor = (type: 'hazard' | 'measures') => {
        setEditingPromptType(type);
        setIsPromptEditorOpen(true);
    };

    // AI Logic using service
    const handleError = (e: any, defaultMsg: string) => {
        if (AI.isAuthOrQuotaError(e)) {
            showAlert("API Kotası/Yetki Hatası", "Sistemin API kullanım kotası dolmuş veya anahtar geçersiz. Lütfen kendi API anahtarınızı girin.");
            onApiKeyError();
        } else {
            showAlert("AI Hatası", defaultMsg);
        }
    };

    const generateSuggestions = async () => {
        if (!risk.alan) { showAlert("Gerekli Bilgi Eksik", "Önce 'Alan/Bölüm' girin."); return; }
        setIsGenerating(true);
        try {
            const items = await AI.fetchFaaliyetSuggestions(birimAdi, risk.alan);
            setSuggestions(items); setShowSuggestions(true);
        } catch (e) { handleError(e, "Faaliyet önerileri başarısız."); } finally { setIsGenerating(false); }
    };

    const generateHazardSuggestions = async () => {
        if (!risk.tehlike) { showAlert("Gerekli Bilgi Eksik", "Tehlike türü seçin."); return; }
        setIsGeneratingHazards(true);
        try {
            // Pass the custom prompt if it exists
            const items = await AI.fetchHazardSuggestions(birimAdi, risk, hazardPrompt);
            setAiHazardSuggestions(items);
        } catch (e) { handleError(e, "Tehlike önerileri başarısız."); } finally { setIsGeneratingHazards(false); }
    };
    
    const analyzeImageForHazards = async () => {
        const img = files.find(f => f.fileType.startsWith('image/'));
        if (!img) { showAlert("Eksik", "Fotoğraf ekleyin."); return; }
        setIsAnalyzingImage(true);
        try {
            const text = await AI.analyzeImageHazards(img.fileData, img.fileType);
            onUpdate(risk.id, 'tehlikeAciklama', `${risk.tehlikeAciklama || ''}\n\n--- FOTOĞRAF ANALİZİ ---\n${text}`.trim());
        } catch (e) { handleError(e, "Analiz başarısız."); } finally { setIsAnalyzingImage(false); }
    };

    const generateRiskScores = async () => {
        if (!risk.tehlikeAciklama) { showAlert("Eksik", "Tehlike açıklaması girin."); return; }
        setIsGeneratingScores(true);
        try {
            const res = await AI.fetchRiskScores(risk, birimAdi);
            showConfirmation({
                title: 'AI Puanlama Önerisi',
                message: <div><ul className="list-disc list-inside"><li>Olasılık: {res.olasilik}</li><li>Şiddet: {res.siddet}</li><li>Sıklık: {res.siklik}</li></ul><p className="text-xs mt-2">{res.gerekce}</p></div>,
                confirmText: 'Uygula',
                onConfirm: () => onUpdateScores(risk.id, { olasilik: res.olasilik, siddet: res.siddet, siklik: res.siklik })
            });
        } catch (e) { handleError(e, "Puanlama başarısız."); } finally { setIsGeneratingScores(false); }
    };
    
    const generateControlMeasures = async () => {
        if (!risk.tehlikeAciklama) { showAlert("Eksik", "Tehlike açıklaması girin."); return; }
        setIsGeneratingMeasures(true);
        const fields: (keyof OnerilecekOnlemler & string)[] = ['eliminasyon', 'ikame', 'muhendislik', 'idari', 'kkd'];
        try {
            const stream = await AI.fetchControlMeasuresStream(risk, measuresPrompt);
            let buffer = ''; let currentField: (keyof OnerilecekOnlemler & string) | null = null;
            for await (const chunk of stream) {
                const c = chunk as GenerateContentResponse;
                buffer += c.text || '';
                while (true) {
                    if (!currentField) {
                        const nextField = fields.find(f => buffer.includes(`<${f}>`));
                        if (nextField) {
                            currentField = nextField; 
                            buffer = buffer.substring(buffer.indexOf(`<${nextField}>`) + nextField.length + 2); 
                        } else break;
                    }
                    if (currentField) {
                        const endTag = `</${currentField}>`; 
                        const endIndex = buffer.indexOf(endTag);
                        if (endIndex !== -1) {
                            const content = buffer.substring(0, endIndex).trim();
                            const prev = risk.onerilecekOnlemler[currentField];
                            onUpdate(risk.id, currentField, prev ? `${prev}\n${content}` : content);
                            buffer = buffer.substring(endIndex + endTag.length); 
                            currentField = null;
                        } else break;
                    }
                }
            }
        } catch (e) { handleError(e, "Önlem önerileri başarısız."); } finally { setIsGeneratingMeasures(false); }
    };
    
    const generateResponsibleUnit = async () => {
        if (!risk.tehlikeAciklama) { showAlert("Eksik", "Tehlike açıklaması girin."); return; }
        setIsGeneratingSorumlu(true);
        try {
            const sorumlu = await AI.fetchResponsibleUnit(risk);
            if (sorumlu) onUpdate(risk.id, 'sorumlu', sorumlu);
        } catch (e) { handleError(e, "Sorumlu birim önerisi başarısız."); } finally { setIsGeneratingSorumlu(false); }
    };

    const riskColor = 
        risk.riskSeviye === 'Önemsiz Risk' ? 'bg-green-100 border-green-400' :
        risk.riskSeviye === 'Düşük Risk' ? 'bg-blue-100 border-blue-400' :
        risk.riskSeviye === 'Orta Risk' ? 'bg-yellow-100 border-yellow-400' :
        risk.riskSeviye === 'Önemli Risk' ? 'bg-orange-100 border-orange-400' :
        risk.riskSeviye === 'Yüksek Risk' ? 'bg-red-200 border-red-500 text-black' : 'bg-gray-100 border-gray-400';
    
    const badgeColor = {
        'Önemsiz Risk': 'bg-green-600 text-white', 'Düşük Risk': 'bg-blue-600 text-white',
        'Orta Risk': 'bg-yellow-500 text-black', 'Önemli Risk': 'bg-orange-500 text-white',
        'Yüksek Risk': 'bg-red-600 text-white',
    }[risk.riskSeviye] || 'bg-gray-500 text-white';

    const shortenedTehlike = risk.tehlike?.split('(')[0].trim() || 'Tanımsız';
    const tehlikeData = tehlikeVeriYapisi[risk.tehlike] || tehlikeVeriYapisi[''];

    return (
        <>
            <PromptEditorModal 
                isOpen={isPromptEditorOpen}
                currentPrompt={editingPromptType === 'hazard' ? hazardPrompt : measuresPrompt}
                defaultPrompt={editingPromptType === 'hazard' ? AI.DEFAULT_HAZARD_PROMPT_TEMPLATE : AI.DEFAULT_MEASURES_PROMPT_TEMPLATE}
                variableHelpText={editingPromptType === 'hazard' ? '{birim}, {alan}, {faaliyet}, {tehlikeKategorisi}, {mevcutListe}' : '{alan}, {tehlike}'}
                onSave={handleSavePrompt}
                onClose={() => setIsPromptEditorOpen(false)}
            />
            <div ref={cardRef} className={`border-2 rounded ${riskColor} risk-card print-break-before-always`}>
                <RiskHeader 
                    risk={risk} riskIndex={riskIndex} riskSeviyeBadgeColor={badgeColor} shortenedTehlike={shortenedTehlike} riskColor={riskColor}
                    onRemove={onRemove} onDuplicate={onDuplicate} onToggleCollapse={onToggleCollapse} onUpdate={onUpdate} onToggleSpeech={onToggleSpeech} activeSpeechTarget={activeSpeechTarget}
                />
                <div className={`risk-card-content p-3 md:p-4 border-t border-gray-300 ${risk.isCollapsed ? 'hidden collapsed-in-print' : ''}`}>
                    <div className="risk-problem-section print:break-inside-avoid">
                        <RiskContext
                            risk={risk} onUpdate={onUpdate} onToggleSpeech={onToggleSpeech} activeSpeechTarget={activeSpeechTarget}
                            alanSuggestions={alanSuggestions} suggestions={suggestions} 
                            showAlanSuggestions={showAlanSuggestions} showSuggestions={showSuggestions}
                            isGeneratingAlan={isGeneratingAlanSuggestions} isGeneratingFaaliyet={isGenerating}
                            onGenerateAlan={onGenerateAlanSuggestions} onGenerateFaaliyet={generateSuggestions}
                            setShowAlanSuggestions={setShowAlanSuggestions} setShowSuggestions={setShowSuggestions}
                            alanContainerRef={alanContainerRef} faaliyetContainerRef={faaliyetContainerRef}
                        />
                        <RiskHazard 
                            risk={risk} onUpdate={onUpdate} onToggleSpeech={onToggleSpeech} activeSpeechTarget={activeSpeechTarget}
                            tehlikeData={tehlikeData} aiHazardSuggestions={aiHazardSuggestions} isGeneratingHazards={isGeneratingHazards}
                            onGenerateHazards={generateHazardSuggestions}
                            handleSelectAciklama={handleSelectAciklama}
                            onEditPrompt={() => openPromptEditor('hazard')}
                        />
                        <RiskMedia 
                            risk={risk} files={files} isAnalyzingImage={isAnalyzingImage} onAnalyzeImage={analyzeImageForHazards}
                            onShowInfo={onShowInfo} onFileChange={handleFileChange} onDeleteFile={deleteFile} onFileClick={onFileButtonClick}
                            getFileLabel={getFileLabel} PrintThumbnail={PrintThumbnail}
                        />
                        <RiskScoring 
                            risk={risk} onUpdate={onUpdate} onToggleSpeech={onToggleSpeech} activeSpeechTarget={activeSpeechTarget}
                            isGeneratingScores={isGeneratingScores} onGenerateScores={generateRiskScores} onShowInfo={onShowInfo}
                        />
                    </div>
                    <div className="risk-solution-section print:break-inside-avoid">
                        <RiskMeasures 
                            risk={risk} onUpdate={onUpdate} onToggleSpeech={onToggleSpeech} activeSpeechTarget={activeSpeechTarget}
                            tehlikeData={tehlikeData} isGeneratingMeasures={isGeneratingMeasures} onGenerateMeasures={generateControlMeasures}
                            onShowInfo={onShowInfo} onlemRefs={onlemRefs} mevcutOnlemlerRef={mevcutOnlemlerRef} handleTextareaInput={handleTextareaInput}
                            riskIndex={riskIndex} shortenedTehlike={shortenedTehlike} riskSeviyeBadgeColor={badgeColor}
                            onEditPrompt={() => openPromptEditor('measures')}
                        />
                        <RiskFooter 
                            risk={risk} onUpdate={onUpdate} onToggleSpeech={onToggleSpeech} activeSpeechTarget={activeSpeechTarget}
                            isGeneratingSorumlu={isGeneratingSorumlu} onGenerateSorumlu={generateResponsibleUnit} onShowInfo={onShowInfo}
                            onRemove={onRemove} onDuplicate={onDuplicate} onToggleCollapse={onToggleCollapse} handleBottomCollapse={handleBottomCollapse}
                        />
                    </div>
                </div>
            </div>
        </>
    );
});

export default RiskCard;
