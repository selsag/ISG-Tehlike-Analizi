# Üniversite Risk Değerlendirme Formu (Fine-Kinney)

Bu proje, üniversiteler ve iş yerleri için **Fine-Kinney** metodolojisine uygun, Google Gemini yapay zeka modelleri ile güçlendirilmiş, interaktif bir risk değerlendirme ve raporlama web uygulamasıdır.

## ✨ Özellikler

- **🤖 AI Destekli Analiz:**
  - **Fotoğraf Analizi:** Yüklenen ortam fotoğraflarındaki tehlikeleri otomatik tespit eder.
  - **Akıllı Puanlama:** Tehlike tanımına göre Olasılık, Şiddet ve Sıklık değerlerini önerir.
  - **Önlem Önerileri:** Risk Kontrol Hiyerarşisine (Eliminasyon, İkame, Mühendislik vb.) uygun teknik önlemler üretir.
  - **Sorumlu Birim Atama:** Riskin türüne göre üniversite/kurum içi sorumlu birimi tahmin eder.
- **📄 Profesyonel Raporlama:**
  - Yazıcı dostu A4 çıktı formatı.
  - Akıllı sayfa yapısı (Bölünmeyen risk kartları).
  - Otomatik oluşturulan fotoğraf ekleri sayfası (Her sayfada 2 fotoğraf düzeni).
- **🎙️ Sesli Komut:** Form alanlarını sesli dikte (Speech-to-Text) ile doldurma imkanı.
- **💾 Veri Yönetimi:**
  - Tarayıcı üzerinde yerel kayıt (IndexedDB).
  - JSON formatında proje yedekleme (Dışa Aktar) ve geri yükleme (İçe Aktar).

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

### 1. Ön Gereksinimler

- [Node.js](https://nodejs.org/) (v18 veya üzeri önerilir)
- npm veya yarn paket yöneticisi

### 2. Projeyi İndirin

Terminal veya komut satırını açarak projeyi klonlayın ve proje dizinine gidin:

```bash
git clone https://github.com/kullaniciadi/proje-adi.git
cd proje-adi
```

### 3. Bağımlılıkları Yükleyin

```bash
npm install
# veya
yarn install
```

### 4. 🔑 API Anahtarı Yapılandırması (ÖNEMLİ)

Uygulamanın AI özelliklerinin çalışabilmesi için geçerli bir **Google Gemini API** anahtarına ihtiyacınız vardır.

1.  [Google AI Studio](https://aistudio.google.com/) adresine gidin ve ücretsiz bir API anahtarı (API Key) oluşturun.
2.  Projenin ana dizininde (package.json dosyasının olduğu yer) `.env` adında yeni bir dosya oluşturun.
3.  `.env` dosyasının içine aşağıdaki satırı ekleyin ve kendi anahtarınızı kullanın:

```env
VITE_API_KEY=your_api_key_here
```

> ⚠️ **Uyarı:** `.env` dosyanızı asla GitHub'a yüklemeyin veya başkalarıyla paylaşmayın. Projedeki `.gitignore` dosyası bu dosyanın yüklenmesini otomatik olarak engeller.

### 5. Uygulamayı Başlatın

Geliştirme sunucusunu başlatmak için:

```bash
npm run dev
```

Terminalde verilen yerel adrese (genellikle `http://localhost:5173`) tarayıcınızdan gidin.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React 19, TypeScript, Vite
- **UI:** Tailwind CSS, Lucide React Icons
- **AI:** Google GenAI SDK (Gemini 2.5 Flash & Pro Models)
- **Veritabanı:** IndexedDB (Local Data Persistence)
- **Ses:** Web Speech API

## 📝 Lisans

Bu proje MIT lisansı altında sunulmaktadır.