import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { BoardPage } from "./pages/BoardPage"
import { IssueDetailPage } from "./pages/IssueDetailPage"
import { SettingsPage } from "./pages/SettingsPage"
import { Navigation } from "./components/Navigation"
import { UserProvider } from "./contexts/UserContext"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ToastProvider } from "./contexts/ToastContext"
import { PollingProvider } from "./contexts/PollingContext"

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <PollingProvider>
            <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Navigation />
              <main className="max-w-7xl mx-auto px-4 py-6">
                <Routes>
                  <Route path="/board" element={<BoardPage />} />
                  <Route path="/issue/:id" element={<IssueDetailPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/board" />} />
                </Routes>
              </main>
            </div>
          </Router>
          </PollingProvider>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
