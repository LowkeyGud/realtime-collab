# 🚀 RealTime Collab

> **The ultimate collaborative workspace for modern teams**

A powerful Next.js application that brings teams together with real-time document editing, code collaboration, interactive whiteboards, and AI-powered chat summaries. Built for organizations that value seamless teamwork and productivity.

![Next.js](https://img.shields.io/badge/Next.js-15.3.1-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0--rc-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-Database-orange?style=for-the-badge)
![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?style=for-the-badge)

## ✨ Features

### 📝 **Real-time Document Collaboration**

- **Live editing** with multiple cursors and user presence
- **Rich text editor** powered by TipTap with collaborative extensions
- **Version history** and conflict resolution
- **Document sharing** within organization boundaries

### 💻 **Code Collaboration**

- **Monaco Editor** integration for professional code editing
- **Live code sharing** with syntax highlighting
- **Multi-language support** for development teams
- **Real-time synchronization** using Yjs protocol

### 🎨 **Interactive Whiteboards**

- **Digital canvas** for brainstorming and visual collaboration
- **Drawing tools** with perfect freehand rendering
- **Shape tools** and text annotations
- **Real-time multiplayer** drawing experience

### 💬 **AI-Powered Chat**

- **Organization-wide messaging** with image support
- **AI-generated summaries** using Google Gemini
- **Smart conversation insights** highlighting key decisions and action items
- **File sharing** with drag-and-drop support

### 🏢 **Organization Management**

- **Clerk-powered authentication** with enterprise-grade security
- **Organization-based access control** - all collaboration happens within orgs
- **Member management** and role-based permissions
- **Secure workspace isolation**

## 🛠️ Tech Stack

| Technology        | Purpose                                | Version   |
| ----------------- | -------------------------------------- | --------- |
| **Next.js**       | React framework with App Router        | 15.3.1    |
| **React**         | UI library                             | 19.0.0-rc |
| **TypeScript**    | Type safety                            | 5.0       |
| **Convex**        | Real-time database & backend           | 1.24.0    |
| **Clerk**         | Authentication & org management        | 6.18.0    |
| **Liveblocks**    | Real-time collaboration infrastructure | 2.24.3    |
| **TipTap**        | Rich text editor                       | 2.11.7    |
| **Monaco Editor** | Code editor                            | 4.5.1     |
| **Google Gemini** | AI for chat summaries                  | 0.24.1    |
| **Tailwind CSS**  | Styling                                | 4.0       |
| **Radix UI**      | Accessible components                  | Latest    |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Convex account
- Clerk account
- Google AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/realtime-collab.git
   cd realtime-collab
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Convex Database
   CONVEX_DEPLOYMENT=your-deployment-name
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

   # Google AI (Gemini)
   GEMINI_API_KEY=your-gemini-api-key

   # Liveblocks (for real-time features)
   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_live_...
   LIVEBLOCKS_SECRET_KEY=sk_live_...
   ```

4. **Set up Convex**

   ```bash
   npx convex dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started

1. **Sign up** and create your organization
2. **Invite team members** to your organization
3. **Start collaborating** on documents, code, or whiteboards
4. **Use chat** to communicate and get AI-powered summaries

### Key Workflows

- **Documents**: Create rich text documents with real-time editing
- **Code**: Share and edit code files with syntax highlighting
- **Whiteboard**: Brainstorm visually with drawing tools
- **Chat**: Communicate with automatic AI summaries of conversations

## 🔧 Configuration

### Database Schema (Convex)

The app uses Convex for real-time data synchronization with schemas for:

- Organizations and members
- Documents and versions
- Chat messages and groups
- Whiteboard data
- User presence and cursors

### Authentication (Clerk)

- Organization-based access control
- SSO support for enterprise
- Role-based permissions
- Secure session management

## 🎨 UI/UX

- **Dark/Light mode** support with next-themes
- **Responsive design** for desktop and mobile
- **Accessible components** using Radix UI
- **Smooth animations** with Framer Motion
- **Professional styling** with Tailwind CSS

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Other Platforms

The app can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- Docker containers

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Liveblocks](https://liveblocks.io) for real-time collaboration infrastructure
- [Convex](https://convex.dev) for the real-time database
- [Clerk](https://clerk.com) for authentication and organization management
- [Vercel](https://vercel.com) for deployment platform

---

<div align="center">
  <strong>Built with ❤️ for modern collaborative teams</strong>
</div>

## Contributors
- - [@Surajj042](https://github.com/Surajj042) (Suraj Gurung)
- - [@LowkeyGud](https://github.com/LowkeyGud) (Chandramani Regmi)

This project was built in collaboration.
