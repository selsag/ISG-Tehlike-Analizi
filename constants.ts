
export const DEFAULT_ALAN_SUGGESTIONS = [
    'Derslik', 'Amfi', 'Kütüphane/Okuma Salonu', 'Öğrenci Kantini', 'İdari Ofisler', 
    'Toplantı Salonu', 'Mescit', 'Arşiv Odası', 'Fotokopi Odası', 'WC/Lavabolar', 'Koridorlar'
];

export const tehlikeVeriYapisi: { [key: string]: any } = {
    '': { 
        aciklamaListesi: ['Lütfen önce bir tehlike türü seçin'],
        dinamikOrnekler: {
            eliminasyon: 'Uygulanacak önlemi açıklayın...',
            ikame: 'Uygulanacak önlemi açıklayın...',
            muhendislik: 'Uygulanacak önlemi açıklayın...',
            idari: 'Uygulanacak önlemi açıklayın...',
            kkd: 'Uygulanacak önlemi açıklayın...'
        }
    },
    'Kayma, Takılma, Düşme, Düzensizlik (Zemin, Merdiven, Koridor)': {
        aciklamaListesi: [
            'Kaygan/ıslak zemin (Yemekhane, WC, Bina Girişi)', 
            'Hasarlı/kırık/yerinden oynamış zemin kaplaması (Karo, Parke)', 
            'Yerde sabitlenmemiş kablolar (Ofis, Derslik, Bilgisayar Lab.)', 
            'Halı/paspas kenarları kalkık/sabitlenmemiş', 
            'Seviye farkı/eşik (işaretlenmemiş)', 
            'Merdiven basamakları kaymaz değil/yıpranmış', 
            'Merdiven/platformda korkuluk/tırabzan eksikliği veya standart dışı olması', 
            'Geçiş yollarında/koridorlarda engeller/malzemeler',
            'Düzensiz çalışma alanı, dağınıklık, malzeme istifi (Atölye, Depo)',
            'Kütüphane/Arşivde sabitlenmemiş yüksek raflar (Devrilme riski)',
            'Dolap, pano vb. ekipmanların duvara sabitlenmemesi (Deprem riski)',
            'Açık alanlarda bozuk kaldırım, çukur, mazgal sorunu',
            'Islak zemin uyarı levhası kullanılmıyor/yetersiz'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Yerdeki kablo ihtiyacını (kablosuz cihaza geçerek) ortadan kaldırmak.',
            ikame: 'Kaygan zemin kaplamasını, kaydırmazlığı yüksek malzeme ile değiştirmek.',
            muhendislik: 'Zemine sabit kablo kanalı/rampas, kaydırmaz bant (merdiven), korkuluk yapılması.',
            idari: 'Uyarı levhası (\'Dikkat Kaygan Zemin\'), temizlik saatlerini planlamak, zemin işaretlemesi yapmak.',
            kkd: 'Kaymaz tabanlı ayakkabı (Mutfak/Temizlik personeli için).'
        }
    },
    'Yüksekten Düşme (Platform, Seyyar Merdiven, Pencere, Çatı)': {
        aciklamaListesi: [
            'Korkuluğu olmayan/standart dışı merdiven boşluğu', 
            'Korkuluğu olmayan/standart dışı platform/asma kat (Atölye, Isı Merkezi)', 
            'Pencerelerden düşme riski (Tam açılır kanat, düşük parapet, korkuluksuz)', 
            'Çatı/Teras alanında korkuluk/uyarı levhası eksikliği (Bakım alanı)', 
            'Güvensiz seyyar merdiven/tabure/sandalye kullanımı (Ampul değişimi, raf düzenleme vb.)', 
            'Açık çukur/boşluk (kapatılmamış, işaretlenmemiş)', 
            'Dış cephe cam temizliği için güvenli erişim yok', 
            'Yüksekte çalışma izni/prosedürü yok (Bakım personeli)'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Yüksekteki işi (ampul değişimi) uzun saplı aparatla yerden yapmak.',
            ikame: 'Seyyar merdiven yerine, güvenli platformlu mobil iskele kullanmak.',
            muhendislik: 'Sabit korkuluk takılması, pencerelere kısıtlayıcı takılması, yaşam hattı.',
            idari: 'Yüksekte çalışma talimatı, çalışma izni prosedürü, bakım personeli eğitimi.',
            kkd: 'Paraşüt tipi emniyet kemeri, baret (Sadece yetkili bakım personeli için).'
        }
    },
    'Elektrik Tehlikeleri (Pano, Priz, Tesisat)': {
        aciklamaListesi: [
            'Pano kapakları açık / kilitli değil / yetkisiz erişim', 
            'Pano önü kapalı / erişim engellenmiş (Min. 1m boşluk olmalı)', 
            'Hasarlı/izolasyonu bozuk/açıkta kablo ucu', 
            'Priz/anahtar kırık/hasarlı/yerinden oynamış', 
            'Kaçak akım rölesi (KAR/RCD) yok (Yönetmelik gereği zorunludur)', 
            'Kaçak akım rölesi çalışmıyor (Periyodik testi yapılmamış)', 
            'Topraklama tesisatı yok/uygun değil/ölçümü yapılmamış (Lab/Atölye makinesi)', 
            'Aşırı yüklenmiş çoklu priz/zincirleme uzatma kablosu', 
            'Su kaynaklarına (sebil, lavabo vb.) yakın korumasız priz', 
            'Yetkisiz kişilerin panolara müdahalesi mümkün', 
            'Periyodik elektrik tesisatı uygunluk kontrolü yapılmamış'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Cihazı/tesisatı kullanımdan kaldırmak (pilli/kablosuz olanla değiştirmek).',
            ikame: 'Yüksek voltajlı sistemi SELV (düşük voltaj) ile değiştirmek.',
            muhendislik: 'Kaçak Akım Rölesi (KAR) takmak, kabloları kanala almak, topraklama yapmak.',
            idari: 'Uyarı levhası (\'Ölüm Tehlikesi\'), \'Yetkisiz Girilmez\', periyodik kontrol talimatı.',
            kkd: 'İzole eldiven, yalıtkan ayakkabı (Sadece yetkili bakım personeli için).'
        }
    },
    'Yangın & Acil Durum (Kaçış Yolu, YSC, Tatbikat)': {
        aciklamaListesi: [
            
            'Acil çıkış kapısı kilitli / önü engelli / ters yöne açılıyor', 
            'Acil durum yönlendirme levhaları (EXIT) eksik/görünmüyor/aydınlatmasız/çalışmıyor', 
            'Acil durum aydınlatmaları çalışmıyor/yetersiz', 
            'Duman dedektörü/alarm sistemi yok/çalışmıyor/maskelenmiş', 
            'Yanıcı/parlayıcı maddelerin uygunsuz depolanması (kağıt, arşiv, kimyasal)', 
            'Elektrik panoları çevresinde yanıcı malzeme depolama', 
            'Tahliye planı yok/asılı değil/güncel değil', 
            'Acil durum ekipleri (Söndürme, Kurtarma, İlkyardım) kurulmamış/eğitimsiz', 
            'Yıllık yangın/tahliye tatbikatı yapılmamış',
            'Sigara yasağına uyulmuyor/izmaritler uygunsuz atılıyor','YSC (Yangın Söndürme Cihazı) erişilebilir değil/önü engelli/askı yerinde değil', 
            'YSC periyodik kontrolü yapılmamış/zamanı geçmiş', 
            'YSC sayısı/tipi uygun değil (Bina Tehlike Sınıfına göre)'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Yanıcı malzemeyi (tiner) kullanımdan kaldırmak.',
            ikame: 'Çok parlayıcı malzemeyi, parlama noktası yüksek olanla değiştirmek.',
            muhendislik: 'Duman dedektörü/yangın alarmı/sprinkler sistemi kurmak, EXIT yönlendirmelerini yenilemek.',
            idari: 'Acil Durum Planı hazırlamak, ekipleri kurmak, yıllık tatbikatı yapmak, YSC kontrollerini planlamak.',
            kkd: 'Acil durum ekipleri için özel donanım.'
        }
    },
    
 
    'Kimyasal Riskler (Laboratuvar, Atölye, Temizlik)': {
        aciklamaListesi: [
            'Kimyasallar etiketsiz/kapaksız kaplarda/içecek şişesinde', 
            'MSDS (GBF - Güvenlik Bilgi Formu) eksik/ulaşılamaz', 
            'Kimyasallar uygun olmayan yerde (ofis, lavabo altı) depolanıyor', 
            'Uyumsuz kimyasallar bir arada depolanıyor (Asit-Baz vb.)', 
            'Yetersiz havalandırma (kimyasal kokusu)', 
            'Çeker ocak yok/bakımsız/çalışmıyor (Laboratuvar)', 
            'Göz duşu/acil duş yok/çalışmıyor/önü kapalı (Laboratuvar vb.)', 
            'Uygun KKD (eldiven, gözlük, önlük) eksik/kullanılmıyor', 
            'Dökülme kiti (spill kit) yok/personel eğitimi eksik', 
            'Temizlik kimyasalları karıştırılıyor (Tuz Ruhu + Çamaşır Suyu = Zehirli Gaz)',
            'Tehlikeli atıklar (kimyasal, solvent) uygun depolanmıyor'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Tehlikeli kimyasalı (formaldehit) kullanımdan kaldırmak.',
            ikame: 'Solvent bazlı temizleyiciyi su bazlı (deterjan) ile değiştirmek.',
            muhendislik: 'Çeker ocak kurmak, yerel havalandırma, havalandırmalı kimyasal dolap, göz duşu.',
            idari: 'MSDS (GBF) bulundurmak, etiketleme yapmak, kimyasal eğitimi vermek.',
            kkd: 'Nitril eldiven, koruyucu gözlük, kimyasal önlük, solunum maskesi (gerekliyse).'
        }
    },
       'Mutfak, Yemekhane ve Hijyen Riskleri': {
        aciklamaListesi: [
            'Gıda hijyeni eksikliği var(Çiğ/pişmiş ayırımı yapılmaması)',
            'Soğuk zincirin kırılmış / yetersiz soğutucu dolaplar',
            'Personel hijyen eksikliği var (bone/eldiven/önlük kullanılmaması)',
            'Sıcak su ve buharla yanma tehlikesi mevcut (Bulaşıkhane, pişirme kazanları)',
            'Kesici/delici alet tehlikesi mevcut(Bıçak, doğrayıcı, kıyma makinesi)',
            'Davlumbaz/filtreler yağlı ve kirli (Yangın riski)',
            'Gaz (LPG/Doğalgaz) kaçağı riski / dedektör eksikliği mevcut',
            'Haşere/vektör mücadelesi yetersiz',
            'Yemekhane ortak alanlarında (masa, sandalye) hijyen eksikliği var'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Bıçakla doğrama yerine kapalı sistem doğrayıcı kullanmak.',
            ikame: 'Kırık/hasarlı mutfak ekipmanını yenilemek.',
            muhendislik: 'Davlumbazlara otomatik söndürme sistemi kurmak, gaz kesme vanası ve dedektör montajı.',
            idari: 'HACCP planı oluşturmak, gıda hijyeni eğitimi, haşere kontrol planı.',
            kkd: 'Çelik zırhlı eldiven (kesme işleri), ısıya dayanıklı eldiven (fırın), kaymaz tabanlı ayakkabı.'
        }
    },
    'Biyolojik Riskler (Diş Hastanesi, Lab, Revir, Atık)': {
        aciklamaListesi: [
            'Tıbbi atık/kesici-delici alet kutusu yok/dolu/ağzı açık (Diş Hastanesi, Revir, Lab)', 
            'Enfekte materyale (kan, tükürük) maruziyet riski mevcut(Diş Hastanesi)',
            'Kesici-delici alet yaralanma riski mevcut(İğne batması)',
            'Biyogüvenlik kabini yok/bakımsız (Araştırma Merkezi)',
            'Klima/havalandırma filtreleri bakımsız (Lejyonella riski)', 
            'Yetersiz el yıkama imkanı/hijyen malzemesi eksikliği (sabun, kağıt havlu, dezenfektan)', 
            'Ortak alanlarda (WC, lavabo) genel hijyen eksikliği mevcut', 
            'Biyolojik atıkların uygun ayrıştırılmaması/depolanmaması yapılmıyor'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Tek kullanımlık (disposable) malzemeler kullanmak.',
            ikame: 'İğne batmasını önleyen (emniyetli) enjektör kullanmak.',
            muhendislik: 'Biyogüvenlik kabini, uygun havalandırma (negatif basınçlı oda), kapaklı atık kutuları.',
            idari: 'Biyolojik riskler eğitimi, aşılama programı (Hepatit B), atık yönetimi planı.',
            kkd: 'Medikal eldiven, N95/FFP2 maske, siperlik/gözlük, tıbbi önlük.'
        }
    },
    'Ergonomi - Ekranlı Araçlar (Ofis, Bilgisayar Lab., Kütüphane)': {
        aciklamaListesi: [
            'Ayarlanamayan/ergonomik olmayan ofis sandalyesi/sıra', 
            'Monitör seviyesi göz hizasında değil (çok alçak/yüksek)', 
            'Ekran parlaması/yetersiz aydınlatma', 
            'Uzun süreli kesintisiz oturarak çalışma (Ara dinlenme verilmiyor)', 
            'Masa altı bacak/ayak mesafesi yetersiz/dolu',
            'Dizüstü bilgisayarın yükseltici olmadan sürekli kullanımı'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Hareketsiz çalışmayı kaldırmak (ayakta çalışılabilir masa vb.).',
            ikame: 'Eski tip monitörü (Tüplü) LCD/LED ekranla değiştirmek.',
            muhendislik: 'Ayarlanabilir koltuk/masa sağlamak, monitör yükseltici, ayak desteği.',
            idari: 'Periyodik ara dinlenmeler (50dk çalışma 10dk mola), \'Ekranlı Araçlar\' eğitimi.',
            kkd: 'Gerekmez (Antirefle gözlük tıbbi bir gereçtir, KKD değildir).'
        }
    },
    'Ergonomi - Elle Taşıma & Tekrarlı İş (Arşiv, Mutfak, Atölye, Diş Hek.)': {
        aciklamaListesi: [
            'Ağır malzeme kaldırma (Su damacanası, kâğıt kolisi, arşiv dosyaları, yemek kazanı)', 
            'Mekanik yardımcı (taşıma arabası, transpalet) yok/kullanılmıyor', 
            'Personel kaldırma tekniği eğitimi almamış', 
            'Yükler düzensiz istiflenmiş/raf yüksekliği uygunsuz', 
            'Uygunsuz pozisyonda (eğilerek/dönerek) kaldırma/çalışma (Diş Hekimi, Atölye)',
            'Zorlayıcı/tekrarlı el-kol hareketleri (Atölye, Dental Klinik, Mutfak)'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Manuel taşımayı kaldırmak (kâğıtları dijitalleştirmek, merkezi su sistemi).',
            ikame: 'Ağır damacana yerine su arıtma cihazı kullanmak.',
            muhendislik: 'Taşıma arabası, transpalet sağlamak, rafları erişilebilir yüksekliğe indirmek.',
            idari: 'Eğitim (Elle Kaldırma Taşıma), iş rotasyonu, sağlık gözetimi (Bel ağrısı).',
            kkd: 'Mekanik risk eldiveni, çelik burunlu ayakkabı (Depo/Arşiv/Mutfak).'
        }
    },
    'Fiziksel Etmenler (Gürültü, Titreşim, Termal Konfor)': {
        aciklamaListesi: [
            'Gürültülü çalışma (Isı Merkezi, Kompresör Odası, Atölye, Jeneratör)', 
            'Gürültü seviyesi 85 dB üzeri (Maruziyet)', 
            'Titreşimli el aleti kullanımı (Atölye, Bakım)',
            'Ortam çok sıcak/soğuk (Termal konfor sağlanmamış - Isı Merkezi, Mutfak)', 
            'Yetersiz havalandırma/durgun hava (Kalabalık derslik, ofis)'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Gürültülü yazıcıyı odadan çıkarmak.',
            ikame: 'Gürültülü cihazı daha sessiz modeliyle değiştirmek.',
            muhendislik: 'Ses emici panel/kabin, lokal havalandırma/iklimlendirme, kurşun zırhlama.',
            idari: 'Gürültü/Aydınlatma/Termal Konfor ölçümü, çalışma süresini kısıtlama (rotasyon).',
            kkd: 'Kulak koruyucu (tıkaç/manşonlu), anti-vibrasyon eldiveni, kurşun önlük.'
        }
    },
    'İş Ekipmanları ve Mekanik Tehlikeler (Atölye, Isı Merkezi)': {
        aciklamaListesi: [
            'Makine koruyucusu yok/sökülmüş/devre dışı (Torna, Matkap, Pres, Kayış-Kasnak)',
            'Ekipmanda Acil Durdurma Butonu yok/çalışmıyor/erişilemiyor',
            'Arızalı/uygunsuz el aleti kullanılıyor (spiral, matkap vb.)',
            'Kaldırma ekipmanlarının(Asansör, Vinç, Forklift) periyodik kontrolü yapılmamış',
            'Basınçlı kapların (Kompresör, Otoklav, Kalorifer Kazanı) periyodik kontrolü yapılmamış',
            'Kompresör/Kazan emniyet ventili arızalı/bloke edilmiş/uygun değil',
            'Asansörde kırmızı/sarı etiket var (kullanıma uygun değil)',
            'Atölyedeki ekipman (torna, freze) zemine sabitlenmemiş',
            'Isı Merkezinde kazan dairesi işletmecisi (yetki belgeli) yok'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Tehlikeli makineyi/işlemi fason (dışarıdan hizmet alımı) olarak yaptırmak.',
            ikame: 'Arızalı/güvensiz el aletini yenisiyle değiştirmek.',
            muhendislik: 'Makineye sabit koruyucu kapak/sensör/acil stop butonu eklenmesi.',
            idari: 'Ekipmanların periyodik kontrol planına dahil edilmesi, kullanım talimatı asılması, yetkili operatör görevlendirilmesi.',
            kkd: 'Mekanik iş eldiveni, çelik burunlu ayakkabı, koruyucu gözlük.'
        }
    },
    'Psikososyal Riskler (Stres, Mobbing, İletişim)': {
        aciklamaListesi: [
            'Aşırı iş yükü/zaman baskısı (özellikle sınav/kayıt dönemleri)', 
            'Rol belirsizliği/görev tanımı çatışması', 
            'Mobbing (Yatay/Dikey Zorbalık)', 
            'Akademik/idari personel arası iletişim sorunları/çatışma', 
            'Şiddet/Sözlü taciz riski (öğrenci-personel-hasta yakını)', 
            'Yalnız çalışma (gece/tenha alanlar - Güvenlik, Bakım)', 
            'Düzensiz vardiya/aşırı uzun çalışma saatleri',
            'Kararlara katılım eksikliği/geri bildirim yokluğu'
        ],
        dinamikOrnekler: {
            eliminasyon: 'Mobbinge neden olan kişiyi/kaynağı izole etmek/ilişiğini kesmek.',
            ikame: 'Çatışmalı bir yöneticiyi, yapıcı bir yönetici ile değiştirmek.',
            muhendislik: 'Yalnız çalışanlar için panik butonu, güvenlik kameraları, giriş kontrol sistemleri.',
            idari: 'Mobbing/Şiddet politikası oluşturmak, şikayet mekanizması kurmak, görev tanımlarını netleştirmek, adil vardiya planı.',
            kkd: 'Gerekmez.'
        }
    },
    'Radyasyon Riski (Nükleer Tıp, Araştırma, Fizik Lab.)': {
  aciklamaListesi: [
    'İyonize radyasyon kaynağı var(X-Ray, Gama, Radyoaktif İzotop)',
    'Dozimetre/Film rozeti kullanılmıyor/takip edilmiyor',
    'Radyasyon uyarı levhası/işaretleme eksik',
    'Kurşun zırhlama/koruyucu ekran yetersiz (Diş Röntgeni)',
    'Radyoaktif atık uygun depolanmıyor/etiketlenmemiş',
    'Hamile personel/öğrenci bilgilendirilmemiş',
    'Radyasyon Güvenliği sorumlusu atanmamış',
    'Lazer kullanımında uygun göz koruması yok (Fizik/Mühendislik Lab.)'
  ],
  dinamikOrnekler: {
    eliminasyon: 'Radyoaktif kaynağı/işlemi kaldırmak (gerçekten gerekli mi?).',
    ikame: 'Yüksek aktiviteli kaynağı düşük aktiviteli ile değiştirmek.',
    muhendislik: 'Kurşun zırhlama, uzaktan kumanda, otomatik kapanma, kilitli depolama.',
    idari: 'Radyasyon çalışma izni, maruz kalma sürelerini kısıtlama, hamilelik bildirimi prosedürü.',
    kkd: 'Kurşun önlük, tiroid kalkanı, dozimetre/film rozeti (izleme).'
  }
},
    'Atık Yönetimi (Tehlikeli/Tıbbi/Kimyasal)': {
  aciklamaListesi: [
    'Atıklar ayrıştırılmadan karışık atılıyor',
    'Tıbbi atık kutuları uygun değil/taşıyor (Diş Hast., Revir)',
    'Kimyasal atık lavaboya/kanalizasyona dökülüyor',
    'Tehlikeli atık geçici depolama alanı uygunsuz (açık/güneşe maruz)',
    'Atık etiketleme/kaydı yapılmıyor',
    'Atık taşıma/toplama personeli eğitimsiz',
    'Kesici-delici atık (iğne, bistüri) kutudan taşıyor/uygunsuz',
    'Radyoaktif atık ayrı depolanmıyor/bozunma beklenmemiş'
  ],
  dinamikOrnekler: {
    eliminasyon: 'Atık oluşturan malzemeyi/işlemi kullanımdan kaldırmak.',
    ikame: 'Tek kullanımlık yerine yıkanabilir/tekrar kullanılabilir malzeme tercih etmek.',
    muhendislik: 'Renkli kodlu atık konteynerleri, kilitli tehlikeli atık deposu, havalandırma.',
    idari: 'Atık Yönetim Planı, personel eğitimi, lisanslı firma ile sözleşme, kayıt tutma.',
    kkd: 'Atık toplama eldiveni, maske, gözlük, önlük.'
  }
},
'Deney Hayvanları Birimleri (Vivaryum)': {
  aciklamaListesi: [
    'Hayvan ısırması/tırmalama riski mevcut',
    'Alerjen maruziyeti (tüy, dışkı, idrar) riski mevcut',
    'Zoonotik hastalık bulaşması riski (Toksoplazmoz, Hantavirüs) mevcut',
    'Yetersiz havalandırma/amonyak birikimi var',
    'Kesici-delici atık (Enjektör iğnesi) mevcut',
    'Anestezi gazı maruziyeti (İzofluran vb.) mevcut',
    'Hayvan kaçışı/kontrol kaybı riski var',
    'Kadavra/doku atıklarının bertarafı uygunsuz'
  ],
  dinamikOrnekler: {
    eliminasyon: 'Deney hayvanı kullanımını alternatif yöntemlerle (in-vitro, simulasyon) değiştirmek.',
    ikame: 'Iri hayvan yerine daha küçük/kolay kontrol edilebilir tür kullanmak.',
    muhendislik: 'HEPA filtreli havalandırma, otoklav, biyogüvenlik kabini, güvenli kafes sistemi.',
    idari: 'Hayvan bakım protokolleri, aşılama programı (Kuduz, Tetanoz), eğitim.',
    kkd: 'Hayvan tutma eldiveni, N95 maske, tulum, gözlük.'
  }
},
    'Diğer (Yukarıdaki Sınıflara Girmeyen)': {
  aciklamaListesi: [
    'Doğal afet riski var(Deprem - binada hasar riski)',
    'Güvenlik zafiyeti var(Yetkisiz giriş, hırsızlık)',
    'Hayvan saldırısı riski var(Başıboş köpek - kampüs açık alanı)',
    'Park alanı yetersizliği mevcut(Trafik sıkışıklığı)',
    'Aşırı soğuk/sıcak hava koşullarından etkilenme riski (Açık alanlarda çalışma)',
    'Manuel olarak tanımlanacak diğer tehlikeler'
  ],
  dinamikOrnekler: {
    eliminasyon: 'Risk kaynağını ortadan kaldırmak.',
    ikame: 'Daha güvenli alternatifle değiştirmek.',
    muhendislik: 'Teknik kontrol önlemleri uygulamak.',
    idari: 'Prosedür/talimat/eğitim oluşturmak.',
    kkd: 'Kişisel koruyucu donanım sağlamak.'
  }
}
};

