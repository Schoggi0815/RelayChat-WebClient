import { get } from '@github/webauthn-json'
import { Stack, Alert, Button, Text } from '@mantine/core'
import { useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { postStartLogin, postFinishLogin } from '../../api/common'
import { TokenDto } from '../../models/TokenDto'
import { AsyncButton } from '../input/AsyncButton'
import { FetchError } from '../../api/fetchError'

export type LoginFormProps = {
  toRegisterForm: () => void
  onSuccess: (tokenDto: TokenDto) => void
}

export const LoginForm = ({ onSuccess, toRegisterForm }: LoginFormProps) => {
  const [error, setError] = useState<string>()

  const login = async () => {
    try {
      const result = await postStartLogin()
      const getResult = await get(result)
      const result2 = await postFinishLogin(getResult)

      setError(undefined)
      onSuccess(result2)
    } catch (error) {
      if (error instanceof FetchError) {
        setError(error.message)
      }
    }
  }

  return (
    <Stack>
      {error && (
        <Alert color="red" title={'Login failed'} icon={<FiAlertCircle />}>
          <Text>{error}</Text>
        </Alert>
      )}
      <AsyncButton onClick={login}>Login with Passkey</AsyncButton>
      <Button variant="subtle" onClick={toRegisterForm}>
        Register a new Account
      </Button>
    </Stack>
  )
}
