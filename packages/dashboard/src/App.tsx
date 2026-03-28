import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<div>Dashboard Home</div>} />
            <Route path="/campaigns" element={<div>Campaigns</div>} />
            <Route path="/campaigns/new" element={<div>New Campaign</div>} />
            <Route path="/campaigns/:id" element={<div>Campaign Detail</div>} />
            <Route path="/segments" element={<div>Segments</div>} />
            <Route path="/segments/new" element={<div>New Segment</div>} />
            <Route path="/users" element={<div>Users</div>} />
            <Route path="/users/:id" element={<div>User Detail</div>} />
            <Route path="/events" element={<div>Events</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
