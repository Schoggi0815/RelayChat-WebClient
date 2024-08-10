import { get } from '@github/webauthn-json'
import { Alert, Button, ButtonProps, Group, Stack, Text } from '@mantine/core'
import { ContextModalProps, ModalsProvider as MP } from '@mantine/modals'
import { PropsWithChildren, useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { postFinishLogin, postStartLogin } from './api/common'
import { TokenDto } from './models/TokenDto'

const LoginModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{ onSuccess: (tokenDto: TokenDto) => void }>) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const login = async () => {
    setLoading(true)

    const result = await postStartLogin()
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    const getResult = await get(result.data)
    const result2 = await postFinishLogin(getResult)
    if (!result2.ok) {
      setError(result2.error)
      setLoading(false)
      return
    }

    setLoading(false)
    setError(undefined)
    innerProps.onSuccess(result2.data)
    context.closeModal(id)
  }

  return (
    <Stack>
      {error && (
        <Alert color="red" title={'Login failed'} icon={<FiAlertCircle />}>
          <Text>{error}</Text>
        </Alert>
      )}
      <Button loading={loading} onClick={login}>
        Login with Passkey
      </Button>
    </Stack>
  )
}

const AsyncConfirmModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<{
  onConfirmClick: () => Promise<void>
  onCancelClick?: () => Promise<void>
  innerText: string
  cancelButtonText: string
  confirmButtonText: string
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
}>) => {
  const [loadingConfirm, setLoadingConfirm] = useState(false)
  const [loadingCancel, setLoadingCancel] = useState(false)

  const cancleClick = async () => {
    if (!innerProps.onCancelClick) {
      context.closeModal(id)
      return
    }

    setLoadingCancel(true)

    try {
      await innerProps.onCancelClick()
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingCancel(false)
      context.closeModal(id)
    }
  }

  const confirmClick = async () => {
    setLoadingConfirm(true)

    try {
      await innerProps.onConfirmClick()
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingConfirm(false)
      context.closeModal(id)
    }
  }

  return (
    <Stack>
      <Text>{innerProps.innerText}</Text>
      <Group justify="flex-end">
        <Button
          variant="default"
          loading={loadingCancel}
          {...innerProps.cancelButtonProps}
          onClick={cancleClick}
        >
          {innerProps.cancelButtonText}
        </Button>
        <Button
          loading={loadingConfirm}
          {...innerProps.confirmButtonProps}
          onClick={confirmClick}
        >
          {innerProps.confirmButtonText}
        </Button>
      </Group>
    </Stack>
  )
}

const modals = {
  login: LoginModal,
  asyncConfirm: AsyncConfirmModal,
}
declare module '@mantine/modals' {
  export interface MantineModalsOverride {
    modals: typeof modals
  }
}

export const ModalsProvider = ({ children }: PropsWithChildren) => {
  return <MP modals={modals}>{children}</MP>
}
