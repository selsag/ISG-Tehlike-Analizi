import React, { useRef, useEffect } from 'react';
import { FormData as FormData_Type, RiskTeamMember, SpeechTarget } from '../types';
import { IconHelp, IconLoaderSmall, IconLightbulb, IconMic } from './Icons';

interface SummarySectionProps {
    formData: FormData_Type;
    riskEkibi: RiskTeamMember[];
    onUpdateFormData: (field: keyof FormData_Type, value: string) => void;
    onGenerateSummary: () => void;
    isGeneratingSummary: boolean;
    onShowInfo: (key: string) => void;
    onToggleSpeech: (target: NonNullable<SpeechTarget>) => void;
    activeSpeechTarget: SpeechTarget;
}

const SummarySection: React.FC<SummarySectionProps> = ({
    formData, riskEkibi, onUpdateFormData, onGenerateSummary, isGeneratingSummary, onShowInfo, onToggleSpeech, activeSpeechTarget
}) => {
    const genelDegerlendirmeRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (genelDegerlendirmeRef.current) {
            genelDegerlendirmeRef.current.style.height = 'auto';
            genelDegerlendirmeRef.current.style.height = `${genelDegerlendirmeRef.current.scrollHeight}px`;
        }
    }, [formData.genelDegerlendirme]);

    return (
        <div className="print-summary-page">
            <div className="mb-6 mt-8 border-t-2 border-gray-300 pt-6 print:mt-0 print:border-t-0 print:pt-0">
                <h3 className="text-lg font-bold mb-3 bg-gray-200 p-3 rounded flex justify-between items-center">
                    <span>GENEL DEĞERLENDİRME</span>
                    <span className="flex items-center gap-2 print:hidden">
                        <button type="button" onClick={() => onShowInfo('aiGeneralSummary')} className="text-blue-600 hover:text-blue-800"><IconHelp /></button>
                        <button type="button" onClick={onGenerateSummary} disabled={isGeneratingSummary} className="text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait px-3 py-1 flex items-center gap-1.5">
                            {isGeneratingSummary ? <IconLoaderSmall /> : <IconLightbulb />} <span>Özet Oluştur</span>
                        </button>
                    </span>
                </h3>
                <div className="relative">
                    <textarea
                        ref={genelDegerlendirmeRef}
                        value={formData.genelDegerlendirme}
                        onChange={(e) => onUpdateFormData('genelDegerlendirme', e.target.value)}
                        rows={4}
                        placeholder="Genel sonuçlar..."
                        className="w-full border border-gray-300 rounded px-3 py-3 text-base md:text-sm pr-10 auto-grow-textarea print:hidden"
                    />
                    <div id="print-genel-degerlendirme" className="hidden print-twin">{formData.genelDegerlendirme}</div>
                    <button onClick={() => onToggleSpeech({ field: 'genelDegerlendirme' })} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden">
                        <IconMic isListening={activeSpeechTarget && 'field' in activeSpeechTarget && activeSpeechTarget.field === 'genelDegerlendirme'} />
                    </button>
                </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded print-legal-warning">
                <p className="text-sm md:text-xs font-semibold mb-2 text-yellow-900">YASAL BİLGİLENDİRME:</p>
                <ul className="text-sm md:text-xs text-yellow-800 leading-relaxed list-disc list-inside space-y-1">
                    <li>Bu risk değerlendirmesi, işyerinizin tehlike sınıfı ({formData.tehlikeSinifi}) dikkate alınarak yenilenmelidir.</li>
                    <li>Tespit edilen risklere karşı önerilen önlemlerin alınması işverenin yasal yükümlülüğüdür.</li>
                </ul>
            </div>

            <div className="mt-8 pt-4 border-t-2 border-gray-300 print-signature-section">
                <h3 className="text-lg font-bold mb-4 text-center">RİSK DEĞERLENDİRME EKİBİ ONAY TABLOSU</h3>
                <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[600px]">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border border-gray-300">Görevi / Rolü</th>
                                <th className="p-2 border border-gray-300">Adı Soyadı</th>
                                <th className="p-2 border border-gray-300">İmza</th>
                            </tr>
                        </thead>
                        <tbody>
                            {riskEkibi.map(uye => (
                                <tr key={uye.id}>
                                    <td className="p-2 border border-gray-300 font-semibold">{uye.rol}</td>
                                    <td className="p-2 border border-gray-300">{uye.adSoyad}</td>
                                    <td className="p-2 border border-gray-300 h-12"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SummarySection;
