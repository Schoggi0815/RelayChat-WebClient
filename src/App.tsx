import { create, get } from '@github/webauthn-json'
import { Button, Center, Stack, TextInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import {
  getUserInformation,
  postFinishLogin,
  postFinishRegister,
  postSignout,
  postStartLogin,
  postStartRegister,
} from './api/common'
import { useQuery, useQueryClient } from '@tanstack/react-query'

function App() {
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    getUserInformation().then(r => console.log(r))
  }, [])

  const queryClient = useQueryClient()

  const { isPending, isError, data } = useQuery({
    queryKey: ['user'],
    queryFn: getUserInformation,
    retry: false,
  })

  const startRegistration = async () => {
    if (!email || !displayName) {
      return
    }

    const result = await postStartRegister(email, displayName)
    console.log(result)
    const created = await create(result)
    console.log(created)
    const result2 = await postFinishRegister(created)
    console.log(result2)
  }

  const logIn = async () => {
    const result = await postStartLogin()
    console.log(result)

    const getResult = await get(result)
    const result2 = await postFinishLogin(getResult)
    console.log(result2)

    await queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  const signout = async () => {
    await postSignout()
    await queryClient.invalidateQueries({ queryKey: ['user'] })
    console.log('successful signout')
  }

  return (
    <Center>
      <Stack mt={100}>
        {isPending ? 'Loading...' : isError ? 'Not logged in' : data}
        <TextInput
          label="Email"
          value={email}
          onChange={e => setEmail(e.currentTarget.value)}
        />
        <TextInput
          label="Display Name"
          value={displayName}
          onChange={e => setDisplayName(e.currentTarget.value)}
        />
        <Button onClick={startRegistration}>Register</Button>
        <Button onClick={logIn}>Login</Button>
        <Button onClick={signout}>Signout</Button>
      </Stack>
    </Center>
  )
}

export default App
