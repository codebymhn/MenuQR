# MENUQR

Lets restaurants, cafés and other food businesses create elegant digital menus, customize them, and share them with customers through a QR code.

> **Status: front-end MVP.** The whole product flow is clickable. There is no backend yet: all data is saved in the browser's `localStorage`.

## Features

| Area | What's included |
| --- | --- |
| **Landing page** (`/`) | Hero with a live, scrollable phone preview of a real menu. Scannable QR card, features, paper vs. digital comparison, "How it works", pricing, FAQ, call-to-action banner, footer |
| **Auth** (`/login`, `/signup`) | Mock sign up and log in with form validation. One-click **demo account** (Le Jardin) |
| **Dashboard** (`/dashboard`) | Stats, your menus, a getting-started checklist, quick QR card |
| **My Menus** (`/menus`) | Create (blank or copy of another menu), duplicate, delete, filter and search menus |
| **Menu editor** (`/menus/:id`) | **Content**: categories and dishes, drag-and-drop reordering, image upload, labels (vegetarian, spicy…), sold-out toggle<br>**Design**: 5 themes, brand color, 4 font pairings, 3 layouts (list / cards / minimal), cover image, display options<br>**Settings**: menu name, public link (slug), restaurant info, currency, delete<br>**QR Code**: color, center logo, PNG / SVG download, printable table card<br>Live phone preview next to the editor (full-screen preview on mobile) |
| **Analytics** (`/analytics`) | Views and scans chart, top dishes, busiest hours, device split. Uses demo data for now |
| **Settings** (`/settings`) | Profile, restaurant info, plan (mock Pro upgrade), reset demo data |
| **Public menu** (`/m/:slug`) | The page customers see after scanning: themed, sticky category navigation, dish search, dish detail sheet. Shows a "not published" page for drafts |

Works on phones, with a bottom tab bar and sheet-style dialogs, as in the mobile mockups.

## Tech stack

- [Vite](https://vite.dev) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens are in `src/index.css`)
- React Router 7 · Zustand (saved to `localStorage`) · dnd-kit · qrcode.react · lucide-react
- Self-hosted fonts via Fontsource: Plus Jakarta Sans, Inter, Cormorant Garamond, Playfair Display, Poppins

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build the production bundle into dist/
npm run preview
```

Click **Explore the demo account** on `/login` to load the sample "Le Jardin" restaurant. You can also sign up with any email and a password of 6+ characters.

## Project structure

```
src/
  lib/          types, themes, seed data, demo analytics, helpers
  store/        Zustand app store (persisted) + toast store
  components/
    ui/         Button, Field, Modal, Toaster, ImageUpload, brand assets
    layout/     App shell (sidebar, mobile top bar and bottom nav)
    menu/       MenuView (customer-facing renderer), PhoneFrame, QR export helpers
    editor/     Content / Design / Settings / QR tabs, dish & category modals
  pages/        Landing, Auth, Dashboard, Menus, MenuEditor, Analytics, AccountSettings, PublicMenu
```

`MenuView` is the single renderer for the customer-facing menu. The editor's live preview, the landing hero and the public `/m/:slug` page all use it, so they always match.

## Next steps (backend)

- Real authentication and a database (menus, restaurants, users)
- Image storage (images are currently compressed and stored as data URLs)
- Public menu served from the server, so QR codes work on every device. Right now a menu can only be opened in the browser where it was created
- Real scan and view tracking for analytics, and billing for the Pro plan
