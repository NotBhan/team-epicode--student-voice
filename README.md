
# Project Title:- StudentVoice: Anonymous Campus Feedback Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

## Team Details:-
- Team Name:- Epicode (team number 49)
- Team Members:- Chandrabhan Mahato (Leader), Mohammad Saif (Member), Deepak Kumar Singh (Member), Bhumika Shukla (Member)

## Problem Statement: Build a secure and anonymous platform for students to raise issues, complaints, or suggestions to college authorities without fear of exposure.

## Project Description:
**StudentVoice** is a safe, anonymous platform which helps fill the void for students to communicate with college administration. It gives students the ability to report issues, provide feedback, and work together to prioritize areas that need attention in order to build an improved, more responsive, and transparent campus.

---

## 🚀 Key Features

### For Students:
- **Anonymous Submissions**: Notify issues anonymously. No accounts or personal information are needed for basic submission.
- **Identity (optional)**: For issues where context matters most, students can optionally reveal their name, year, and branch to provide a persona for their complaint. 
- **Priority Points**: Each student has a "Priority Points" budget for the season to spend on the complaints which mean the most to them. This gamification enables administration to see what bigger priorities are worth solving.
- **Community Prioritization**: The problems with the highest spend of priority points will rise to the top, allowing community priorities to rise to the top.
- **AI-Aided**:
    - **Smart Hashtag Generating**: An AI assistant provides appropriate hashtags based on the description for efficient categorization and searching.
    - **Photo Authenticity Scan**: To keep our submission's integrity, an AI model scans photos uploaded to check if it was AI generated.
- **Transparent Tracking**: Track the status of any complaint with a unique tracking ID from submission, until resolution.
- **AI Quick Assist Chat**: Our empathetic AI chatbot powered by Gemini, helps with FAQs and help to clearly explain a problem to submit it clearly.
  
### For Administrators:
- **Secure Admin Dashboard**: Role-based access control for faculty and administrators to manage and respond to complaints.
- **All Complaints Overview**: See all complaints submitted, filter, and sort complaints by status, priority, and date.
- **Comprehensive Analytics**: Graphically see complaint data (status and trends over time) to understand what issues are affecting the campus.
- **User Management**: A Faculty Head role can manage faculty access.
- **Direct Messaging**: Administrators can reply directly to the message threads of complaints when they need to update students or request more information.

---

## 🛠 Tech Stack & Architecture


StudentVoice is built on a modern, solid, and scalable tech stack.


- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI**: [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI/Generative**: [Google's Gemini via Genkit](https://firebase.google.com/docs/genkit)
- **Authentication**: This is a mock authentication system set up for prototyping.
- **Database**: The project is using a .json file data store (in `src/lib/data`) for rapid prototyping (Firestore and Firebase which were intended to be used, had some authentication issues), and pushing all data reads/writes/responses through the server, via Next.js Server Actions.


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


To get a local copy up and running, follow these steps.


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
3. Start the development server 
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


---


## 🤝 Contributing


Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.


If you have a suggestion that would make this better, please fork the repo, and create a pull request. You can also simply open an issue with the tag "enhancement".


1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**


Don't forget to give the project a star! Thanks again!


---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
