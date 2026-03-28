import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { CampaignListPage } from '@/pages/campaigns/CampaignListPage';
import { CampaignCreatePage } from '@/pages/campaigns/CampaignCreatePage';
import { CampaignDetailPage } from '@/pages/campaigns/CampaignDetailPage';
import { SegmentListPage } from '@/pages/segments/SegmentListPage';
import { SegmentCreatePage } from '@/pages/segments/SegmentCreatePage';
import { UserListPage } from '@/pages/users/UserListPage';
import { UserDetailPage } from '@/pages/users/UserDetailPage';
import { EventListPage } from '@/pages/events/EventListPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/campaigns" element={<CampaignListPage />} />
            <Route path="/campaigns/new" element={<CampaignCreatePage />} />
            <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="/segments" element={<SegmentListPage />} />
            <Route path="/segments/new" element={<SegmentCreatePage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/:id" element={<UserDetailPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
