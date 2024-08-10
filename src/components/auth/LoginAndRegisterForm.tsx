import { get } from '@github/webauthn-json'
import { Stack, Alert, Button, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { postStartLogin, postFinishLogin } from '../../api/common'
import { TokenDto } from '../../models/TokenDto'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

export type LoginAndRegisterFormProps = {
  onSuccess: (tokendDto: TokenDto) => void
}

export const LoginAndRegisterForm = ({
  onSuccess,
}: LoginAndRegisterFormProps) => {
  const [isRegisterForm, setRegisterForm] = useState(false)

  if (isRegisterForm) {
    return (
      <Stack justify="space-between" mih={200}>
        <Title order={1} ta="center">
          Register
        </Title>
        <RegisterForm
          onSuccess={onSuccess}
          toLoginForm={() => setRegisterForm(false)}
        />
      </Stack>
    )
  }

  return (
    <Stack justify="space-between" mih={200}>
      <Title order={1} ta="center">
        Login
      </Title>
      <LoginForm
        onSuccess={onSuccess}
        toRegisterForm={() => setRegisterForm(true)}
      />
    </Stack>
  )
}
