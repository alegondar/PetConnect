import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const FeedPage = lazy(() => import('./pages/FeedPage'))
const PetFriendlyPage = lazy(() => import('./pages/PetFriendlyPage'))
const MyPetsPage = lazy(() => import('./pages/MyPetsPage'))
const PetDetailPage = lazy(() => import('./pages/PetDetailPage'))
const InstaPetPage = lazy(() => import('./pages/InstaPetPage'))
const FollowingPage = lazy(() => import('./pages/FollowingPage'))
const LostPetsPage = lazy(() => import('./pages/LostPetsPage'))
const LostPetDetailPage = lazy(() => import('./pages/LostPetDetailPage'))
const AdoptionsPage = lazy(() => import('./pages/AdoptionsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <FeedPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ranking"
                element={<Navigate to="/pet-friendly" replace />}
              />
              <Route
                path="/pet-friendly"
                element={
                  <ProtectedRoute>
                    <PetFriendlyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-pets"
                element={
                  <ProtectedRoute>
                    <MyPetsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pets/:petId"
                element={
                  <ProtectedRoute>
                    <PetDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instapet/:petId"
                element={
                  <ProtectedRoute>
                    <InstaPetPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/following"
                element={
                  <ProtectedRoute>
                    <FollowingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lost-pets/:id"
                element={
                  <ProtectedRoute>
                    <LostPetDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/lost-pets"
                element={
                  <ProtectedRoute>
                    <LostPetsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/adoptions"
                element={
                  <ProtectedRoute>
                    <AdoptionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/settings/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
