# React Kanban Issue Board

A React-based Kanban board clone application for managing issues with drag-and-drop functionality, search/filter capabilities, and role-based access control.

## Features

- **Board View**: Display issues in Backlog, In Progress, and Done columns
- **Issue Management**: Move issues between columns with optimistic updates
- **Search & Filter**: Live search by title/tags, filter by assignee/severity
- **Priority Scoring**: Custom algorithm for issue prioritization
- **Recently Accessed**: Track and display last 5 visited issues
- **Role-Based Access**: Admin and contributor permissions
- **Undo Functionality**: 5-second undo window for issue updates
- **Real-time Updates**: Polling every 10 seconds

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or extract the project
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
├── pages/              # Page components (Board, Issue Detail, Settings)
├── contexts/           # React contexts (User context)
├── data/               # Sample data (issues.json)
├── utils/              # Utility functions (API, localStorage)
├── constants/          # App constants (current user)
├── types.ts            # TypeScript type definitions
└── App.tsx             # Main app component with routing
\`\`\`

## Usage

### User Roles

- **Admin**: Can move issues, update priorities, mark as resolved
- **Contributor**: Read-only access to view issues

Switch between roles in the Settings page for testing.

### Key Components

- **BoardPage**: Main Kanban board with three columns
- **IssueDetailPage**: Detailed view of individual issues
- **SearchAndFilters**: Search and filtering controls
- **RecentlyAccessedSidebar**: Quick access to recently viewed issues
