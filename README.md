# Clinical Vitality — Modern Pet Wellness & AI Veterinary Triage Platform

A production-grade, clinical pet wellness and emergency triage web application. **Clinical Vitality** bridges advanced veterinary AI diagnostic precision with clinical trustworthiness and approachable warmth, providing pet parents and clinicians with real-time vitals monitoring, diagnostic intelligence, Google Maps-grounded emergency hospital navigation, and on-demand voice transcription.

---

## 🌟 Key Features

### 1. 🩺 Vitality Dashboard & Real-Time Telemetry
- **Clinical Biomarkers:** Live telemetry tracking of Resting Respiratory Rate (RRR), Core Body Temperature (°F), Glasgow Composite Pain Scale (0–10), and Hydration Index with capillary refill time (CRT).
- **Interactive 30-Second RRR Breath Counter:** Tap-to-count tool allowing owners to measure sleeping or resting breathing rate, with automated breaths-per-minute (BPM) calculation and tachypnea alerts (>30 bpm).
- **Body Weight Trajectory:** 6-month historical curve with Body Condition Score (BCS 5/9) validation.
- **Multi-Patient Switching:** Seamless profile toggling across companions (Luna, Barnaby, Milo, Cleo) and registration of new pet records.

### 2. ⚡ AI Clinical Symptom Triage Matrix
- **Guided Intake Stepper:** Multi-stage symptom evaluation covering respiratory, gastrointestinal, spinal/orthopedic, and dermatologic signs.
- **Physiologic Grading:** Integrates duration, breathing rate, and mucous membrane (gum color) status (Pink, Pale White, Cyanotic, Brick Red, Jaundiced).
- **Differential Diagnoses:** Probability-ranked differentials (e.g. IVDD Hansen Type I, Acute GDV Bloat, Feline FLUTD Blockage, Otitis Externa) with clinical descriptions and matched symptom tags.
- **Action Protocols & Red-Flag Warnings:** Step-by-step home and transit care plans with immediate emergency hospital warnings.

### 3. 🗺️ Google Maps Directions & Navigation Grounding
- **Maps Grounding with `gemini-3.5-flash`:** Server-side Google Maps tool integration (`tools: [{ googleMaps: {} }]`) providing verified facility hours, trauma designations, and live traffic assessments.
- **Interactive Route Map Embed:** Embedded Google Maps view with driving paths, destination markers, and street views.
- **Turn-by-Turn Checkpoint Guidance:** Step-by-step route directions with distance breakdown, ETA estimates, and maneuver directions.
- **One-Tap GPS Navigation:** Direct deep-link launching turn-by-turn navigation in the native Google Maps app.

### 4. 🎙️ Voice Microphone Transcription (`gemini-3.5-transcribe`)
- **Speech-to-Text Input:** Microphone recording using browser `MediaRecorder` with real-time waveform pulse animations.
- **Model Integration:** Audio chunks transcribed server-side via `@google/genai` utilizing the dedicated `gemini-3.5-transcribe` model.
- **Universal Voice Dictation:**
  - Dictate complex symptom descriptions inside the Triage Intake wizard.
  - Dictate messages to the on-call tele-vet clinician.
  - Speak cross-streets or ZIP codes into the Google Maps directions search.

### 5. 🔍 Omnipresent Global Search Bar
- **Instant Unified Search:** Real-time search across patients, symptoms, medications, emergency clinics, and laboratory diagnostic records.
- **Integrated Voice Mic:** Click the mic icon directly within the search bar to speak queries.

### 6. 🚨 24/7 Emergency Trauma Network & Tele-Vet Hub
- **Trauma Clinic Locator:** Level 1 Emergency Critical Care centers (DACVECC) with driving distance, telephone links, and *"Alert ER We Are En Route"* pre-intake notifications.
- **Live Tele-Triage Room:** Interactive consult simulation with Dr. Sarah Chen, DVM, MRCVS featuring two-way chat, video stream preview, and live vitals telemetry overlay.

### 7. 💊 Pharmacy, Medications & Safety Care Plan
- **Active Regimens:** Carprofen, Gabapentin, Apoquel, and NexGard tracking with 1-click dose administration logging.
- **Supply & Refill Tracking:** Remaining dose progress bars and clinic refill requests.
- **Contraindication Warnings:** Alerts against dangerous human NSAIDs (Ibuprofen, Acetaminophen) and drug interactions.

---

## 🎨 Design System: Clinical Vitality

Crafted to balance modern health-tech authority with calming pet wellness:
- **Palette:**
  - **Primary (Deep Botanical Teal):** `#00685f` / `#008378`
  - **Secondary (Soothing Deep Sky):** `#006398`
  - **Canvas & Surface:** Light warm slate `#faf8ff` / `#ffffff`
  - **Status Signals:** Routine Green (`#10B981`), Caution Amber (`#F59E0B`), Urgent Red (`#EF4444`)
- **Typography:**
  - **Headings & Badges:** `Plus Jakarta Sans`
  - **Body & Clinical Tabular Data:** `Inter`

---

## 🔒 Security & Environment Variables

All secret keys and `.env` files are strictly protected from accidental commits:

1. **`.gitignore` Enforced:**
   ```gitignore
   .env
   .env.local
   .env.*
   !.env.example
   *.pem
   *.key
   credentials.json
   ```
2. **Template File:**
   - `.env.example` provides a secret-free reference template containing placeholder variable names (`GEMINI_API_KEY`).
3. **Server-Side API Proxy:**
   - All AI calls (`gemini-3.5-flash`, `gemini-3.5-transcribe`) run server-side via Express / Vite proxy routes (`/api/*`). The API key is never exposed to the client browser bundle.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd clinical-vitality
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (optional for live Gemini calls):
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY inside .env
   ```

### Running the Application

- **Development Server:**
  ```bash
  npm run dev
  ```
  The app will start at `http://localhost:3000`.

- **Type Check & Lint:**
  ```bash
  npm run lint
  ```

- **Production Build:**
  ```bash
  npm run build
  npm start
  ```

---

## 📄 License
Apache-2.0
