
import { GoogleGenAI, Type } from "@google/genai";
import { FormData as FormData_Type, Risk } from '../types';
import { DEFAULT_ALAN_SUGGESTIONS, tehlikeVeriYapisi } from '../constants';
import { blobToBase64 } from '../utils/helpers';

// --- PROMPT TEMPLATES ---

export const DEFAULT_HAZARD_PROMPT_TEMPLATE = `Sen tecrübeli bir İş Güvenliği Uzmanısın. Aşağıdaki bağlama uygun potansiyel tehlikeleri belirlemen gerekiyor.

BAĞLAM:
- Birim: {birim}
- Alan: {alan}
- Faaliyet: {faaliyet}
- Tehlike Kategorisi: {tehlikeKategorisi}

GÖREV:
Bu kategoride, bu alanda ve bu faaliyet sırasında oluşabilecek, MEVCUT LİSTEDE OLMAYAN 7 adet spesifik tehlike durumu cümlesi yaz.
Cümleler bir tehlikeyi veya risk kaynağını açıkça belirtmeli. (Örn: "Kabloların dağınık olması", "Havalandırmanın yetersizliği" gibi).

MEVCUT LİSTE (Bunları tekrar etme):
{mevcutListe}

Yanıtı JSON formatında ver: {"suggestions": ["tehlike açıklaması 1", "tehlike açıklaması 2"]}`;

export const DEFAULT_MEASURES_PROMPT_TEMPLATE = `Sen bir İSG Uzmanısın. Aşağıda belirtilen risk için "Risk Kontrol Hiyerarşisi"ne (Hierarchy of Controls) uygun, üniversite ortamında uygulanabilir, somut ve teknik önlemler öner.

RİSK BİLGİSİ:
- Alan: {alan}
- Tehlike: {tehlike}

HİYERARŞİ ADIMLARI VE BEKLENEN İÇERİK:
1. Eliminasyon (Yok Etme): Tehlikeyi tamamen ortadan kaldıran kökten çözüm.
2. İkame (Yerine Koyma): Tehlikeli olanı daha az tehlikeli ile değiştirme.
3. Mühendislik Önlemleri: Toplu koruma, teknik donanım, sensör, bariyer, havalandırma vb.
4. İdari Önlemler: Eğitim, talimat, işaretleme, rotasyon, bakım planları.
5. KKD (Kişisel Koruyucu Donanım): Kişiye yönelik koruyucu ekipmanlar.

KURALLAR:
- Her başlık için en az 1-2 cümlelik, uygulanabilir, net öneriler yaz.
- "Gerekli önlemler alınmalı" gibi yuvarlak laflar etme. "Kaydırmaz bant yapıştırılmalı" gibi net konuş.
- ÖNEMLİ: Her önerinin sonuna, ilgili Türk İSG Yönetmeliğine ve maddesine minimal bir atıf ekle (parantez içinde).
  Örnek: (İş Ekipmanları Yön. Md. 5) veya (Binaların Yangından Korunması Yön. Md. 21).
- Çıktıyı tam olarak aşağıdaki XML benzeri etiket formatında ver (Parse edeceğim):

<eliminasyon>...</eliminasyon>
<ikame>...</ikame>
<muhendislik>...</muhendislik>
<idari>...</idari>
<kkd>...</kkd>`;

export const DEFAULT_SUMMARY_PROMPT_TEMPLATE = `Sen uzman bir Baş Denetçisin. Bir üniversitenin "{birim}" birimi için yapılan İş Sağlığı ve Güvenliği Risk Değerlendirmesi raporunun "SONUÇ VE GENEL DEĞERLENDİRME" bölümünü yazıyorsun.

BİRİM BİLGİLERİ:
- Birim Adı: {birim}
- Tehlike Sınıfı: {tehlikeSinifi}
- Toplam Tespit Edilen Risk Sayısı: {riskSayisi}

TESPİT EDİLEN RİSKLERİN DETAYLARI:
{riskDetaylari}

GÖREVİN:
Yönetime sunulacak, resmi, teknik ve profesyonel bir dille yazılmış kapsamlı bir özet metni oluştur.

METİN İÇERİĞİ ŞUNLARI KAPSAMALIDIR:
1. **Giriş:** Çalışmanın amacı ve kapsamı.
2. **Genel Durum Analizi:** Birimde öne çıkan temel risk alanları nelerdir? (Örn: Elektrik altyapısı mı kötü, yoksa ergonomik sorunlar mı ağırlıkta?)
3. **Öncelikli Aksiyonlar:** Acilen müdahale edilmesi gereken "Yüksek" veya "Önemli" riskler varsa vurgula.
4. **Öneriler ve Sonuç:** İyileştirme önerilerinin genel çerçevesi ve İSG kültürüne katkısı.

KURALLAR:
- "Merhaba", "İşte özetiniz" gibi sohbet ifadeleri KULLANMA. Doğrudan rapor metnini yaz.
- Maddeler halinde değil, akıcı paragraflar halinde yaz (veya gerekirse çok önemli yerleri maddeleyebilirsin ama bütünlük bozulmasın).
- Yaklaşık 300-500 kelime uzunluğunda olsun.`;

