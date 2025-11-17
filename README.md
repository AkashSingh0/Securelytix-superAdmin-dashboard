# Next.js 14 Login Page & Dashboard

A modern Next.js 14 application with TypeScript, Tailwind CSS, and shadcn/ui featuring a login page and a comprehensive dashboard with chatbot integration.

## 🚀 Features

- **Login Page**: Beautiful, centered login form with gradient background
- **Dashboard**: 3-column layout with:
  - Left sidebar navigation
  - Main content area
  - Right chatbot panel
- **Dashboard Pages**:
  - Leads list
  - Get One Lead (detailed view)
  - Contact list
  - Get One Contact (detailed view)

## 🛠️ Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React Icons
- React Hook Form (available for form handling)

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
app/
├── (auth)/
│   ├── layout.tsx
│   └── login/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   └── dashboard/
│       ├── page.tsx (redirects to /dashboard/leads)
│       ├── leads/
│       │   └── page.tsx
│       ├── get-one-lead/
│       │   └── page.tsx
│       ├── contact/
│       │   └── page.tsx
│       └── get-one-contact/
│           └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx

components/
└── ui/
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── label.tsx
    └── avatar.tsx
```

## 🎨 Usage

1. **Login**: Navigate to `/login` and enter any email/password to access the dashboard (mock authentication).

2. **Dashboard Navigation**: Use the left sidebar to navigate between different pages:
   - Leads
   - Get One Lead
   - Contact
   - Get One Contact

3. **Chatbot**: The right sidebar contains a persistent chatbot panel where you can send and receive messages.

## 🔧 Customization

- All components use shadcn/ui and can be customized via Tailwind CSS
- Mock data is hardcoded in each page component - replace with API calls as needed
- Authentication is currently mocked - implement real authentication as needed

## 📝 Notes

- The login form uses mock authentication - any credentials will work
- All dashboard pages display mock data
- The chatbot provides mock responses

## 🚀 Build for Production

```bash
npm run build
npm start
```

