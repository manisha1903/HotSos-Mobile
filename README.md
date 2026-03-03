# HotSOS Mobile

A mobile hotel operations app built with **Angular 21 + Capacitor** (no Ionic UI). Implements PIN login, bottom tab navigation, and housekeeping/service-orders/guest screens.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 (standalone components) |
| Mobile runtime | Capacitor 8 |
| Styling | SCSS (no Ionic) |
| Storage | Capacitor Preferences (secure token storage) |
| HTTP | Angular HttpClient + functional interceptor |
| UI overlays | Custom bottom-sheet (no CDK/Ionic dependency) |

---

## Prerequisites

- Node.js ≥ 20
- npm ≥ 11
- Angular CLI: `npm install -g @angular/cli`
- For iOS: Xcode 15+, macOS, CocoaPods
- For Android: Android Studio + JDK 17+

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Install Capacitor CLI globally
npm install -g @capacitor/cli
```

---

## Running the App

### Web (development)
```bash
ng serve
# → http://localhost:4200
# Default PIN to log in: 1234
```

### Web (QA build)
```bash
ng build --configuration=qa
```

### Web (production build)
```bash
ng build --configuration=production
# Output in dist/hotsos-mobile/
```

---

## Capacitor — Native Builds

### Sync web assets to native projects
```bash
ng build
npx cap sync
```

### Android
```bash
npx cap open android
# Then Run ▶ in Android Studio
```

### iOS
```bash
npx cap open ios
# Then Run ▶ in Xcode (requires macOS)
```

---
## Folder Structure

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts          # Route guard — redirects to /login if no token
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # Attaches Bearer token to every HTTP request
│   └── services/
│       ├── auth.service.ts        # PIN login, token save/get/clear (Capacitor Preferences)
│       └── profile.service.ts     # Profile overlay open/close signal
├── features/
│   ├── auth/login/                # PIN login screen
│   ├── shell/                     # Bottom tab bar shell
│   ├── housekeeping/              # Housekeeping tab
│   ├── service-orders/            # Service Orders tab
│   ├── guests/                    # Guests tab
│   └── profile/                   # Full-screen profile overlay
└── shared/
    └── components/
        └── bottom-sheet/          # Custom bottom-sheet (More menu)
src/assets/
└── mock/
    └── auth.json                  # Local mock PIN → token data
src/environments/
├── environment.ts                 # Dev
├── environment.qa.ts              # QA
└── environment.prod.ts            # Production
```

---

## PIN	User

1234	John Watson
0000	Jane Doe
9999	Admin User

## Running Tests

```bash
ng test
```