// --- API & HELPERS ---

export const getApiKey = (): string => {
    // 1. Kullanıcı tarafından girilen Key (LocalStorage)
    if (typeof localStorage !== 'undefined') {
        const localKey = localStorage.getItem('user_gemini_api_key');
        if (localKey && localKey.trim() !== '') {
            return localKey.trim();
        }
    }

    // 2. Mevcut Platform (Otomatik Enjeksiyon)
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
        return process.env.API_KEY;
    }
    
    // 3. Lokal Geliştirme (Vite .env Desteği)
    try {
        // @ts-ignore
        if (import.meta && import.meta.env && import.meta.env.VITE_API_KEY) {
            // @ts-ignore
            return import.meta.env.VITE_API_KEY;
        }
    } catch (e) {}
    
    return '';
};

export const hasSystemApiKey = (): boolean => {
    // Check Env
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) return true;
    // Check Vite Env
    try {
        // @ts-ignore
        if (import.meta && import.meta.env && import.meta.env.VITE_API_KEY) return true;
    } catch (e) {}
    return false;
};

// Error Detection Helper
export const isAuthOrQuotaError = (error: any): boolean => {
    const msg = error?.toString().toLowerCase() || '';
    
    // Sadece kesin yetki ve kota hatalarını kontrol et.
    // 400 (Bad Request) her zaman API Key hatası değildir, bazen prompt hatasıdır.
    // Bu yüzden '400'ü çıkardık, sadece spesifik 'API_KEY_INVALID' gibi durumları veya 403/429'u yakalıyoruz.
    
    if (msg.includes('403') || msg.includes('429')) return true;
    
    if (msg.includes('api_key') || msg.includes('apikey') || msg.includes('quota') || msg.includes('permission_denied')) return true;

    return false;
};

const getAI = () => new GoogleGenAI({ apiKey: getApiKey() });

export const fetchAlanSuggestions = async (birim: string): Promise<string[]> => {
    const ai = getAI();
    const prompt = `Sen deneyimli bir Üniversite İş Sağlığı ve Güvenliği (İSG) Uzmanısın. 
Şu anda "${birim}" biriminde/fakültesinde risk değerlendirmesi yapıyoruz.

Görevin: Bu birimde bulunması muhtemel, ancak aşağıdaki "MEVCUT LİSTE" içinde yer almayan, 5 adet spesifik ve o birime özgü alan/bölüm/oda ismi önermektir.

MEVCUT LİSTE (Bunları ASLA tekrar önerme):
${JSON.stringify(DEFAULT_ALAN_SUGGESTIONS)}

KURALLAR:
1. Önerilerin bu birimin (Fakülte/Yüksekokul) akademik veya idari yapısına uygun olmalı (Örn: Laboratuvar isimleri, Atölyeler, Özel çalışma odaları, Arşiv tipleri vb.).
2. Sadece mekan isimleri ver, açıklama yapma.
3. Yanıtı sadece geçerli bir JSON formatında ver.

İstenen JSON Formatı:
{"alanlar": ["Önerilen Alan 1", "Önerilen Alan 2", ...]}
`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    alanlar: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        }
    });

    const jsonResponse = JSON.parse(response.text.trim());
    return [...new Set([...DEFAULT_ALAN_SUGGESTIONS, ...((jsonResponse.alanlar as string[]) || [])])];
};

