import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { DashboardPage } from '../pages/DashboardPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ServiceHistoryPage } from '../pages/ServiceHistoryPage'
import { ServiceRecordFormPage } from '../pages/ServiceRecordFormPage'
import { SettingsPage } from '../pages/SettingsPage'
import { VehicleDetailPage } from '../pages/VehicleDetailPage'
import { VehicleFormPage } from '../pages/VehicleFormPage'
import { VehiclesPage } from '../pages/VehiclesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'vehicles', element: <VehiclesPage /> },
      { path: 'vehicles/new', element: <VehicleFormPage mode="create" /> },
      { path: 'vehicles/:vehicleId', element: <VehicleDetailPage /> },
      { path: 'vehicles/:vehicleId/edit', element: <VehicleFormPage mode="edit" /> },
      { path: 'vehicles/:vehicleId/history', element: <ServiceHistoryPage /> },
      { path: 'vehicles/:vehicleId/service/new', element: <ServiceRecordFormPage mode="create" /> },
      { path: 'vehicles/:vehicleId/service/:recordId/edit', element: <ServiceRecordFormPage mode="edit" /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
