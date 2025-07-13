import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import './App.css'
import './styles/onboarding.css'
import './styles/components.css'
import MerchantOnboarding from './components/MerchantOnboarding'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'

function App() {
  const { user } = useUser()

  return (
    <ErrorBoundary>
      <div className="app">
        <header className="header">
          <h1>Relaxify Admin Dashboard</h1>
          <div className="auth-section">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="sign-in-btn">Sign in</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="user-info">
                <span>Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </header>

      <main className="main-content">
        <SignedOut>
          <div className="welcome-section">
            <h2>Spa & Salon Management Dashboard</h2>
            <p>Manage your bookings, services, and calendar all in one place.</p>
            <SignInButton mode="modal">
              <button className="get-started-btn">Get Started</button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          {/* TODO: Check if user has completed merchant onboarding */}
          {!user?.publicMetadata?.merchantOnboarded ? (
            <MerchantOnboarding />
          ) : (
            <div className="dashboard">
              <div className="dashboard-grid">
                <div className="card">
                  <h3>Today's Bookings</h3>
                  <p className="stat">0</p>
                </div>
                <div className="card">
                  <h3>This Week's Revenue</h3>
                  <p className="stat">QAR 0</p>
                </div>
                <div className="card">
                  <h3>Active Services</h3>
                  <p className="stat">0</p>
                </div>
                <div className="card">
                  <h3>Customer Reviews</h3>
                  <p className="stat">0</p>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn">Add Service</button>
                  <button className="action-btn">View Calendar</button>
                  <button className="action-btn">Manage Bookings</button>
                  <button className="action-btn">View Reports</button>
                </div>
              </div>
            </div>
          )}
        </SignedIn>
      </main>
      </div>
    </ErrorBoundary>
  )
}

export default App
