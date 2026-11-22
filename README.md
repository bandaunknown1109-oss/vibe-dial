# VIBE DIAL — Day 1 PWA Prototype

A mobile-first, liquid-glass inspired dialer interface prototype.

## What works in this Day 1 build
- Responsive Home, Dial Pad, Contacts, Call History and Settings pages
- Bottom navigation and slide-out drawer
- Search contacts
- Add and save contacts locally in this browser
- Local prototype call activity
- `tel:` handoff to the phone's system dialer
- Theme choices, glass blur control, touch and reduced-motion toggles
- PWA manifest and service worker for offline app shell

## Important limitations
This is a PWA prototype, not a native Android phone application.
- It cannot become Android's default dialer.
- It cannot read Android SIM/device/Google contacts or the system call log.
- It cannot control incoming calls, SIM selection, in-call controls, or call recording.
- Contacts and prototype history are stored only in this browser's local storage.
- Google account binding is not implemented in this prototype.
- The call button opens the phone's system dialer using a `tel:` link; it does not silently place or manage calls.

Call recording in a future native app must respect applicable law, platform restrictions, and clear consent/recording indicators. Do not implement covert recording.

## Run locally on Android
1. Extract this ZIP.
2. Open `index.html` in a code editor or local web server.
3. For PWA installation and offline support, serve the folder over HTTPS or localhost. Opening the HTML file directly does not enable service workers.
4. For easiest mobile testing, publish the files to a static HTTPS host.

## GitHub + GitHub Pages deployment
1. Create a GitHub repository named `vibe-dial`.
2. Upload the contents of this folder to the repository root (not the ZIP itself).
3. Open repository Settings → Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select `main` and `/ (root)`, then Save.
6. Wait for the Pages URL to appear. Open it in Chrome on Android.
7. Chrome menu → Add to Home screen / Install app.

## Cloud editing
You can use GitHub's browser editor on mobile for small changes. For a fuller browser IDE, open the repository in a cloud development environment such as GitHub Codespaces if your account has access. No local computer is required for this static PWA.

## Project files
- `index.html` — application structure
- `styles.css` — liquid-glass design and responsive styling
- `app.js` — navigation and prototype interactions
- `manifest.webmanifest` — PWA metadata
- `sw.js` — offline app shell caching
- `icons/icon.svg` — app icon

## Next milestone
Build a native Android app in Kotlin/Jetpack Compose with Android Telecom APIs, contacts provider, call log permissions, default dialer role, and device-supported call controls.
