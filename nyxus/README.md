# 🌌 NYXUS

**NYXUS** is a high-fidelity, cyber-themed communication platform designed for privacy, ephemerality, and secure collaboration. Built with **Next.js 15**, **Framer Motion**, and **Lucide React**, it offers a premium user experience with zero-trace architecture and real-time moderation.

![Nyxus Banner](https://raw.githubusercontent.com/ShoryaRanjan0507/ShadowVault/main/public/banner.png) *(Note: Add your own banner image here)*

---

## ⚡ Core Features

### 👻 Phantom Vaults (Ephemeral)
- Create temporary chat rooms with a self-destruct timer.
- Secured by a unique **6-digit One-Time Passcode (OTP)** generated upon creation.
- Zero trace: Once the timer hits zero, the room and its messages are purged from the memory buffers.

### 🏛️ Permanent Vaults (Maker Control)
- Persistent chat rooms for long-term operations.
- Full moderation tools for the vault creator (The Maker).
- Secure membership management and ban protocols.

### 🛡️ Safety API & Moderation
- Real-time heuristic filtering to intercept illegal or malicious transmissions.
- Integrated **Dev Dashboard** for platform-wide moderation.
- Automated banishment protocols for repeated safety violations.

### 📧 Shadow Support Node
- Integrated encrypted support channel (`Help & Support`).
- Queries are transmitted directly to the administrative panel for technical operative review.

---

## 🎨 Design Philosophy

Nyxus follows a **Cyber-Glassmorphism** aesthetic:
- **Dark Mode First**: Deep `#050508` backgrounds with purple and fuchsia accents.
- **Micro-Animations**: Powered by Framer Motion for scroll-triggered scaling and entry transitions.
- **Professional Iconography**: Leveraging the full Lucide React vector library for a sleek, mature look.
- **Zero Browser Defaults**: Every alert, modal, and confirmation is custom-built to ensure a cohesive, immersive experience.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: Local JSON Storage (Scalable to PostgreSQL/Prisma)
- **Deployment**: Optimized for [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm / yarn / pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShoryaRanjan0507/ShadowVault.git
   cd ShadowVault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the Vault:**
   Open [http://localhost:3000](http://localhost:3000) in your secure browser.

---

## 👨‍💻 Developer Panel

Administrative access is restricted to users with the `dev` role. The panel allows:
- Monitoring of Safety API logs.
- Bulk banishment of violators.
- Reviewing inbound Support Transmissions and User Feedback.

---

## 📜 License

This project is part of the **Nyxus Protocol**. All automated rights reserved.

---

> **"In the void, silence is security."** 🌑
