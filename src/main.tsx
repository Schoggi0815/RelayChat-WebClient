import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomeWindow } from './components/windows/HomeWindow.tsx'
import './index.css'
import { LoginProvider } from './LoginContext.tsx'
import { ModalsProvider } from './ModalsProvider.tsx'
import { FriendsWindow } from './components/windows/FriendsWindow.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FriendRequestsWindow } from './components/windows/FriendRequestsWindow.tsx'
import { DirectMessagesWindow } from './components/windows/DirectMessagesWindow.tsx'

const theme = createTheme({
  autoContrast: true,
  colors: {
    relay: [
      '#fff8e1',
      '#ffefcc',
      '#ffdd9b',
      '#ffca64',
      '#ffba38',
      '#ffb01b',
      '#ffab09',
      '#e39500',
      '#ca8500',
      '#af7100',
    ],
  },
  primaryColor: 'relay',
  luminanceThreshold: 0.6,
  primaryShade: { dark: 7, light: 7 },
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeWindow />,
  },
  { path: '/friends', element: <FriendsWindow /> },
  { path: '/friend-requests', element: <FriendRequestsWindow /> },
  { path: '/chat/:toId', element: <DirectMessagesWindow /> },
])

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <QueryClientProvider client={queryClient}>
        <ModalsProvider>
          <LoginProvider>
            <RouterProvider router={router} />
          </LoginProvider>
        </ModalsProvider>
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
)
