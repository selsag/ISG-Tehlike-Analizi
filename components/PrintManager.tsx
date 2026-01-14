
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IconLoader, IconPrinter } from './Icons';
import { Risk } from '../types';
import * as DB from '../services/db';

interface PrintManagerProps {
    riskler: Risk[];
    showAlert: (title: string, message: React.ReactNode) => void;
}

const PrintManager: React.FC<PrintManagerProps> = ({ riskler, showAlert }) => {
    const [isPrinting, setIsPrinting] = useState(false);
    const [printPhotoData, setPrintPhotoData] = useState<{url: string, caption: string}[]>([]);

    const handlePrint = async () => {
        setIsPrinting(true);
        try {
            const photoData: {url: string, caption: string}[] = [];
            
            // Riskleri ID'ye göre sırala
            const sortedRisks = [...riskler].sort((a, b) => a.id - b.id);

            for (const risk of sortedRisks) {
                const files = await DB.getFilesForRisk(risk.id);
                const imageFiles = files.filter(f => f.fileType.startsWith('image/'));
                
                if (imageFiles.length > 0) {
                    const displayIndex = sortedRisks.findIndex(r => r.id === risk.id) + 1;
                    
                    for (const [i, file] of imageFiles.entries()) {
                         if (file.fileData instanceof Blob) {
                            const riskTitle = risk.tehlike ? risk.tehlike.split('(')[0].trim() : 'Tehlike Belirtilmemiş';
                            const alanInfo = risk.alan ? risk.alan : 'Alan Belirtilmemiş';
                            
                            // Detaylı başlık formatı
                            const caption = `RİSK #${displayIndex} | Alan: ${alanInfo} | Tehlike: ${riskTitle} ${imageFiles.length > 1 ? `(${i + 1}/${imageFiles.length})` : ''}`;
                            
                            photoData.push({ 
                                url: URL.createObjectURL(file.fileData), 
                                caption: caption
                            });
                        }
                    }
                }
            }
            
            // Görsellerin yüklenmesini bekle
            await Promise.all(photoData.map(p => new Promise<void>(r => { 
                const i = new Image(); 
                i.onload=()=>r(); 
                i.onerror=()=>r(); 
                i.src=p.url; 
            })));
            
            setPrintPhotoData(photoData);
            
            // DOM render olması için kısa bir süre tanı
            setTimeout(() => { window.print(); }, 500);
            
        } catch (error) { 
            setIsPrinting(false); 
            console.error(error);
            showAlert("Yazdırma Hatası", "Rapor fotoğrafları hazırlanırken bir hata oluştu."); 
        }
    };

    useEffect(() => {
        if (isPrinting) {
            const afterPrint = () => { 
                // Temizlik
                printPhotoData.forEach(p => URL.revokeObjectURL(p.url)); 
                setPrintPhotoData([]); 
                setIsPrinting(false); 
            };
            window.addEventListener('afterprint', afterPrint);
            return () => window.removeEventListener('afterprint', afterPrint);
        }
    }, [isPrinting, printPhotoData]);

    // Fotoğrafları 2'li gruplara ayır (Her sayfa için)
    const pages = [];
    for (let i = 0; i < printPhotoData.length; i += 2) {
        pages.push(printPhotoData.slice(i, i + 2));
    }

    return (
        <>
            <button onClick={handlePrint} disabled={isPrinting} className="flex items-center justify-center w-11 h-11 bg-blue-600 text-white rounded hover:bg-blue-700 print:hidden" title="Yazdır / PDF Kaydet">
                {isPrinting ? <IconLoader/> : <IconPrinter />}
            </button>
            
            {/* 
                PORTAL KULLANIMI:
                Yazdırma sırasında sayfa sonuna eklenen fotoğraf eki.
                'print:block' yazıcıda görünür yapar.
            */}
            {isPrinting && printPhotoData.length > 0 && createPortal(
                <div id="photo-appendix" className="print:block fixed w-0 h-0 overflow-hidden">
                    {pages.map((pagePhotos, pageIndex) => (
                        <div key={pageIndex} style={{ 
                            pageBreakAfter: 'always', 
                            height: '100vh', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            padding: '10mm',
                            boxSizing: 'border-box'
                        }}>
                            {/* Sadece ilk sayfada ana başlık */}
                            {pageIndex === 0 && (
                                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 border-b-2 border-gray-800 pb-2 flex-shrink-0">
                                    FOTOĞRAF EKLERİ
                                </h2>
                            )}

                            {/* Sayfa içeriği kapsayıcısı - Kalan dikey alanı doldurur */}
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5mm' }}>
                                {pagePhotos.map((photo, photoIndex) => (
                                    <div key={photoIndex} style={{ 
                                        flex: 1, // Mevcut alanı eşit paylaş (2 fotoğraf varsa %50, 1 varsa %100)
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        border: '1px solid #ccc', 
                                        borderRadius: '4px',
                                        padding: '5px',
                                        // Eğer sayfada 2 fotoğraf varsa, her birinin maksimum yüksekliği yaklaşık %50 olsun
                                        // Ancak flex:1 bunu zaten halleder. 
                                        minHeight: 0 // Flex child scroll/overflow fix
                                    }}>
                                        <div className="bg-gray-100 p-2 mb-1 rounded border-b border-gray-200 text-xs font-bold text-gray-800 text-center flex-shrink-0">
                                            {photo.caption}
                                        </div>
                                        
                                        {/* Resim Kapsayıcısı: Absolute positioning ile tam sığdırma */}
                                        <div style={{ 
                                            flex: 1, 
                                            position: 'relative', 
                                            width: '100%', 
                                            minHeight: 0 
                                        }}>
                                            <img 
                                                src={photo.url} 
                                                alt="Risk Fotoğrafı" 
                                                style={{ 
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%', 
                                                    height: '100%', 
                                                    objectFit: 'contain', // En-boy oranını bozmadan sığdır
                                                    display: 'block'
                                                }} 
                                            />
                                        </div>
                                    </div>
                                ))}
                                {/* Eğer sayfada tek fotoğraf varsa ve sayfanın yarısını boş bırakmak istiyorsak (2'li ızgara görünümünü korumak için) */}
                                {pagePhotos.length === 1 && (
                                     <div style={{ flex: 1 }}></div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </>
    );
};

export default PrintManager;
