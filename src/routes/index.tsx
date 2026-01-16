import { lazy } from 'react'
import { Navigate, type RouteProps } from 'react-router-dom'

const Dashboards = lazy(() => import('@/app/(admin)/dashboards/page'))

// Clients Module
const ClientsList = lazy(() => import('@/app/(admin)/clients/page'))
const ClientDetail = lazy(() => import('@/app/(admin)/clients/[id]/page'))
const ClientCreate = lazy(() => import('@/app/(admin)/clients/create/page'))
const ClientEdit = lazy(() => import('@/app/(admin)/clients/[id]/edit/page'))

// Appointments Module
const AppointmentsList = lazy(() => import('@/app/(admin)/appointments/page'))
const AppointmentDetail = lazy(() => import('@/app/(admin)/appointments/[id]/page'))
const AppointmentCreate = lazy(() => import('@/app/(admin)/appointments/create/page'))
const AppointmentEdit = lazy(() => import('@/app/(admin)/appointments/[id]/edit/page'))

// Cases Module
const CasesList = lazy(() => import('@/app/(admin)/cases/page'))
const CaseDetail = lazy(() => import('@/app/(admin)/cases/[id]/page'))
const CaseCreate = lazy(() => import('@/app/(admin)/cases/create/page'))
const CaseEdit = lazy(() => import('@/app/(admin)/cases/[id]/edit/page'))

// Audit Logs Module (VP-only)
const AuditLogsList = lazy(() => import('@/app/(admin)/audit-logs/page'))

// Notifications Module (all authenticated users)
const NotificationsList = lazy(() => import('@/app/(admin)/notifications/page'))

// Users Module (VP full access, Secretary limited)
const UsersList = lazy(() => import('@/app/(admin)/users/page'))

// Settings Module (VP/Secretary, Protocol redirected)
const SettingsPage = lazy(() => import('@/app/(admin)/settings/page'))

// Auth Routes
const AuthSignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'))
const AuthSignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-password/page'))
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'))
const Error404 = lazy(() => import('@/app/(other)/error-pages/pages-404/page'))

export type RoutesProps = {
  path: RouteProps['path']
  name: string
  element: RouteProps['element']
  exact?: boolean
}

const initialRoutes: RoutesProps[] = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboards" />,
  },
]

const generalRoutes: RoutesProps[] = [
  {
    path: '/dashboards',
    name: 'Dashboards',
    element: <Dashboards />,
  },
]

export const authRoutes: RoutesProps[] = [
  {
    name: 'Sign In',
    path: '/auth/sign-in',
    element: <AuthSignIn />,
  },
  {
    name: 'Sign Up',
    path: '/auth/sign-up',
    element: <AuthSignUp />,
  },

  {
    name: 'Reset Password',
    path: '/auth/reset-password',
    element: <ResetPassword />,
  },
  {
    name: 'Lock Screen',
    path: '/auth/lock-screen',
    element: <LockScreen />,
  },
  {
    name: '404 Error',
    path: '/error-pages/pages-404',
    element: <Error404 />,
  },
]

// Guests Routes (formerly Clients)
const clientsRoutes: RoutesProps[] = [
  { path: '/clients', name: 'Guests', element: <ClientsList /> },
  { path: '/clients/create', name: 'Create Guest', element: <ClientCreate /> },
  { path: '/clients/:id', name: 'Guest Detail', element: <ClientDetail /> },
  { path: '/clients/:id/edit', name: 'Edit Guest', element: <ClientEdit /> },
]

// Appointments Routes
const appointmentsRoutes: RoutesProps[] = [
  { path: '/appointments', name: 'Appointments', element: <AppointmentsList /> },
  { path: '/appointments/create', name: 'Create Appointment', element: <AppointmentCreate /> },
  { path: '/appointments/:id', name: 'Appointment Detail', element: <AppointmentDetail /> },
  { path: '/appointments/:id/edit', name: 'Edit Appointment', element: <AppointmentEdit /> },
]

// Cases Routes
const casesRoutes: RoutesProps[] = [
  { path: '/cases', name: 'Cases', element: <CasesList /> },
  { path: '/cases/create', name: 'Create Case', element: <CaseCreate /> },
  { path: '/cases/:id', name: 'Case Detail', element: <CaseDetail /> },
  { path: '/cases/:id/edit', name: 'Edit Case', element: <CaseEdit /> },
]

// Audit Logs Routes (VP-only, page handles role enforcement)
const auditLogsRoutes: RoutesProps[] = [
  { path: '/audit-logs', name: 'Audit Logs', element: <AuditLogsList /> },
]

// Notifications Routes (all authenticated users)
const notificationsRoutes: RoutesProps[] = [
  { path: '/notifications', name: 'Notifications', element: <NotificationsList /> },
]

// Users Routes (VP full access, Secretary limited, Protocol blocked)
const usersRoutes: RoutesProps[] = [
  { path: '/users', name: 'User Management', element: <UsersList /> },
]

// Settings Routes (VP/Secretary, Protocol redirected)
const settingsRoutes: RoutesProps[] = [
  { path: '/settings', name: 'Settings', element: <SettingsPage /> },
]

export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...clientsRoutes,
  ...appointmentsRoutes,
  ...casesRoutes,
  ...auditLogsRoutes,
  ...notificationsRoutes,
  ...usersRoutes,
  ...settingsRoutes,
]
