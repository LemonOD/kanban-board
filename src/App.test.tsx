import { render, screen } from "@testing-library/react"
import App from "./App"

jest.mock("./pages/BoardPage", () => ({
  BoardPage: () => <div data-testid="board-page">Board Page</div>
}))

jest.mock("./pages/SettingsPage", () => ({
  SettingsPage: () => <div data-testid="settings-page">Settings Page</div>
}))

jest.mock("./pages/IssueDetailPage", () => ({
  IssueDetailPage: () => <div data-testid="issue-detail-page">Issue Detail Page</div>
}))

jest.mock("./components/Navigation", () => ({
  Navigation: () => <div data-testid="navigation">Navigation Component</div>
}))

describe("App Component", () => {
  beforeEach(() => {
    // Mock matchMedia for theme detection
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  test("renders the application structure", () => {
    render(<App />)

    // Should render the main structure
    expect(screen.getByTestId("navigation")).toBeInTheDocument()
  })

  test("renders with correct CSS classes", () => {
    render(<App />)

    // Should have the main container with proper classes
    const mainContainer = document.querySelector('.min-h-screen')
    expect(mainContainer).toBeInTheDocument()
  })
})
