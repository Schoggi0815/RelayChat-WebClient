import { get } from '@github/webauthn-json'
import { Stack, Alert, Button, Text } from '@mantine/core'
import { useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { postStartLogin, postFinishLogin } from '../../api/common'
import { TokenDto } from '../../models/TokenDto'
import { AsyncButton } from '../input/AsyncButton'

export type LoginFormProps = {
  toRegisterForm: () => void
  onSuccess: (tokenDto: TokenDto) => void
}

export const LoginForm = ({ onSuccess, toRegisterForm }: LoginFormProps) => {
  const [error, setError] = useState<string>()

  const login = async () => {
    const result = await postStartLogin()
    if (!result.ok) {
      setError(result.error)
      return
    }

    const getResult = await get(result.data)
    const result2 = await postFinishLogin(getResult)
    if (!result2.ok) {
      setError(result2.error)
      return
    }

    setError(undefined)
    onSuccess(result2.data)
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
