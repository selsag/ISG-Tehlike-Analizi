
import React, { useState, useEffect } from 'react';
import { IconX, IconTrash, IconMaximize } from './Icons';
import { FileRecord, ModalState } from '../types';
import { bilgiIcerikleri } from '../constants';

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