export const etkilenenKisilerListesi = [
    'Öğrenci', 'Akademik Personel', 'İdari Personel', 'Temizlik Personeli (Alt İşveren)',
    'Güvenlik Personeli (Alt İşveren)', 'Bakım/Teknik Personel', 'Ziyaretçi / Misafir',
    'Tüm Çalışanlar', 'Herkes (Öğrenci + Çalışan + Ziyaretçi)'
];

export const olasilikMap = [
    { v: 0.5, t: '0.5 - Neredeyse İmkansız' }, { v: 1, t: '1 - Pratik Olarak İmkansız' },
    { v: 2, t: '2 - Oldukça Düşük' }, { v: 3, t: '3 - Zayıf' }, { v: 6, t: '6 - Düşük' },
    { v: 10, t: '10 - Orta' }, { v: 15, t: '15 - Yüksek' }
];
export const siddetMap = [
    { v: 1, t: '1 - Hafif' }, { v: 3, t: '3 - Küçük' }, { v: 7, t: '7 - Önemli' },
    { v: 15, t: '15 - Ciddi' }, { v: 40, t: '40 - Çok Ciddi' }, { v: 100, t: '100 - Felaket' }
];
export const siklikMap = [
    { v: 0.5, t: '0.5 - Çok Nadir' }, { v: 1, t: '1 - Nadir' }, { v: 2, t: '2 - Ara Sıra' },
    { v: 3, t: '3 - Sık' }, { v: 6, t: '6 - Sürekli' }, { v: 10, t: '10 - Devamlı' }
];

