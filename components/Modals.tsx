
import React, { useState, useEffect } from 'react';
import { IconX, IconTrash, IconMaximize, IconRotateCcw, IconCopySmall, IconKey, IconExternalLink } from './Icons';
import { FileRecord, ModalState } from '../types';
import { bilgiIcerikleri } from '../constants';
import { hasSystemApiKey, validateApiKey } from '../services/ai';

interface InfoModalProps {
  infoKey: string | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ infoKey, onClose }) => {
  if (!infoKey) return null;
  const data = bilgiIcerikleri[infoKey as keyof typeof bilgiIcerikleri];
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4 print:hidden" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-h-[85vh] md:max-w-2xl max-w-full overflow-y-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-blue-900">{data.baslik}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IconX />
          </button>
        </div>
        <div className="space-y-2 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {Array.isArray(data.icerik) ? data.icerik.map((item, index) => <p key={index}>{item}</p>) : <p>{data.icerik}</p>}
        </div>
        <button onClick={onClose} className="mt-6 w-full px-4 py-3 text-base bg-blue-600 text-white rounded hover:bg-blue-700">
          Kapat
        </button>
      </div>
    </div>
  );
};

interface ImagePreviewModalProps {
    fileRecord: FileRecord | null;
    title: string;
    onClose: () => void;
    onDelete: (fileId: number) => Promise<void>;
    showConfirmation: (config: Omit<ModalState, 'isOpen'>) => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ fileRecord, title, onClose, onDelete, showConfirmation }) => {
    const [objectURL, setObjectURL] = useState<string | null>(null);

    useEffect(() => {
        if (fileRecord && fileRecord.fileData instanceof Blob) {
            const url = URL.createObjectURL(fileRecord.fileData);
            setObjectURL(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setObjectURL(null);
        }
    }, [fileRecord]);


    if (!fileRecord || !objectURL) return null;
    
    const handleDelete = () => {
        if (!fileRecord) return;
        showConfirmation({
            title: 'Dosyayı Sil',
            message: `'${fileRecord.fileName}' dosyasını kalıcı olarak silmek istediğinizden emin misiniz?`,
            confirmText: 'Sil',
            onConfirm: async () => {
                await onDelete(fileRecord.id);
                onClose();
            }
        });
    };

    const handleMaximize = () => {
        window.open(objectURL, '_blank');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[100] p-4 print:hidden" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-h-[95vh] md:max-w-4xl max-w-full overflow-hidden flex flex-col shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                
                {/* Close Button - Absolute Positioned */}
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-red-600 hover:bg-opacity-90 transition-all"
                    title="Kapat"
                >
                    <IconX className="w-5 h-5" />
                </button>

                {/* Body - Image */}
                <div className="flex-1 overflow-auto p-2 bg-gray-900 flex items-center justify-center">
                    <img src={objectURL} alt="Önizleme" className="object-contain max-w-full max-h-[80vh]" />
                </div>

                {/* Footer Bar */}
                <div className="flex-shrink-0 p-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center gap-3">
                    {/* Title replaces Filename */}
                    <span className="text-xs font-bold text-gray-800 truncate flex-1" title={title}>
                        {title}
                    </span>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={handleDelete} type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded hover:bg-red-700">
                            <IconTrash /> Sil
                        </button>
                        <button onClick={handleMaximize} type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700">
                            <IconMaximize /> Tam Boyut
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Onayla', cancelText }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[200] p-4 print:hidden" onClick={onCancel}>
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
                    <div className="text-sm text-gray-600 leading-relaxed">{message}</div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end items-center gap-3 rounded-b-lg">
                    {cancelText && (
                         <button onClick={onCancel} className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                            {cancelText}
                        </button>
                    )}
                    <button onClick={onConfirm} className={`px-4 py-2 text-sm font-semibold text-white rounded-md ${confirmText === 'Sil' || confirmText === 'Evet, Sıfırla' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

interface PromptEditorModalProps {
    isOpen: boolean;
    currentPrompt: string;
    defaultPrompt: string;
    variableHelpText: string;
    onSave: (newPrompt: string) => void;
    onClose: () => void;
}

export const PromptEditorModal: React.FC<PromptEditorModalProps> = ({ isOpen, currentPrompt, defaultPrompt, variableHelpText, onSave, onClose }) => {
    const [text, setText] = useState(currentPrompt);

    useEffect(() => {
        setText(currentPrompt);
    }, [currentPrompt, isOpen]);

    if (!isOpen) return null;

    const handleReset = () => {
        if (window.confirm('Prompt varsayılan ayarlara dönecek. Onaylıyor musunuz?')) {
            setText(defaultPrompt);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[250] p-4 print:hidden" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">AI Prompt Düzenleyici</h3>
                        <p className="text-xs text-gray-500">Yapay zekanın nasıl çalışacağını buradan özelleştirebilirsiniz.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><IconX /></button>
                </div>
                
                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="mb-3 bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-800">
                        <strong>Kullanılabilir Değişkenler:</strong> {variableHelpText}
                        <br/>
                        Bu değişkenler AI çalıştırılırken formdaki gerçek verilerle değiştirilecektir.
                    </div>
                    <textarea 
                        className="w-full h-[300px] border border-gray-300 rounded p-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none bg-gray-50"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        spellCheck={false}
                    />
                     <div className="mt-2 text-xs text-red-600">
                        * JSON formatı ile ilgili talimatları (varsa) silmemeye özen gösterin, aksi takdirde uygulama yanıtı işleyemeyebilir.
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center rounded-b-lg">
                    <button 
                        onClick={handleReset} 
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100"
                    >
                        <IconRotateCcw /> Varsayılan
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">
                            İptal
                        </button>
                        <button onClick={() => { onSave(text); onClose(); }} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">
                            Kaydet ve Kullan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState('');
    const [hasSystemKey, setHasSystemKey] = useState(false);
    const [validating, setValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const savedKey = localStorage.getItem('user_gemini_api_key');
            if (savedKey) setApiKey(savedKey);
            setHasSystemKey(hasSystemApiKey());
            setValidationError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setValidationError(null);
        const trimmed = apiKey.trim();
        // If empty, remove custom key and close (system key will be used if present)
        if (!trimmed) {
            localStorage.removeItem('user_gemini_api_key');
            onClose();
            return;
        }

        setValidating(true);
        try {
            const res = await validateApiKey(trimmed);
            if (res.valid) {
                localStorage.setItem('user_gemini_api_key', trimmed);
                onClose();
            } else {
                if (res.transient) {
                    setValidationError('Doğrulama sırasında ağ veya servis hatası oluştu. Lütfen tekrar deneyin.');
                } else {
                    setValidationError('Girilen anahtar geçersiz veya yetkisiz. Lütfen anahtarı kontrol edin.');
                }
            }
        } catch (e) {
            setValidationError('Anahtar doğrulama sırasında beklenmeyen bir hata oluştu.');
        } finally {
            setValidating(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Kayıtlı kişisel anahtarınız silinecek. Onaylıyor musunuz?")) {
            localStorage.removeItem('user_gemini_api_key');
            setApiKey('');
            setValidationError(null);
            onClose();
        }
    };

    const isUsingCustomKey = apiKey.trim().length > 0;
    const isUsingSystemKey = !isUsingCustomKey && hasSystemKey;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[300] p-4 print:hidden" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded text-blue-600"><IconKey /></div>
                    <h3 className="text-lg font-bold text-gray-800">Google Gemini API Anahtarı</h3>
                </div>
                
                <div className="p-6 space-y-4">
                     {/* Status Badge */}
                     <div className={`p-3 rounded border text-sm font-semibold flex items-center gap-2 
                        ${isUsingCustomKey ? 'bg-green-50 border-green-200 text-green-700' : 
                          isUsingSystemKey ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                          'bg-red-50 border-red-200 text-red-700'}`}>
                        {isUsingCustomKey ? (
                            <><span>✅</span> Aktif: Kişisel Anahtarınız Kullanılıyor</>
                        ) : isUsingSystemKey ? (
                            <><span>🔹</span> Aktif: Sistem Anahtarı Kullanılıyor</>
                        ) : (
                            <><span>⚠️</span> Durum: Geçerli bir anahtar bulunamadı</>
                        )}
                    </div>

                    <p className="text-sm text-gray-600">
                        AI özelliklerini kullanabilmek için Google Gemini API anahtarınızı girin. 
                        Anahtarınız tarayıcınızda güvenli bir şekilde saklanacaktır.
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <h4 className="text-xs font-bold text-blue-800 mb-2 flex items-center gap-1"><IconKey className="w-3 h-3"/> API Anahtarı Nasıl Alınır?</h4>
                        <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                            <li><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-blue-900">Google AI Studio</a>'ya gidin <IconExternalLink/></li>
                            <li>"Get API Key" butonuna tıklayın</li>
                            <li>Ücretsiz API anahtarınızı oluşturun</li>
                            <li>Anahtarı kopyalayıp aşağıya yapıştırın</li>
                        </ol>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">API Anahtarı <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            className="w-full border-2 border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                            placeholder={hasSystemKey ? "Boş bırakırsanız sistem anahtarı kullanılır..." : "AIzaSy..."}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                        {hasSystemKey && apiKey.trim() === '' && (
                            <p className="text-xs text-gray-500 mt-1">Sistemde tanımlı bir anahtar var. Kendi anahtarınızı girerseniz sistem anahtarı devre dışı kalır.</p>
                        )}
                        {validationError && (
                            <p className="text-xs text-red-600 mt-2">{validationError}</p>
                        )}
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start gap-2">
                        <span className="text-yellow-600 text-lg">⚠️</span>
                        <p className="text-xs text-yellow-800 pt-1">
                            <strong>Güvenlik Notu:</strong> API anahtarınız sadece kendi tarayıcınızda (Local Storage) saklanır ve hiçbir sunucuya gönderilmez.
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center gap-2 rounded-b-lg">
                    <div>
                        {isUsingCustomKey && (
                            <button 
                                onClick={handleReset} 
                                className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                title="Kayıtlı anahtarı sil ve sistem varsayılanına dön"
                            >
                                <IconRotateCcw /> {hasSystemKey ? 'Sistem Anahtarına Dön' : 'Anahtarı Sil'}
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800">
                            İptal
                        </button>
                        <button onClick={handleSave} disabled={validating} className={`px-6 py-2 text-sm font-semibold text-white rounded ${validating ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {validating ? 'Doğrulanıyor...' : 'Kaydet'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
