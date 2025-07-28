# Development Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Firebase for development:**
   ```bash
   npm run setup:firebase:quick
   ```

3. **Start development server with Firebase emulators:**
   ```bash
   npm run dev:firebase:ui
   ```

## Development URLs

- **Next.js App**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run dev:firebase` - Start Next.js + Firebase emulators
- `npm run dev:firebase:ui` - Start Next.js + Firebase emulators with UI
- `npm run firebase:emulators` - Start Firebase emulators only
- `npm run firebase:emulators:ui` - Start Firebase emulators with UI
- `npm run firebase:emulators:export` - Export emulator data
- `npm run firebase:emulators:import` - Import emulator data

## Testing Forms

1. Navigate to http://localhost:3000/forms
2. Test Comprehensive Parameter Validation form
3. Test Advanced Clinical Analytics form
4. Check Firebase emulator UI for data

## Development Data

Sample data is available in `scripts/dev-data.json` for testing purposes.

## Troubleshooting

- If emulators fail to start, try: `firebase emulators:start --only firestore,auth`
- If ports are in use, modify ports in `firebase.json`
- For authentication issues, check Firebase emulator UI
