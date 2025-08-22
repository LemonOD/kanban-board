import { render, screen } from "@testing-library/react"
import App from "./App"

describe("App Component", () => {
  test("renders the kanban board application", () => {
    render(<App />)

    // Should render navigation
    expect(screen.getByText("Board")).toBeInTheDocument()
    expect(screen.getByText("Settings")).toBeInTheDocument()

    // Should render the board page by default
    expect(screen.getByText("Board Page")).toBeInTheDocument()
  })

  test("renders user information in navigation", () => {
    render(<App />)

    expect(screen.getByText("Welcome, Alice")).toBeInTheDocument()
    expect(screen.getByText("admin")).toBeInTheDocument()
  })

  test("renders dark mode toggle", () => {
    render(<App />)

    // Should have dark mode toggle button
    const toggleButton = screen.getByTitle(/Switch to .* mode/)
    expect(toggleButton).toBeInTheDocument()
  })
})