export const fetchGeneralSummary = async (formData: FormData_Type, riskler: Risk[], customTemplate?: string): Promise<string> => {
    const ai = getAI();
    
    // Riskleri özet için sadeleştir (token tasarrufu ve odaklanma)
    const simplifiedRisks = riskler.map(r => ({
        alan: r.alan,
        tehlike: r.tehlikeAciklama,
        riskSeviyesi: r.riskSeviye,
        riskSkoru: r.riskSkoru,
        onlemler: r.onerilecekOnlemler
    }));

    let prompt = customTemplate || DEFAULT_SUMMARY_PROMPT_TEMPLATE;
    prompt = prompt
        .replace('{birim}', formData.birim)
        .replace('{tehlikeSinifi}', formData.tehlikeSinifi)
        .replace('{riskSayisi}', riskler.length.toString())
        .replace('{riskDetaylari}', JSON.stringify(simplifiedRisks.slice(0, 30), null, 2));

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text;
};

export const fetchFaaliyetSuggestions = async (birim: string, alan: string): Promise<string[]> => {
    const ai = getAI();
    const prompt = `
Sen bir İSG Uzmanısın. 
Birim: "${birim}"
Alan/Bölüm: "${alan}"

Bu alanda gerçekleştirilen tipik işleri, süreçleri ve faaliyetleri düşün.
Risk değerlendirmesine konu olabilecek 15 adet tekil faaliyet/iş listesi oluştur.

Örnekler: "Projeksiyon cihazı kullanımı", "Kimyasal taşıma", "Sınav kağıdı okuma", "Zemin temizliği", "Pencere açma/kapama" gibi somut işler olsun.

Yanıtı JSON formatında ver: {"activities": ["faaliyet 1", "faaliyet 2"]}
`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { activities: { type: Type.ARRAY, items: { type: Type.STRING } } } }
        }
    });
    const json = JSON.parse(response.text.trim());
    return json.activities || [];
};

export const fetchHazardSuggestions = async (birim: string, risk: Risk, customTemplate?: string): Promise<string[]> => {
    const ai = getAI();
    const existingHazards = tehlikeVeriYapisi[risk.tehlike]?.aciklamaListesi || [];
    
    // Use custom template if provided, otherwise default
    let prompt = customTemplate || DEFAULT_HAZARD_PROMPT_TEMPLATE;

    // Replace placeholders with actual values
    prompt = prompt
        .replace('{birim}', birim)
        .replace('{alan}', risk.alan)
        .replace('{faaliyet}', risk.faaliyet)
        .replace('{tehlikeKategorisi}', risk.tehlike)
        .replace('{mevcutListe}', JSON.stringify(existingHazards));

    // Ensure JSON instruction exists if user accidentally deleted it in custom prompt
    if (!prompt.includes('JSON')) {
        prompt += '\n\nÖNEMLİ: Yanıtı sadece şu JSON formatında ver: {"suggestions": ["öneri 1", "öneri 2"]}';
    }
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: { type: Type.OBJECT, properties: { suggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } }
        }
    });
    const json = JSON.parse(response.text.trim());
    return json.suggestions || [];
};

