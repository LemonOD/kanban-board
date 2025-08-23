import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ThemeProvider, useTheme } from "../ThemeContext"

// Test component to access context
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    </div>
  )
}

describe("ThemeContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset document classes
    document.documentElement.classList.remove("light", "dark")
    
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

  test("provides default light theme", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })
  })

  test("toggles theme from light to dark", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })

    // Toggle to dark theme
    fireEvent.click(screen.getByTestId("toggle-theme"))
    
    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })
  })

  test("toggles theme from dark to light", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })

    // Toggle to dark first
    fireEvent.click(screen.getByTestId("toggle-theme"))
    
    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })

    // Toggle back to light
    fireEvent.click(screen.getByTestId("toggle-theme"))
    
    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })
  })

  test("persists theme in localStorage", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("light")
    })

    // Toggle to dark theme
    fireEvent.click(screen.getByTestId("toggle-theme"))

    // Check that localStorage was updated
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark")
    })
  })

  test("loads theme from localStorage on mount", async () => {
    // Set theme in localStorage before rendering
    localStorage.getItem = jest.fn().mockReturnValue("dark")

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Should load dark theme from localStorage
    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })
  })

  test("applies theme classes to document root", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Initially light theme
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("light")
      expect(document.documentElement).not.toHaveClass("dark")
    })

    // Toggle to dark theme
    fireEvent.click(screen.getByTestId("toggle-theme"))
    
    await waitFor(() => {
      expect(document.documentElement).toHaveClass("dark")
      expect(document.documentElement).not.toHaveClass("light")
    })
  })

  test("uses system preference when no saved theme", async () => {
    // Mock matchMedia to return dark preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // Should use dark theme based on system preference
    await waitFor(() => {
      expect(screen.getByTestId("current-theme")).toHaveTextContent("dark")
    })
  })
})
