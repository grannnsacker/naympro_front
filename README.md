# Job Finder Frontend

A React-based frontend application for the Job Finder platform. This application allows users to search for jobs, view job details, and apply for positions. It also provides functionality for employers to post jobs and manage applications.

## Features

- User and Employer Authentication
- Job Search with Filters
- Job Details View
- Job Application System
- Responsive Material-UI Design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd job-finder-front
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add the following:
```env
VITE_API_URL=http://localhost:8080/api/v1
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/     # React components
  │   ├── auth/      # Authentication components
  │   └── jobs/      # Job-related components
  ├── services/      # API services
  ├── store/         # Redux store configuration
  ├── types/         # TypeScript type definitions
  ├── App.tsx        # Main application component
  └── main.tsx       # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Technologies Used

- React
- TypeScript
- Redux Toolkit
- Material-UI
- Vite
- React Router
- Axios 