import React from 'react';
import { Risk, FileRecord, SpeechTarget, OnerilecekOnlemler } from '../types';
import { 
    IconTrash, IconCopy, IconChevronUp, IconLightbulb, IconLoaderSmall, 
    IconMic, IconCamera, IconPaperclip, IconHelp, IconImage, IconPaperclipSmall 
} from './Icons';
import { tehlikeVeriYapisi, etkilenenKisilerListesi, olasilikMap, siddetMap, siklikMap } from '../constants';

interface CommonProps {
    risk: Risk;
    onUpdate: (id: number, field: string, value: any) => void;
    onToggleSpeech: (target: NonNullable<SpeechTarget>) => void;
    activeSpeechTarget: SpeechTarget;
}

export const RiskHeader: React.FC<CommonProps & {
    riskIndex: number;
    riskSeviyeBadgeColor: string;
    shortenedTehlike: string;
    onRemove: (id: number) => void;
    onDuplicate: (id: number) => void;
    onToggleCollapse: (id: number) => void;
    riskColor: string;
}> = ({ risk, riskIndex, riskSeviyeBadgeColor, shortenedTehlike, onRemove, onDuplicate, onToggleCollapse, riskColor }) => (
    <div className={`relative flex justify-between items-center p-3 md:p-4 gap-2 ${riskColor} rounded-t border-b border-gray-300`}>
        <div className="flex-shrink-0">
            <h4 className="font-bold text-sm md:text-base">RİSK #{riskIndex}</h4>
            <p className="text-xs text-gray-600 truncate max-w-[150px] md:max-w-xs hidden sm:block print:hidden">({shortenedTehlike} - {risk.alan || 'Genel'})</p>
            <p className="text-xs text-gray-600 hidden print:block">({shortenedTehlike} - {risk.alan || 'Genel'})</p>
        </div>
        <div className={`absolute left-1/2 -translate-x-1/2 px-3 py-1 text-xs sm:text-sm text-center font-bold rounded-full ${riskSeviyeBadgeColor} whitespace-nowrap`}>
            {risk.riskSeviye}
        </div>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <span className="px-3 py-1 bg-white rounded border-2 font-bold text-sm">Skor: {risk.riskSkoru}</span>
            <button onClick={() => onRemove(risk.id)} className="text-blue-600 hover:text-blue-800 print:hidden p-1"><IconTrash /></button>
            <button onClick={() => onDuplicate(risk.id)} className="text-blue-600 hover:text-blue-800 print:hidden p-1"><IconCopy /></button>
            <button onClick={() => onToggleCollapse(risk.id)} className="text-blue-600 hover:text-blue-800 print:hidden p-1"><IconChevronUp isCollapsed={!!risk.isCollapsed} /></button>
        </div>
    </div>
);

