# 📦 Setup Capacitor - Application Android Native

## Temps estimé: 2-3 heures

## Prérequis

### À Installer

1. **Node.js** (déjà installé ✅)

2. **Android Studio**
   - Télécharger: https://developer.android.com/studio
   - Installer avec Android SDK
   - Ajouter au PATH

3. **Java JDK 11**
   - Télécharger: https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
   - Ou via Android Studio

---

## 🚀 Étapes d'Installation

### 1️⃣ Installer Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

### 2️⃣ Initialiser Capacitor

```bash
npx cap init
```

**Répondre:**
- App name: `BidTounsi`
- App ID: `com.bidtounsi.app`
- Web dir: `out`

Cela créera `capacitor.config.json`

### 3️⃣ Créer `next.config.js`

Créez le fichier à la racine:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
```

### 4️⃣ Modifier `capacitor.config.json`

```json
{
  "appId": "com.bidtounsi.app",
  "appName": "BidTounsi",
  "webDir": "out",
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#1D4ED8",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "spinnerColor": "#ffffff"
    }
  }
}
```

### 5️⃣ Build l'Application Web

```bash
npm run build
```

Cela créera le dossier `out/` avec votre application.

### 6️⃣ Ajouter la Plateforme Android

```bash
npx cap add android
```

Cela créera le dossier `android/` avec le projet Android.

### 7️⃣ Copier les Fichiers Web

```bash
npx cap copy android
npx cap sync android
```

### 8️⃣ Ouvrir Android Studio

```bash
npx cap open android
```

Android Studio s'ouvrira avec votre projet.

---

## ⚙️ Configuration dans Android Studio

### 1. Attendre la Synchronisation Gradle
- Première ouverture = plusieurs minutes
- Attendre que "Gradle build finished" apparaisse

### 2. Générer les Icônes

**Méthode simple:**
1. Clic droit sur `android/app/src/main/res`
2. New → Image Asset
3. Icon Type: Launcher Icons (Adaptive and Legacy)
4. Path: Sélectionner votre logo (PNG 512x512 minimum)
5. Next → Finish

### 3. Configurer le Nom de l'App

Ouvrir: `android/app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">BidTounsi</string>
    <string name="title_activity_main">BidTounsi</string>
    <string name="package_name">com.bidtounsi.app</string>
    <string name="custom_url_scheme">com.bidtounsi.app</string>
</resources>
```

### 4. Configurer les Permissions

Ouvrir: `android/app/src/main/AndroidManifest.xml`

Ajouter avant `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### 5. Configurer la Couleur du Theme

Ouvrir: `android/app/src/main/res/values/styles.xml`

Modifier:
```xml
<item name="colorPrimary">#1D4ED8</item>
<item name="colorPrimaryDark">#1E40AF</item>
<item name="colorAccent">#3B82F6</item>
```

---

## 🔨 Build l'APK

### Debug APK (Pour Tester)

Dans Android Studio:
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Attendre la compilation
3. Cliquer sur "locate" dans la notification
4. L'APK est dans: `android/app/build/outputs/apk/debug/app-debug.apk`

Ou en ligne de commande:
```bash
cd android
./gradlew assembleDebug
```

### Installer sur Téléphone

**Via USB:**
1. Activer "Developer Options" sur Android
2. Activer "USB Debugging"
3. Connecter le téléphone
4. ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

**Ou:**
- Copier l'APK sur le téléphone
- Ouvrir avec gestionnaire de fichiers
- Installer

---

## 📦 Build de Production (Play Store)

### 1. Créer une Clé de Signature

```bash
keytool -genkey -v -keystore bidtounsi-release.keystore -alias bidtounsi -keyalg RSA -keysize 2048 -validity 10000
```

Répondre aux questions et **SAUVEGARDER LE MOT DE PASSE** !

### 2. Configurer le Signing

Créer: `android/key.properties`

```properties
storePassword=VOTRE_MOT_DE_PASSE
keyPassword=VOTRE_MOT_DE_PASSE
keyAlias=bidtounsi
storeFile=../bidtounsi-release.keystore
```

