
# StudentVoice: Anonymous Campus Feedback Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**StudentVoice** is a secure, anonymous platform designed to bridge the communication gap between students and college administration. It empowers students to report issues, share feedback, and collectively prioritize problems that need attention, fostering a more responsive and transparent campus environment.

---

## 🚀 Key Features

### For Students:
- **Anonymous Submissions**: Report issues with complete anonymity. No user accounts or personal data are required for basic submissions.
- **Optional Identity Reveal**: For issues where context is important, students can optionally reveal their name, year, and branch, giving their complaints a personal voice.
- **Priority Point System**: Each student receives a seasonal budget of "Priority Points" to invest in complaints that matter most to them. This gamified approach helps administration identify high-priority issues.
- **Community-Driven Prioritization**: Problems with the highest investment of priority points rise to the top, ensuring that the most pressing issues are addressed first.
- **AI-Powered Assistance**:
    - **Smart Hashtag Generation**: An AI assistant suggests relevant hashtags based on the problem description, improving categorization and searchability.
    - **Image Authenticity Check**: To maintain the integrity of submissions, an AI model analyzes uploaded images to detect if they are AI-generated.
- **Transparent Tracking**: Follow the status of any complaint using a unique tracking ID, from submission to resolution.
- **AI Quick Assist Chat**: An empathetic AI chatbot, powered by Gemini, is available to answer FAQs and help students articulate their problems clearly before submission.

### For Administration:
- **Secure Admin Dashboard**: A role-based access control system for faculty and administrators to manage and respond to complaints.
- **Comprehensive Complaint Management**: View, filter, and sort all submitted complaints by status, priority, or date.
- **Detailed Analytics**: Visualize complaint data, including status distribution and trends over time, to gain insights into campus-wide issues.
- **User Management**: A "Faculty Head" role can manage access for other faculty members.
- **Direct Engagement**: Admins can reply directly to complaint threads to provide updates or ask for more information.

---

## 🛠 Tech Stack & Architecture

StudentVoice is built with a modern, robust, and scalable tech stack.

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Google's Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **Authentication**: A mock authentication system is implemented for prototyping purposes.
- **Database**: The project uses a file-based data store (`.json` files in `src/lib/data`) for rapid prototyping. All data operations are handled server-side via Next.js Server Actions.

### Project Structure
```
/
├── src/
│   ├── app/                # Next.js App Router: Pages and layouts
│   │   ├── (main)/         # Routes for student-facing pages
│   │   └── admin/          # Routes for the admin dashboard
│   ├── ai/                 # Genkit flows for AI features
│   ├── components/         # Reusable React components (UI, layout, charts)
│   ├── hooks/              # Custom React hooks (e.g., useAuth, useComplaints)
│   ├── lib/                # Utilities, types, and mock data
│   └── services/           # Server-side logic for data operations
└── ...
```

---

## 🔧 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
- Node.js (v18 or later)
- npm or yarn

### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/your-username/studentvoice.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the development server
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Don't forget to give the project a star! Thanks again!

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