export const RiskContext: React.FC<CommonProps & {
    alanSuggestions: string[];
    suggestions: string[];
    showAlanSuggestions: boolean;
    showSuggestions: boolean;
    isGeneratingAlan: boolean;
    isGeneratingFaaliyet: boolean;
    onGenerateAlan: () => void;
    onGenerateFaaliyet: () => void;
    setShowAlanSuggestions: (v: boolean) => void;
    setShowSuggestions: (v: boolean) => void;
    alanContainerRef: React.RefObject<HTMLDivElement | null>;
    faaliyetContainerRef: React.RefObject<HTMLDivElement | null>;
}> = (props) => (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <div ref={props.alanContainerRef}>
                <div className="flex items-center gap-2 mb-1">
                    <label className="block text-xs font-semibold">Alan/Bölüm:</label>
                    <button type="button" onClick={props.onGenerateAlan} disabled={props.isGeneratingAlan} className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-wait print:hidden">
                        {props.isGeneratingAlan ? <IconLoaderSmall /> : <IconLightbulb />}
                    </button>
                </div>
                <div className="relative">
                    <input type="text" value={props.risk.alan} onChange={(e) => props.onUpdate(props.risk.id, 'alan', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-2 text-sm pr-10" placeholder="Derslik D-201 vb." />
                    <button onClick={() => props.onToggleSpeech({id: props.risk.id, field: 'alan'})} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden">
                        <IconMic isListening={!!(props.activeSpeechTarget && 'id' in props.activeSpeechTarget && props.activeSpeechTarget.id === props.risk.id && (props.activeSpeechTarget as any).field === 'alan')} />
                    </button>
                    {props.showAlanSuggestions && props.alanSuggestions.length > 0 && (
                        <div className="absolute z-30 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1 print:hidden">
                            <ul className="py-1">{props.alanSuggestions.map((s, i) => <li key={i} onClick={() => { props.onUpdate(props.risk.id, 'alan', s); props.setShowAlanSuggestions(false); }} className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">{s}</li>)}</ul>
                        </div>
                    )}
                </div>
            </div>
            <div ref={props.faaliyetContainerRef}>
                <div className="flex items-center gap-2 mb-1">
                    <label className="block text-xs font-semibold">Faaliyet/İş:</label>
                    <button type="button" onClick={props.onGenerateFaaliyet} disabled={props.isGeneratingFaaliyet} className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-wait print:hidden">
                        {props.isGeneratingFaaliyet ? <IconLoaderSmall /> : <IconLightbulb />}
                    </button>
                </div>
                <div className="relative">
                    <input type="text" value={props.risk.faaliyet} onChange={(e) => props.onUpdate(props.risk.id, 'faaliyet', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-2 text-sm pr-10" placeholder="Ders işleme vb." />
                    <button onClick={() => props.onToggleSpeech({id: props.risk.id, field: 'faaliyet'})} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden">
                        <IconMic isListening={!!(props.activeSpeechTarget && 'id' in props.activeSpeechTarget && props.activeSpeechTarget.id === props.risk.id && (props.activeSpeechTarget as any).field === 'faaliyet')} />
                    </button>
                    {props.showSuggestions && props.suggestions.length > 0 && (
                        <div className="absolute z-20 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1 print:hidden">
                            <ul className="py-1">{props.suggestions.map((s, i) => <li key={i} onClick={() => { props.onUpdate(props.risk.id, 'faaliyet', s); props.setShowSuggestions(false); }} className="px-3 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100">{s}</li>)}</ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <div className="grid grid-cols-7 md:grid-cols-3 gap-2 mb-3">
            <div className="col-span-3 md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Tehlike Türü:</label>
                <select value={props.risk.tehlike} onChange={(e) => props.onUpdate(props.risk.id, 'tehlike', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-2 text-sm">
                    <option value="">Lütfen Seçin</option>
                    {Object.keys(tehlikeVeriYapisi).filter(t => t).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>
            <div className="col-span-3 md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Etkilenen Kişi:</label>
                <select value={props.risk.etkilenenKisi} onChange={(e) => props.onUpdate(props.risk.id, 'etkilenenKisi', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-2 text-sm">
                    <option value="">--- Seçin ---</option>
                    {etkilenenKisilerListesi.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
            </div>
            <div className="col-span-1 md:col-span-1">
                <label className="block text-xs font-semibold mb-1">Sayısı:</label>
                <input type="number" value={props.risk.etkilenenSayi} onChange={(e) => props.onUpdate(props.risk.id, 'etkilenenSayi', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-2 text-sm" placeholder="Sayı..." />
            </div>
        </div>
    </>
);

export const RiskHazard: React.FC<CommonProps & {
    tehlikeData: any;
    aiHazardSuggestions: string[];
    isGeneratingHazards: boolean;
    onGenerateHazards: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    handleSelectAciklama: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleTextareaInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ risk, onToggleSpeech, activeSpeechTarget, tehlikeData, aiHazardSuggestions, isGeneratingHazards, onGenerateHazards, textareaRef, handleSelectAciklama, handleTextareaInput }) => (
    <div className="space-y-2 mb-3 print-tehlike-container">
        <div className="flex items-center mb-1">
            <label className="block text-xs font-semibold mr-2">Tehlike Açıklaması:</label>
            <button type="button" onClick={onGenerateHazards} disabled={isGeneratingHazards} className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-wait print:hidden">
                {isGeneratingHazards ? <IconLoaderSmall /> : <IconLightbulb />}
            </button>
        </div>
        <select onChange={handleSelectAciklama} className="w-full border border-gray-300 rounded px-2 py-2 text-sm print:hidden">
            <option value="">--- Hazır Listeden Ekle ---</option>
            {tehlikeData.aciklamaListesi.map((o: string) => <option key={o} value={o}>{o}</option>)}
            {aiHazardSuggestions.length > 0 && <optgroup label="AI Önerileri">{aiHazardSuggestions.map((s, i) => <option key={`ai-${i}`} value={s}>{s}</option>)}</optgroup>}
        </select>
        <div className="relative print:flex-grow print:flex print:flex-col">
            <textarea ref={textareaRef} data-field="tehlikeAciklama" value={risk.tehlikeAciklama} onInput={handleTextareaInput} className="w-full border border-gray-300 rounded px-2 py-2 text-sm min-h-[56px] auto-grow-textarea print:hidden pr-10" placeholder="Tespitlerinizi buraya yazın..."/>
            <button onClick={() => onToggleSpeech({id: risk.id, field: 'tehlikeAciklama'})} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden">
                <IconMic isListening={!!(activeSpeechTarget && 'id' in activeSpeechTarget && activeSpeechTarget.id === risk.id && (activeSpeechTarget as any).field === 'tehlikeAciklama')} />
            </button>
            <div className="hidden print-twin print-tehlike-content w-full border border-gray-300 rounded px-2 py-2 text-sm min-h-[56px] whitespace-pre-wrap bg-white">{risk.tehlikeAciklama}</div>
        </div>
    </div>
);

export const RiskMedia: React.FC<{
    risk: Risk;
    files: FileRecord[];
    isAnalyzingImage: boolean;
    onAnalyzeImage: () => void;
    onShowInfo: (key: string) => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteFile: (id: number) => void;
    onFileClick: (file: FileRecord) => void;
    getFileLabel: (type: string, name: string) => string;
    PrintThumbnail: React.FC<{ file: FileRecord; label: string }>;
}> = ({ risk, files, isAnalyzingImage, onAnalyzeImage, onShowInfo, onFileChange, onDeleteFile, onFileClick, getFileLabel, PrintThumbnail }) => (
    <div className="mt-3">
        <label className="block text-xs font-semibold mb-2">Kanıt/Fotoğraf Ekle:</label>
        <div className="flex items-center gap-2 print:hidden">
            <label htmlFor={`camera-input-${risk.id}`} className="cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 text-xs px-3 py-1.5 flex items-center gap-1.5"><IconCamera /> Kamera</label>
            <input type="file" id={`camera-input-${risk.id}`} className="hidden" accept="image/*" capture="environment" onChange={onFileChange} />
            <label htmlFor={`file-input-${risk.id}`} className="cursor-pointer bg-gray-100 text-gray-700 border border-gray-300 rounded hover:bg-gray-200 text-xs px-3 py-1.5 flex items-center gap-1.5"><IconPaperclip /> Dosya Ekle</label>
            <input type="file" id={`file-input-${risk.id}`} className="hidden" accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={onFileChange} />
            <div className="h-4 border-l border-gray-300 mx-1"></div>
            <button type="button" onClick={() => onShowInfo('aiImageAnalysis')} className="text-blue-600 hover:text-blue-800"><IconHelp /></button>
            <button type="button" onClick={onAnalyzeImage} disabled={isAnalyzingImage} className="text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait px-3 py-1 flex items-center gap-1.5">
                {isAnalyzingImage ? <IconLoaderSmall /> : <IconLightbulb />} <span>Fotoğrafı Analiz Et</span>
            </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
            {files.map((file) => {
                const isImage = file.fileType.startsWith("image/");
                const label = getFileLabel(file.fileType, file.fileName);
                return (
                    <div key={file.id} className="relative group print:inline-block">
                        <button onClick={() => onFileClick(file)} className="print:hidden bg-gray-50 border border-gray-300 rounded text-blue-600 hover:text-blue-800 hover:underline text-xs px-2.5 py-1.5 flex items-center gap-1.5">
                            {isImage ? <IconImage /> : <IconPaperclipSmall />} <span>{label}</span>
                        </button>
                        <button onClick={() => onDeleteFile(file.id)} className="print:hidden absolute -top-2 -right-2 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-700"><IconTrash /></button>
                        {isImage && <PrintThumbnail file={file} label={label} />}
                    </div>
                )
            })}
        </div>
    </div>
);

export const RiskScoring: React.FC<CommonProps & {
    isGeneratingScores: boolean;
    onGenerateScores: () => void;
    onShowInfo: (key: string) => void;
}> = ({ risk, onUpdate, isGeneratingScores, onGenerateScores, onShowInfo }) => (
    <div className="bg-white bg-opacity-50 rounded p-3 mb-3 mt-4">
        <div className="flex justify-end items-center mb-2 gap-2 print:hidden">
            <button type="button" onClick={() => onShowInfo('aiRiskScoring')} className="text-blue-600 hover:text-blue-800"><IconHelp /></button>
            <button type="button" onClick={onGenerateScores} disabled={isGeneratingScores} className="text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait px-3 py-1 flex items-center gap-1.5">
                {isGeneratingScores ? <IconLoaderSmall /> : <IconLightbulb />} <span>AI ile Puanla</span>
            </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
            {['olasilik', 'siddet', 'siklik'].map(field => (
                <div key={field}>
                    <label className="block text-xs font-semibold mb-1 capitalize">{field} <button onClick={() => onShowInfo(field)} className="ml-1 text-blue-600 hover:text-blue-800 print:hidden"><IconHelp /></button></label>
                    <select value={(risk as any)[field]} onChange={(e) => onUpdate(risk.id, field, parseFloat(e.target.value))} className="w-full border border-gray-300 rounded px-2 py-2 text-sm">
                        {(field === 'olasilik' ? olasilikMap : field === 'siddet' ? siddetMap : siklikMap).map(o => <option key={o.v} value={String(o.v)}>{o.t}</option>)}
                    </select>
                </div>
            ))}
        </div>
        <div className="mt-3 text-center text-sm font-semibold">{risk.riskSeviye}</div>
    </div>
);

export const RiskMeasures: React.FC<CommonProps & {
    tehlikeData: any;
    isGeneratingMeasures: boolean;
    onGenerateMeasures: () => void;
    onShowInfo: (key: string) => void;
    onlemRefs: any;
    mevcutOnlemlerRef: React.RefObject<HTMLTextAreaElement | null>;
    handleTextareaInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    riskIndex: number;
    shortenedTehlike: string;
    riskSeviyeBadgeColor: string;
}> = ({ risk, onUpdate, onToggleSpeech, activeSpeechTarget, tehlikeData, isGeneratingMeasures, onGenerateMeasures, onShowInfo, onlemRefs, mevcutOnlemlerRef, handleTextareaInput, riskIndex, shortenedTehlike, riskSeviyeBadgeColor }) => {
    const onerilecekOnlemlerFields = [
        { field: 'eliminasyon', label: '1. Yok Etme (Eliminasyon)', placeholder: tehlikeData.dinamikOrnekler.eliminasyon },
        { field: 'ikame', label: '2. İkame (Değiştirme)', placeholder: tehlikeData.dinamikOrnekler.ikame },
        { field: 'muhendislik', label: '3. Mühendislik Önlemleri', placeholder: tehlikeData.dinamikOrnekler.muhendislik },
        { field: 'idari', label: '4. İdari Önlemler', placeholder: tehlikeData.dinamikOrnekler.idari },
        { field: 'kkd', label: '5. Kişisel Koruyucu Donanım (KKD)', placeholder: tehlikeData.dinamikOrnekler.kkd },
    ];

    return (
        <>
            <div className="mt-3">
                <label className="block text-xs font-semibold mb-1">Mevcut Önlemler</label>
                <div className="relative">
                    <textarea ref={mevcutOnlemlerRef} data-field="mevcutOnlemler" value={risk.mevcutOnlemler} onInput={handleTextareaInput} className="w-full border border-gray-300 rounded px-2 py-2 text-sm min-h-[56px] auto-grow-textarea print:hidden pr-10" placeholder="Mevcut kontroller..." />
                    <button onClick={() => onToggleSpeech({id: risk.id, field: 'mevcutOnlemler'})} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden">
                        <IconMic isListening={!!(activeSpeechTarget && 'id' in activeSpeechTarget && activeSpeechTarget.id === risk.id && (activeSpeechTarget as any).field === 'mevcutOnlemler')} />
                    </button>
                    <div className="hidden print-twin print-twin-collapsible w-full border border-gray-300 rounded px-2 py-2 text-sm min-h-[56px] whitespace-pre-wrap bg-white">{risk.mevcutOnlemler}</div>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center flex-wrap gap-x-4 gap-y-2 mb-2 print:hidden">
                    <label className="block text-sm font-bold text-gray-800">Önerilecek Önlemler <button onClick={() => onShowInfo('hiyerarsi')} className="ml-1 text-blue-600 hover:text-blue-800 align-middle"><IconHelp /></button></label>
                    <div className="flex items-center gap-2">
                         <button type="button" onClick={() => onShowInfo('aiControlMeasures')} className="text-blue-600 hover:text-blue-800"><IconHelp /></button>
                         <button type="button" onClick={onGenerateMeasures} disabled={isGeneratingMeasures} className="text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait px-3 py-1 flex items-center gap-1.5">
                            {isGeneratingMeasures ? <IconLoaderSmall /> : <IconLightbulb />} <span>Tümünü Doldur</span>
                        </button>
                    </div>
                </div>
                <div className="hidden print:flex relative justify-between items-center mt-4 mb-2 border-b border-gray-300 pb-2">
                    <p className="text-sm font-bold text-gray-800">Önerilecek Önlemler</p>
                    <div className={`absolute left-1/2 -translate-x-1/2 px-3 py-1 text-xs text-center font-bold rounded-full ${riskSeviyeBadgeColor} whitespace-nowrap`}>{risk.riskSeviye}</div>
                    <h4 className="text-sm font-bold text-gray-800">RİSK #{riskIndex} <span className="font-normal">({shortenedTehlike} - {risk.alan || 'Genel'})</span></h4>
                </div>
            </div>

            {onerilecekOnlemlerFields.map(({field, label, placeholder}) => (
                <div key={field} className="mt-2">
                    <label className="block text-xs font-semibold mb-1 text-gray-700">{label}</label>
                    <div className="relative">
                        <textarea
                            ref={onlemRefs[field as keyof OnerilecekOnlemler]}
                            data-field={field}
                            value={risk.onerilecekOnlemler[field as keyof OnerilecekOnlemler]}
                            onInput={handleTextareaInput}
                            readOnly={isGeneratingMeasures}
                            className={`w-full border border-gray-300 rounded px-2 py-2 text-sm min-h-[56px] auto-grow-textarea print:hidden pr-10 ${isGeneratingMeasures ? 'bg-gray-100' : ''}`}
                            placeholder={placeholder}
                        />
                        <button onClick={() => onToggleSpeech({id: risk.id, field: field as any})} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden">
                            <IconMic isListening={!!(activeSpeechTarget && 'id' in activeSpeechTarget && activeSpeechTarget.id === risk.id && (activeSpeechTarget as any).field === field)} />
                        </button>
                         <div className="hidden print-twin print-twin-collapsible w-full border border-gray-300 rounded px-2 py-2 text-sm min-h-[56px] whitespace-pre-wrap bg-white">{risk.onerilecekOnlemler[field as keyof OnerilecekOnlemler]}</div>
                    </div>
                </div>
            ))}
        </>
    );
};

export const RiskFooter: React.FC<CommonProps & {
    isGeneratingSorumlu: boolean;
    onGenerateSorumlu: () => void;
    onShowInfo: (key: string) => void;
    onRemove: (id: number) => void;
    onDuplicate: (id: number) => void;
    onToggleCollapse: (id: number) => void;
    handleBottomCollapse: () => void;
}> = ({ risk, onUpdate, onToggleSpeech, activeSpeechTarget, isGeneratingSorumlu, onGenerateSorumlu, onShowInfo, onRemove, onDuplicate, handleBottomCollapse }) => (
    <div className="grid grid-cols-3 md:grid-cols-2 gap-2 mt-3 items-end">
      <div className="col-span-2 md:col-span-1">
        <div className="flex items-center mb-1">
            <label className="block text-xs font-semibold mr-2">Sorumlu Kişi/Birim:</label>
            <span className="flex items-center gap-1 print:hidden">
                <button type="button" onClick={() => onShowInfo('aiResponsibleUnit')} className="text-blue-600 hover:text-blue-800"><IconHelp /></button>
                <button type="button" onClick={onGenerateSorumlu} disabled={isGeneratingSorumlu} className="text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-wait">
                    {isGeneratingSorumlu ? <IconLoaderSmall /> : <IconLightbulb />}
                </button>
            </span>
        </div>
        <div className="relative">
            <input type="text" value={risk.sorumlu} onChange={(e) => onUpdate(risk.id, 'sorumlu', e.target.value)} className="w-full border border-gray-300 rounded px-2 py-2 text-sm pr-10" placeholder="İlgili birim/kişi adı"/>
            <button onClick={() => onToggleSpeech({id: risk.id, field: 'sorumlu'})} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden">
                <IconMic isListening={!!(activeSpeechTarget && 'id' in activeSpeechTarget && activeSpeechTarget.id === risk.id && (activeSpeechTarget as any).field === 'sorumlu')} />
            </button>
        </div>
      </div>
      <div className="col-span-1 md:col-span-1">
        <label className="block text-xs font-semibold mb-1">Düzeltme Tarihi:</label>
        <div className="flex items-center gap-1">
             <input type="date" value={risk.tamamlanmaTarihi} onChange={(e) => onUpdate(risk.id, 'tamamlanmaTarihi', e.target.value)} className="w-full min-w-0 flex-1 border border-gray-300 rounded px-2 py-2 text-sm" />
             <div className="flex items-center print:hidden">
                <button onClick={() => onRemove(risk.id)} className="text-blue-600 hover:text-blue-800 p-1"><IconTrash /></button>
                <button onClick={() => onDuplicate(risk.id)} className="text-blue-600 hover:text-blue-800 p-1"><IconCopy /></button>
                <button onClick={handleBottomCollapse} className="text-blue-600 hover:text-blue-800 p-1"><IconChevronUp isCollapsed={!!risk.isCollapsed} /></button>
             </div>
        </div>
      </div>
    </div>
);