**⚠️ NE PAS COMMITER CE FICHIER !**

Ajouter à `.gitignore`:
```
android/key.properties
*.keystore
```

### 3. Modifier `android/app/build.gradle`

Ajouter avant `android {`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Dans `android {`, ajouter:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

### 4. Build Release APK

```bash
cd android
./gradlew assembleRelease
```

L'APK sera dans: `android/app/build/outputs/apk/release/app-release.apk`

### 5. Build AAB (Pour Play Store)

```bash
cd android
./gradlew bundleRelease
```

Le fichier AAB sera dans: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔄 Workflow de Développement

### Faire des Modifications

1. Modifier le code dans `/components`, `/utils`, etc.
2. Rebuild: `npm run build`
3. Sync: `npx cap sync android`
4. Run dans Android Studio ou: `npx cap run android`

### Script NPM Pratique

Ajoutez dans `package.json`:

```json
{
  "scripts": {
    "android:build": "npm run build && npx cap sync android",
    "android:open": "npx cap open android",
    "android:run": "npm run android:build && npx cap run android"
  }
}
```

Utilisation:
```bash
npm run android:run
```

---

## 🎨 Optimisations

### Splash Screen

Créer `/public/splash.png` (2732x2732)

Placer dans: `android/app/src/main/res/drawable/splash.png`

### Icône Adaptive

Créer deux versions:
- Foreground: Logo seul (transparent)
- Background: Couleur de fond

### Gestion du Clavier

Dans `AndroidManifest.xml`, dans `<activity>`:

```xml
android:windowSoftInputMode="adjustResize"
```

---

## 📱 Plugins Natifs Utiles

### Caméra

```bash
npm install @capacitor/camera
```

```tsx
import { Camera } from '@capacitor/camera';

const takePicture = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: 'uri'
  });
  return image.webPath;
};
```

### Stockage Local

```bash
npm install @capacitor/preferences
```

```tsx
import { Preferences } from '@capacitor/preferences';

await Preferences.set({ key: 'user', value: JSON.stringify(user) });
const { value } = await Preferences.get({ key: 'user' });
```

### Status Bar

```bash
npm install @capacitor/status-bar
```

```tsx
import { StatusBar } from '@capacitor/status-bar';

await StatusBar.setBackgroundColor({ color: '#1D4ED8' });
await StatusBar.setStyle({ style: 'LIGHT' });
```

---

## 🐛 Problèmes Courants

### Gradle Build Failed
**Solution:** Mettre à jour Gradle dans Android Studio

### Three.js ne charge pas
**Solution:** Dans `capacitor.config.json`:
```json
"server": {
  "androidScheme": "https"
}
```

### Images ne s'affichent pas
**Solution:** Utiliser des chemins absolus et `next/image` unoptimized

### WebGL ne fonctionne pas
**Solution:** Ajouter dans `AndroidManifest.xml`:
```xml
<application android:hardwareAccelerated="true">
```

---

## ✅ Checklist Complète

- [ ] Node.js installé
- [ ] Android Studio installé
- [ ] Capacitor installé
- [ ] `next.config.js` créé
- [ ] `capacitor.config.json` configuré
- [ ] Application buildée (`npm run build`)
- [ ] Plateforme Android ajoutée
- [ ] Projet ouvert dans Android Studio
- [ ] Icônes générées
- [ ] Permissions configurées
- [ ] APK Debug buildé
- [ ] APK testé sur device
- [ ] Clé de signature créée (pour release)
- [ ] AAB Release buildé (pour Play Store)

---

## 🎉 Félicitations !

Votre application BidTounsi est maintenant une application Android native !

### Prochaines Étapes

1. **Tester sur plusieurs devices**
2. **Optimiser les performances**
3. **Préparer pour le Play Store**
4. **Créer des screenshots**
5. **Écrire la description**

### Publier sur Play Store

1. Créer un compte Google Play Developer (25$ one-time)
2. Uploader le fichier AAB
3. Remplir les informations
4. Attendre la validation (quelques jours)

Bon courage ! 🚀📱
