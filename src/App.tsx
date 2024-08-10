import { Center } from '@mantine/core'
import { getUserInformation } from './api/common'
import { ApiRequester } from './components/auth/ApiRequester'
import { useAuthedRequest } from './hooks/useAuthedRequest'

function App() {
  const getInfo = useAuthedRequest(getUserInformation)

  // const startRegistration = async () => {
  //   if (!email || !displayName) {
  //     return
  //   }

  //   const result = await postStartRegister(email, displayName)
  //   console.log(result)
  //   const created = await create(result)
  //   console.log(created)
  //   const result2 = await postFinishRegister(created)
  //   console.log(result2)
  // }

  return (
    <Center mt={100}>
      <ApiRequester apiCallback={getInfo}>
        {info => info ?? 'Loading...'}
      </ApiRequester>
    </Center>
  )
}

export default App
