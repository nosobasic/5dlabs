import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

// Get the publishable key from environment variables
// Vite exposes env vars prefixed with VITE_ at build time
// The key must be set in Vercel project settings under Environment Variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  const errorMessage = 'Missing VITE_CLERK_PUBLISHABLE_KEY. Please set this environment variable in Vercel project settings for Production, Preview, and Development environments.'
  console.error(errorMessage)
  
  // In development, show a helpful error page
  if (import.meta.env.DEV) {
    createRoot(document.getElementById('root')).render(
      <StrictMode>
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Configuration Error</h1>
            <p className="mb-4">Missing VITE_CLERK_PUBLISHABLE_KEY environment variable.</p>
            <p className="text-sm text-gray-400">Please set this variable in your Vercel project settings.</p>
          </div>
        </div>
      </StrictMode>
    )
  } else {
    // In production, throw error to fail fast
    throw new Error(errorMessage)
  }
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}