export const analyzeImageHazards = async (file: File, mimeType: string): Promise<string> => {
    const ai = getAI();
    const base64Data = await blobToBase64(file);
    
    const prompt = `
Sen uzman bir İSG Denetçisisin. Sana bir üniversite/iş yeri ortamından çekilmiş bir fotoğraf gönderildi.
Bu fotoğrafı iş sağlığı ve güvenliği (İSG) perspektifiyle detaylıca analiz et.

GÖREVİN:
Fotoğrafta görülen potansiyel tehlikeleri, riskleri ve uygunsuzlukları (güvensiz durum ve davranışları) tespit et.
Sadece bariz olanları değil, dikkatli bakıldığında görülebilecek detayları da yakala (örn: ergonomi, elektrik güvenliği, yangın riski, düzen-tertip, KKD eksikliği vb.).

ÇIKTI FORMATI:
Tespitlerini maddeler halinde, net ve anlaşılır cümlelerle yaz. Her madde bir tehlikeyi belirtsin.
Giriş/gelişme cümlelerine gerek yok, doğrudan tespitlerini sırala.

Örnek:
- Yerde takılma tehlikesi oluşturan dağınık kablolar mevcut.
- Yangın dolabının önü kolilerle kapatılmış.
- Personel baret takmadan çalışıyor.
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }, { inlineData: { mimeType, data: base64Data } }] },
    });
    return response.text;
};

export const fetchRiskScores = async (risk: Risk, birim: string): Promise<{ olasilik: number, siddet: number, siklik: number, gerekce: string }> => {
    const ai = getAI();
    
    const prompt = `
Sen bir İSG Uzmanısın. Aşağıdaki tehlike durumunu "Fine-Kinney Risk Değerlendirme Metodu"na göre puanlamanı istiyorum.

DURUM:
- Birim: ${birim}
- Alan: ${risk.alan}
- Tehlike Açıklaması: "${risk.tehlikeAciklama}"

Fine-Kinney Skalaları (Buna Sadık Kal):
1. OLASILIK (P): 0.2, 0.5, 1, 3, 6, 10 (10=Beklenir, 0.2=Beklenmez)
2. ŞİDDET (D): 1, 3, 7, 15, 40, 100 (100=Birden çok ölüm, 1=Hafif Yaralanma)
3. SIKLIK (F): 0.5, 1, 2, 3, 6, 10 (10=Sürekli, 0.5=Çok Nadir)

GÖREV:
Bu tehlikenin gerçekleşme olasılığını, gerçekleşirse yaratacağı şiddeti ve tehlikeye maruz kalma sıklığını analiz et.
Mantıklı ve gerçekçi bir puanlama yap.

Yanıtı JSON formatında ver:
{
  "olasilik": number,
  "siddet": number,
  "siklik": number,
  "gerekce": "Neden bu puanları verdiğini açıklayan kısa, ikna edici bir cümle."
}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { 
            responseMimeType: "application/json", 
            responseSchema: { 
                type: Type.OBJECT, 
                properties: { 
                    olasilik: { type: Type.NUMBER }, 
                    siddet: { type: Type.NUMBER }, 
                    siklik: { type: Type.NUMBER }, 
                    gerekce: { type: Type.STRING } 
                } 
            } 
        }
    });
    return JSON.parse(response.text.trim());
};

export const fetchControlMeasuresStream = async (risk: Risk, customTemplate?: string) => {
    const ai = getAI();
    
    let prompt = customTemplate || DEFAULT_MEASURES_PROMPT_TEMPLATE;
    prompt = prompt
        .replace('{alan}', risk.alan)
        .replace('{tehlike}', risk.tehlikeAciklama);

    return ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: prompt });
};

export const fetchResponsibleUnit = async (risk: Risk): Promise<string> => {
    const ai = getAI();
    
    const prompt = `
Sen bir üniversitenin idari yapısını bilen bir uzmansın.
Aşağıdaki İSG riskini/arızasını gidermekten sorumlu olması en muhtemel idari birimi veya teknik servisi belirle.

Tehlike: "${risk.tehlikeAciklama}"
Alan: "${risk.alan}"

Örnekler:
- Elektrik, su, bina hasarı -> Yapı İşleri ve Teknik Daire Başkanlığı
- Temizlik, taşıma -> İdari ve Mali İşler / Destek Hizmetleri
- Bilgisayar, ağ -> Bilgi İşlem Daire Başkanlığı
- Laboratuvar cihazı -> İlgili Bölüm Başkanlığı / Dekanlık

Sadece tek bir birim adı öner.

Yanıtı JSON olarak ver: {"sorumlu": "Birim Adı"}
`;

    const response = await ai.models.generateContent({ 
        model: 'gemini-2.5-flash', 
        contents: prompt, 
        config: { 
            responseMimeType: "application/json", 
            responseSchema: { 
                type: Type.OBJECT, 
                properties: { sorumlu: { type: Type.STRING } } 
            } 
        } 
    });
    const result = JSON.parse(response.text.trim());
    return result.sorumlu;
};

// Lightweight API key validation. Returns { valid, error, transient }
export const validateApiKey = async (candidateKey: string): Promise<{ valid: boolean; error?: string; transient?: boolean }> => {
    const trimmed = String(candidateKey || '').trim();
    if (!trimmed) return { valid: false, error: 'empty' };

    try {
        const ai = new GoogleGenAI({ apiKey: trimmed });
        // Small prompt to validate the key without consuming many tokens
        await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: 'Bu istek sadece anahtar doğrulaması içindir. Kısa bir cevap veriniz: "ok"' });
        return { valid: true };
    } catch (err: any) {
        // If it's likely an auth/quota/permission issue, mark as non-transient
        const transient = !isAuthOrQuotaError(err);
        return { valid: false, error: err?.toString ? err.toString() : 'unknown_error', transient };
    }
};
