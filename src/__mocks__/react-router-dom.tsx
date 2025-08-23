import React from 'react'

export const BrowserRouter = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="router">{children}</div>
)

export const Routes = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="routes">{children}</div>
)

export const Route = ({ element }: { element: React.ReactNode }) => (
  <div data-testid="route">{element}</div>
)

export const Navigate = () => <div data-testid="navigate">Navigate</div>

export const Link = ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
  <a href={to} className={className} data-testid={`link-${to}`}>{children}</a>
)

export const useLocation = () => ({ pathname: "/board" })
