import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import MemberLayout from '../layouts/MemberLayout';
import ClientLayout from '../layouts/ClientLayout';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import LoginPage from '../pages/auth/LoginPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';
import DashboardPage from '../pages/admin/DashboardPage';
import ProjectsPage from '../pages/admin/ProjectsPage';
import AdminProjectDetailPage from '../pages/admin/ProjectDetailPage';
import UsersPage from '../pages/admin/UsersPage';
import ActivityLogsPage from '../pages/admin/ActivityLogsPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import MyProjectsPage from '../pages/member/MyProjectsPage';
import MemberProjectDetailPage from '../pages/member/ProjectDetailPage';
import MemberProfilePage from '../pages/member/ProfilePage';
import ClientPortalPage from '../pages/client/ClientPortalPage';
import ClientMilestonesPage from '../pages/client/MilestonesPage';
import ClientProfilePage from '../pages/client/ProfilePage';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/unauthorized', element: <UnauthorizedPage /> }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleRoute roles={['admin']} />,
        children: [{ path: '/admin', element: <AdminLayout />, children: [
          { index: true, element: <DashboardPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'projects/:id', element: <AdminProjectDetailPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'logs', element: <ActivityLogsPage /> },
          { path: 'analytics', element: <AnalyticsPage /> }
        ] }]
      },
      {
        element: <RoleRoute roles={['member']} />,
        children: [{ path: '/member', element: <MemberLayout />, children: [
          { index: true, element: <Navigate to="/member/projects" replace /> },
          { path: 'projects', element: <MyProjectsPage /> },
          { path: 'projects/:id', element: <MemberProjectDetailPage /> },
          { path: 'profile', element: <MemberProfilePage /> }
        ] }]
      },
      {
        element: <RoleRoute roles={['client']} />,
        children: [{ path: '/client', element: <ClientLayout />, children: [
          { index: true, element: <ClientPortalPage /> },
          { path: 'milestones', element: <ClientMilestonesPage /> },
          { path: 'profile', element: <ClientProfilePage /> }
        ] }]
      }
    ]
  },
  { path: '*', element: <Navigate to="/login" replace /> }
]);
