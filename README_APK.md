# TCDD Bordro Düzenleyici - Android APK & Mobil Paketleme Rehberi

Bu proje, hem modern web tarayıcılarında (PWA) hem de yerel **Android (.APK)** formatında çalışacak şekilde Capacitor ve Android Gradle altyapısıyla hazırlanmıştır.

---

## 🚀 1. Yöntem: Android Telefona Doğrudan Yükleme (APK'sız, En Pratik Yol)
Android telefonunuzda hiçbir dosya indirmeye gerek kalmadan tam ekran yerel uygulama olarak kullanabilirsiniz:
1. Android telefonunuzda **Google Chrome** ile site adresini açın.
2. Sağ üst köşedeki **üç nokta (⋮)** simgesine basın.
3. **"Uygulamayı Yükle"** veya **"Ana Ekrana Ekle"** seçeneğine dokunun.
4. Uygulama telefonunuzun menüsüne ve ana ekranına TCDD simgesiyle kurulur, internetsiz ortamda da tam performans çalışır.

---

## 📦 2. Yöntem: PWABuilder ile Anında İmzalı APK / AAB Paketi Alma (Çevrimiçi)
Herhangi bir yazılım kurmadan doğrudan Google Play uyumlu APK veya AAB oluşturmak için:
1. [PWABuilder (pwabuilder.com)](https://www.pwabuilder.com/) adresine gidin.
2. Uygulamanızın yayınlandığı web adresini (URL) yapıştırıp **"Start"** butonuna basın.
3. PWA puanı %100 onaylandıktan sonra **"Package for Stores"** $\rightarrow$ **"Android"** seçeneğini seçin.
4. **"Generate APK / Bundle"** butonuna tıklayarak doğrudan telefonunuza yüklenebilir `.apk` dosyanızı indirin.

---

## 🛠️ 3. Yöntem: Android Studio ile Yerel APK Derleme (Capacitor)
Proje kök dizinindeki `android/` klasörü tam teşekküllü bir Android Studio projesidir.

### Adımlar:
1. Proje klasöründe web varlıklarını güncelleyin:
   ```bash
   npm run cap:build
   ```
2. Android Studio'yu açın ve proje olarak `android/` klasörünü seçin.
3. Gradle senkronizasyonu tamamlandıktan sonra üst menüden:
   - **Build** $\rightarrow$ **Build Bundle(s) / APK(s)** $\rightarrow$ **Build APK(s)**
4. Derleme bittiğinde sağ altta çıkan **"locate"** bağlantısına tıklayarak `app-debug.apk` dosyanızı telefonunuza yükleyin.

---

## ⚙️ Android Proje Bilgileri
- **Uygulama Adı:** TCDD Bordro
- **Paket Kimliği (Package ID):** `com.tcdd.bordro`
- **Gradle Wrapper:** 8.11+
- **Hedef SDK:** Android 14+ (API 34/35 uyumlu)
- **Minimum SDK:** Android 6.0 (API 23+)
