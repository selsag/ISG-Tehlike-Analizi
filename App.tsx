
import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as DB from './services/db';
import * as AI from './services/ai';
import { 
    IconPlus, IconUsers, IconRotateCcw, IconDownload,
    IconUpload, IconChevronUp, IconMic, IconCopySmall, IconLoader, IconKey
} from './components/Icons';
import RiskCard from './components/RiskCard';
import RiskStats from './components/RiskStats';
import SummarySection from './components/SummarySection';
import PrintManager from './components/PrintManager';
import { InfoModal, ImagePreviewModal, ConfirmationModal, ApiKeyModal } from './components/Modals';
import { useRiskData } from './hooks/useRiskData';
import { useSpeech } from './hooks/useSpeech';
import { ModalState, FileRecord } from './types';
import { blobToBase64, base64ToFile, resizeImage } from './utils/helpers';

const App: React.FC = () => {
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, title: '', message: '', onConfirm: () => {}, });
  const [activeInfoModal, setActiveInfoModal] = useState<string | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isInitialApiKeyCheck, setIsInitialApiKeyCheck] = useState(true);
  
  // Preview state now holds both file and a context title
  const [previewData, setPreviewData] = useState<{ file: FileRecord, title: string } | null>(null);
  
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingAlanSuggestions, setIsGeneratingAlanSuggestions] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Version counter to force refresh child components (specifically file lists) after bulk operations like Import
  const [dataVersion, setDataVersion] = useState(0);

  const riskListRef = useRef<HTMLDivElement>(null);

  // Check for API key on mount
  useEffect(() => {
    if (!AI.hasApiKey()) {
      setIsApiKeyModalOpen(true);
    } else {
      setIsInitialApiKeyCheck(false);
    }
  }, []);

  const handleSaveApiKey = useCallback((apiKey: string) => {
    AI.setApiKey(apiKey);
    setIsInitialApiKeyCheck(false);
  }, []);

  const hideModal = useCallback(() => setModalState(prev => ({ ...prev, isOpen: false })), []);
  const showConfirmation = useCallback((config: Omit<ModalState, 'isOpen'>) => {
    setModalState({ ...config, isOpen: true, onConfirm: () => { config.onConfirm(); hideModal(); }, cancelText: config.cancelText ?? 'İptal' });
  }, [hideModal]);
  const showAlert = useCallback((title: string, message: React.ReactNode) => {
      showConfirmation({ title, message, onConfirm: () => {}, confirmText: 'Tamam', cancelText: '' });
  }, [showConfirmation]);

  const riskData = useRiskData(showAlert, showConfirmation);
  const { speechTarget, toggleSpeech } = useSpeech(riskData.handleSpeechResult, (err) => showAlert("Hata", err));

  const prevRisklerLength = useRef(riskData.riskler.length);
  useEffect(() => {
    if (riskData.riskler.length > prevRisklerLength.current) riskListRef.current?.firstElementChild?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    prevRisklerLength.current = riskData.riskler.length;
  }, [riskData.riskler]);

  const generateAlanSuggestions = useCallback(async () => {
    if (!riskData.formData.birim) { showAlert("Eksik", "Birim girin."); return; }
    setIsGeneratingAlanSuggestions(true);
    try { riskData.setAlanSuggestions(await AI.fetchAlanSuggestions(riskData.formData.birim)); } 
    catch { showAlert("Hata", "Alan önerileri başarısız."); } finally { setIsGeneratingAlanSuggestions(false); }
  }, [riskData.formData.birim, showAlert, riskData.setAlanSuggestions]);

  const generateGeneralSummary = async () => {
    setIsGeneratingSummary(true);
    try { riskData.updateFormData('genelDegerlendirme', await AI.fetchGeneralSummary(riskData.formData, riskData.riskler)); } 
    catch { showAlert("Hata", "Özet oluşturulamadı."); } finally { setIsGeneratingSummary(false); }
  };

  const handleDuplicateFirst = useCallback(() => {
    if (riskData.riskler.length === 0) showAlert("Hata", "Risk yok."); else riskData.duplicateRisk(riskData.riskler[0].id);
  }, [riskData.riskler, riskData.duplicateRisk, showAlert]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
        const allFiles = await DB.getAllFiles();
        
        // Convert files to base64 AND resize if necessary before exporting
        const filesExport = await Promise.all(allFiles.map(async (f) => {
            let fileData = f.fileData;
            
            // Eğer dosya bir resimse ve büyükse, export etmeden önce küçült
            if (fileData instanceof File && fileData.type.startsWith('image/')) {
                try {
                    fileData = await resizeImage(fileData, 1024, 0.7);
                } catch (e) {
                    console.warn("Export sırasında resim küçültülemedi, orijinali kullanılıyor:", f.fileName);
                }
            }

            return {
                riskId: f.riskId,
                fileName: f.fileName,
                fileType: f.fileType,
                data: fileData instanceof Blob ? await blobToBase64(fileData) : ''
            };
        }));

        const exportData = { 
            formData: riskData.formData, 
            riskEkibi: riskData.riskEkibi, 
            riskler: riskData.riskler,
            files: filesExport
        };

        const url = URL.createObjectURL(new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' }));
        const a = document.createElement('a'); a.href = url; a.download = `risk_formu_${riskData.formData.tarih}.json`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (error) {
        console.error(error);
        showAlert("Hata", "Dışa aktarma başarısız oldu.");
    } finally {
        setIsExporting(false);
    }
  }, [riskData, showAlert]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
        try {
            const data = JSON.parse(ev.target?.result as string);
            if (data.formData) {
                showConfirmation({ title: 'İçe Aktar', message: 'Mevcut veriler ve fotoğraflar silinecek. Onaylıyor musunuz?', confirmText: 'Yükle', onConfirm: async () => {
                    try {
                        await DB.clearDB();
                        
                        riskData.setFormData(data.formData); 
                        riskData.setRiskEkibi(data.riskEkibi || []); 
                        riskData.setRiskler(data.riskler || []);

                        if (data.files && Array.isArray(data.files)) {
                            for (const f of data.files) {
                                if (f.data) {
                                    let fileObj = base64ToFile(f.data, f.fileName, f.fileType);
                                    
                                    // IMPORT SIRASINDA SIKIŞTIRMA (OPTIMIZASYON)
                                    // Eğer gelen dosya eskiyse ve büyükse, yüklerken hemen küçültelim.
                                    if (fileObj.type.startsWith('image/')) {
                                        try {
                                            fileObj = await resizeImage(fileObj, 1024, 0.7);
                                        } catch (e) {
                                            console.warn("Import sırasında resim küçültülemedi:", f.fileName);
                                        }
                                    }

                                    await DB.addFileToDB(f.riskId, fileObj);
                                }
                            }
                        }
                        // Increment data version to force child components to re-fetch data from DB
                        setDataVersion(prev => prev + 1);
                        showAlert("Başarılı", "Veriler ve fotoğraflar yüklendi. (Resimler optimize edildi)");
                    } catch (err) {
                        console.error(err);
                        showAlert("Hata", "Veritabanı yazma hatası.");
                    }
                }});
            }
        } catch { showAlert('Hata', 'Dosya bozuk veya okunamadı.'); }
    };
    reader.readAsText(file); e.target.value = '';
  };
  
  const handleReset = () => showConfirmation({ title: 'Sıfırla', message: 'Tüm veriler silinecek. API anahtarınız korunacak.', confirmText: 'Sıfırla', onConfirm: async () => { 
    await DB.clearDB(); 
    // Clear localStorage except API key
    const apiKey = localStorage.getItem('gemini_api_key');
    localStorage.clear(); 
    if (apiKey) {
      localStorage.setItem('gemini_api_key', apiKey);
    }
    window.location.reload(); 
  }});
  
  const handleOpenApiKeyModal = () => {
    setIsApiKeyModalOpen(true);
  };
  
  return (
    <>
      <InfoModal infoKey={activeInfoModal} onClose={() => setActiveInfoModal(null)} />
      
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        onSave={handleSaveApiKey}
        required={isInitialApiKeyCheck}
      />
      
      <ImagePreviewModal 
        fileRecord={previewData?.file ?? null} 
        title={previewData?.title ?? ''}
        onClose={() => setPreviewData(null)} 
        onDelete={async (id) => { await DB.deleteFileFromDB(id); if (previewData?.file) setDataVersion(prev => prev + 1); }} 
        showConfirmation={showConfirmation} 
      />

      <ConfirmationModal isOpen={modalState.isOpen} title={modalState.title} message={modalState.message} onConfirm={modalState.onConfirm} onCancel={hideModal} confirmText={modalState.confirmText} cancelText={modalState.cancelText} />

      <div className="p-2 md:p-4">
        <div className="print:hidden mb-4 flex flex-wrap gap-2 justify-end">
            <button onClick={handleOpenApiKeyModal} className="w-11 h-11 bg-blue-600 text-white rounded hover:bg-blue-700 flex justify-center items-center" title="API Anahtarı Ayarları"><IconKey /></button>
            <button onClick={handleReset} className="w-11 h-11 bg-red-600 text-white rounded hover:bg-red-700 flex justify-center items-center" title="Sıfırla"><IconRotateCcw /></button>
            <button onClick={handleExport} disabled={isExporting} className="w-11 h-11 bg-green-600 text-white rounded hover:bg-green-700 flex justify-center items-center disabled:opacity-50 disabled:cursor-wait" title="Yedek İndir (JSON)">
                {isExporting ? <IconLoader /> : <IconDownload />}
            </button>
            <label className="w-11 h-11 bg-yellow-600 text-white rounded hover:bg-yellow-700 cursor-pointer flex justify-center items-center" title="Yedek Yükle (JSON)"><IconUpload /><input type="file" className="hidden" accept=".json" onChange={handleImport}/></label>
            <PrintManager riskler={riskData.riskler} showAlert={showAlert} />
        </div>

        <div className="border-2 border-gray-800 p-4 md:p-6 bg-white shadow-lg rounded-lg relative">
            <span className="absolute top-1 left-2 text-[10px] text-gray-400 font-mono select-none print:hidden">v2.0</span>
            <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
              <h1 className="text-xl md:text-2xl font-bold mb-2">RİSK DEĞERLENDİRME FORMU</h1>
              <h2 className="text-base md:text-lg font-semibold text-gray-700">Fine-Kinney Yöntemi (Üniversite)</h2>
            </div>
            
            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Birim/Fakülte:</label>
                <div className="relative">
                    <input type="text" value={riskData.formData.birim} onChange={(e) => riskData.updateFormData('birim', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-3 text-sm pr-10"/>
                    <button onClick={() => toggleSpeech({ field: 'birim' })} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden"><IconMic isListening={speechTarget && 'field' in speechTarget && speechTarget.field === 'birim'}/></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tehlike Sınıfı:</label>
                <select value={riskData.formData.tehlikeSinifi} onChange={(e) => riskData.updateFormData('tehlikeSinifi', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-3 text-sm">
                  {['Az Tehlikeli', 'Tehlikeli', 'Çok Tehlikeli'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tarih:</label>
                <input type="date" value={riskData.formData.tarih} onChange={(e) => riskData.updateFormData('tarih', e.target.value)} className="w-full border border-gray-300 rounded px-3 py-3 text-sm"/>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 bg-gray-200 p-3 rounded flex justify-between items-center cursor-pointer" onClick={() => riskData.setIsEkipCollapsed(!riskData.isEkipCollapsed)}>
                <span className="flex items-center gap-2"><IconUsers /> RİSK EKİBİ</span>
                <button className="text-blue-600 hover:text-blue-800 p-1 print:hidden"><IconChevronUp isCollapsed={riskData.isEkipCollapsed} /></button>
              </h3>
              <div id="risk-ekibi-listesi" className={`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 ${riskData.isEkipCollapsed ? 'hidden' : ''}`}>
                {riskData.riskEkibi.map(uye => (
                  <div key={uye.id}>
                    <label className="block text-sm font-semibold mb-1">{uye.rol}:</label>
                    <div className="relative">
                        <input type="text" value={uye.adSoyad} onInput={(e) => riskData.updateEkip(uye.id, (e.target as HTMLInputElement).value)} placeholder={uye.placeholder} className="w-full border border-gray-300 rounded px-3 py-3 text-sm pr-10"/>
                        <button onClick={() => toggleSpeech({ id: uye.id, adSoyad: '' })} className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-blue-600 print:hidden"><IconMic isListening={!!(speechTarget && 'id' in speechTarget && speechTarget.id === uye.id)} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <RiskStats stats={riskData.stats} totalRisks={riskData.riskler.length} />
            
            <div className="mb-6">
                <h3 className="text-lg font-bold mb-3 bg-blue-900 text-white p-3 rounded flex flex-wrap justify-between items-center gap-2 print:hidden">
                    <span>RİSK TABLOSU</span>
                    <div className="flex gap-2">
                        <button onClick={handleDuplicateFirst} disabled={!riskData.riskler.length} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"><IconCopySmall /> Türet</button>
                        <button onClick={riskData.addRisk} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-2"><IconPlus /> Yeni Risk</button>
                    </div>
                </h3>
                <div className="space-y-4" ref={riskListRef}>
                    {riskData.riskler.map((risk, index) => (
                        <RiskCard
                            key={risk.id} risk={risk} riskIndex={riskData.riskler.length - index} birimAdi={riskData.formData.birim}
                            onUpdate={riskData.updateRisk} onRemove={riskData.removeRisk} onDuplicate={riskData.duplicateRisk} onToggleCollapse={riskData.toggleRiskCollapse}
                            onShowInfo={setActiveInfoModal} 
                            onPreviewImage={(file, title) => setPreviewData({ file, title })}
                            onToggleSpeech={toggleSpeech} activeSpeechTarget={speechTarget}
                            onUpdateScores={riskData.updateRiskScores} onUpdateMeasures={riskData.updateControlMeasures}
                            showConfirmation={showConfirmation} showAlert={showAlert}
                            alanSuggestions={riskData.alanSuggestions} isGeneratingAlanSuggestions={isGeneratingAlanSuggestions} onGenerateAlanSuggestions={generateAlanSuggestions}
                            dataVersion={dataVersion}
                        />
                    ))}
                </div>
            </div>

            <SummarySection 
                formData={riskData.formData} riskEkibi={riskData.riskEkibi} onUpdateFormData={riskData.updateFormData as any}
                onGenerateSummary={generateGeneralSummary} isGeneratingSummary={isGeneratingSummary} onShowInfo={setActiveInfoModal}
                onToggleSpeech={toggleSpeech} activeSpeechTarget={speechTarget}
            />
        </div>
      </div>
    </>
  );
};

export default App;
