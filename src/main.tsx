import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createTheme, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MantineProvider>
  </React.StrictMode>
)
