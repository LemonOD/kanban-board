import { render, screen, fireEvent } from "@testing-library/react"
import { UserProvider, useUser } from "../UserContext"

// Test component to access context
const TestComponent = () => {
  const { user, canEdit, canMoveIssues, canUpdatePriority, canMarkResolved, switchRole } = useUser()
  
  return (
    <div>
      <div data-testid="user-name">{user.name}</div>
      <div data-testid="user-role">{user.role}</div>
      <div data-testid="can-edit">{canEdit.toString()}</div>
      <div data-testid="can-move">{canMoveIssues.toString()}</div>
      <div data-testid="can-update">{canUpdatePriority.toString()}</div>
      <div data-testid="can-resolve">{canMarkResolved.toString()}</div>
      <button onClick={() => switchRole("contributor")} data-testid="switch-to-contributor">
        Switch to Contributor
      </button>
      <button onClick={() => switchRole("admin")} data-testid="switch-to-admin">
        Switch to Admin
      </button>
    </div>
  )
}

describe("UserContext", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  test("provides default user information", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    expect(screen.getByTestId("user-name")).toHaveTextContent("Alice")
    expect(screen.getByTestId("user-role")).toHaveTextContent("admin")
  })

  test("provides correct permissions for admin role", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    expect(screen.getByTestId("can-edit")).toHaveTextContent("true")
    expect(screen.getByTestId("can-move")).toHaveTextContent("true")
    expect(screen.getByTestId("can-update")).toHaveTextContent("true")
    expect(screen.getByTestId("can-resolve")).toHaveTextContent("true")
  })

  test("switches user role to contributor", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    // Initially admin
    expect(screen.getByTestId("user-role")).toHaveTextContent("admin")
    expect(screen.getByTestId("can-edit")).toHaveTextContent("true")

    // Switch to contributor
    fireEvent.click(screen.getByTestId("switch-to-contributor"))

    // Should now be contributor with restricted permissions
    expect(screen.getByTestId("user-role")).toHaveTextContent("contributor")
    expect(screen.getByTestId("can-edit")).toHaveTextContent("false")
    expect(screen.getByTestId("can-move")).toHaveTextContent("false")
    expect(screen.getByTestId("can-update")).toHaveTextContent("false")
    expect(screen.getByTestId("can-resolve")).toHaveTextContent("false")
  })

  test("switches user role back to admin", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    // Switch to contributor first
    fireEvent.click(screen.getByTestId("switch-to-contributor"))
    expect(screen.getByTestId("user-role")).toHaveTextContent("contributor")

    // Switch back to admin
    fireEvent.click(screen.getByTestId("switch-to-admin"))
    expect(screen.getByTestId("user-role")).toHaveTextContent("admin")
    expect(screen.getByTestId("can-edit")).toHaveTextContent("true")
  })

  test("persists role in localStorage", () => {
    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    // Switch to contributor
    fireEvent.click(screen.getByTestId("switch-to-contributor"))

    // Check that localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith("dev-user-role", "contributor")
  })

  test("loads role from localStorage on mount", () => {
    // Set role in localStorage before rendering
    localStorage.getItem = jest.fn().mockReturnValue("contributor")

    render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    )

    // Should load contributor role from localStorage
    expect(screen.getByTestId("user-role")).toHaveTextContent("contributor")
    expect(screen.getByTestId("can-edit")).toHaveTextContent("false")
  })
})
