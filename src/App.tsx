import { Center } from '@mantine/core'
import { getUserInformation, getUserInformation2 } from './api/common'
import { ApiRequester } from './components/auth/ApiRequester'
import { useAuthedRequest } from './hooks/useAuthedRequest'
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

function App() {
  const getInfo = useAuthedRequest(getUserInformation)
  const getInfo2 = useAuthedRequest(getUserInformation2)

  const { data, isLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async ({ signal }) => getInfo2(signal),
  })

  return (
    <Center mt={100}>
      <ApiRequester apiCallback={getInfo}>
        {info => info ?? 'Loading...'}
      </ApiRequester>
    </Center>
  )
}

export default App