export const bilgiIcerikleri = {
    fineKinney: {
      baslik: 'Fine-Kinney Risk Değerlendirme Yöntemi',
      icerik: [ 
        'Risk Skoru = Olasılık × Şiddet × Sıklık',
        '', '📊 Risk Seviyeleri (Örnek Matris):',
        '• 0-20: Önemsiz Risk (Yeşil) - Kabul edilebilir',
        '• 20-70: Düşük Risk (Mavi) - Dikkat edilmeli',
        '• 70-200: Orta Risk (Sarı) - İyileştirme gerekli',
        '• 200-400: Önemli Risk (Turuncu) - Acil önlem',
        '• 400+: Yüksek Risk (Kırmızı) - Derhal müdahale'
      ]
    },
    olasilik: { baslik: 'Olasılık Değerleri', icerik: '0.5 = Neredeyse İmkansız\n1 = Pratik Olarak İmkansız\n2 = Oldukça Düşük\n3 = Zayıf\n6 = Düşük\n10 = Orta\n15 = Yüksek' },
    siddet: { baslik: 'Şiddet (Sonuç) Değerleri', icerik: '1 = Hafif - İlk yardımsız\n3 = Küçük - İlk yardım gerektirir\n7 = Önemli - İş göremezlik\n15 = Ciddi - Sakatlık\n40 = Çok Ciddi - Kalıcı sakatlık\n100 = Felaket - Ölüm' },
    siklik: { baslik: 'Sıklık (Maruziyet) Değerleri', icerik: '0.5 = Çok Nadir (Yılda bir)\n1 = Nadir (Ayda bir)\n2 = Ara Sıra (Haftada bir)\n3 = Sık (Günde bir)\n6 = Sürekli (Saatte bir)\n10 = Devamlı' },
    hiyerarsi: {
      baslik: 'Risk Kontrol Hiyerarşisi (RDY Madde 10)',
      icerik: `Risklerin kontrolünde bu öncelik sırası esastır:
1. Eliminasyon (Yok Etme): Tehlikeyi ortadan kaldırın.
2. İkame (Değiştirme): Tehlikeliyi daha az tehlikeli olanla değiştirin.
3. Mühendislik Önlemleri: Riski kaynağında izole edin (Örn: Koruyucu, bariyer, havalandırma).
4. İdari Önlemler: Çalışma süresi, talimatlar, uyarı levhaları, eğitimler.
5. Kişisel Koruyucu Donanım (KKD): En son çare olarak çalışana KKD verin.`
    },
    aiRiskScoring: {
      baslik: 'AI Destekli Risk Puanlama',
      icerik: `Bu özellik, "Tehlike Açıklaması" alanına yazdığınız metni analiz eder ve Fine-Kinney metodolojisine göre en uygun Olasılık, Şiddet ve Sıklık değerlerini önerir.\n\nAI, tehlikenin ciddiyetini ve potansiyel etkilerini değerlendirerek size bir başlangıç noktası sunar. Son karar ve doğrulama her zaman size aittir.`
    },
    aiControlMeasures: {
      baslik: 'AI Destekli Önlem Önerileri',
      icerik: `Bu özellik, tanımladığınız tehlike için Risk Kontrol Hiyerarşisi'nin her bir basamağına (Yok Etme, İkame, Mühendislik vb.) uygun, spesifik ve uygulanabilir kontrol önlemleri oluşturur.\n\nOluşturulan öneriler, üniversite ortamına uygun ve pratik çözümler sunmayı hedefler. Bu önerileri doğrudan kullanabilir veya kendi önlemleriniz için ilham kaynağı olarak değerlendirebilirsiniz.`
    },
    aiResponsibleUnit: {
      baslik: 'AI Destekli Sorumlu Birim Tespiti',
      icerik: `Bu özellik, girilen Alan, Faaliyet ve Tehlike bilgilerini analiz ederek, bu riskin çözümü için en olası sorumlu birimi önerir.\n\nÖrneğin, "arızalı priz" gibi bir tehlike için "Teknik Bakım Birimi" gibi bir öneri sunarak, görev atama sürecini hızlandırır.`
    },
    aiImageAnalysis: {
      baslik: 'Fotoğraftan Tehlike Tespiti',
      icerik: `Bu özellik, bu riske eklediğiniz son fotoğrafı analiz ederek görüntüdeki poteniyel tehlikeleri tespit eder ve bunları metin olarak "Tehlike Açıklaması" alanına ekler.\n\nÖrneğin, yerde duran bir kabloyu veya engellenmiş bir acil çıkışı otomatik olarak tanıyabilir. Analiz için en az bir fotoğraf eklenmiş olmalıdır.`
    },
    aiGeneralSummary: {
      baslik: 'AI Destekli Genel Değerlendirme Özeti',
      icerik: `Bu özellik, formda tanımlanan tüm riskleri, puanlarını ve önerilen önlemleri analiz ederek "Genel Değerlendirme" alanı için kapsamlı bir özet metin oluşturur.\n\nBu özet, en yüksek riskli alanları, ortak temaları ve genel aksiyon planını vurgulayarak raporunuzun sonuç bölümünü hazırlamanıza yardımcı olur.`
    }
  };