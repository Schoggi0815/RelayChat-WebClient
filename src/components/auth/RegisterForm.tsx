import {
  create,
  PublicKeyCredentialWithAttestationJSON,
} from '@github/webauthn-json'
import { Alert, Button, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import { postFinishRegister, postStartRegister } from '../../api/common'
import { TokenDto } from '../../models/TokenDto'
import { AsyncButton } from '../input/AsyncButton'
import { RelayChatTextInput } from '../input/RelayChatTextInput'

export type RegisterFormProps = {
  onSuccess: (tokenDto: TokenDto) => void
  toLoginForm: () => void
}

export const RegisterForm = ({ toLoginForm, onSuccess }: RegisterFormProps) => {
  const [error, setError] = useState<string>()
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [invalidDisplayName, setInvalidDisplayName] = useState(false)
  const [credentialCreationOptions, setCredentialCreationOtions] =
    useState<PublicKeyCredentialWithAttestationJSON>()
  const [tokenName, setTokenName] = useState('')
  const [invalidTokenName, setInvalidTokenName] = useState(false)

  const startRegister = async () => {
    let isValid = true
    if (!/^[\w\-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      setInvalidEmail(true)
      isValid = false
    } else {
      setInvalidEmail(false)
    }

    if (displayName.length < 3 || displayName.length > 50) {
      setInvalidDisplayName(true)
      isValid = false
    } else {
      setInvalidDisplayName(false)
    }

    if (!isValid) {
      return
    }

    const startRegisterResult = await postStartRegister(email, displayName)
    if (!startRegisterResult.ok) {
      setError(startRegisterResult.error)
      return
    }
    setError('')

    setCredentialCreationOtions(await create(startRegisterResult.data))

    setTokenName('')
    setInvalidTokenName(false)
  }

  const finishRegister = async () => {
    if (credentialCreationOptions == undefined) {
      return
    }

    if (tokenName.length < 1 || tokenName.length > 50) {
      setInvalidTokenName(true)
      return
    } else {
      setInvalidTokenName(false)
    }

    const finishRegistrationResult = await postFinishRegister(
      credentialCreationOptions,
      tokenName
    )
    if (!finishRegistrationResult.ok) {
      setError(finishRegistrationResult.error)
      return
    }
    setError('')

    onSuccess(finishRegistrationResult.data)
  }

  return (
    <Stack>
      {error && (
        <Alert color="red" title={'Login failed'} icon={<FiAlertCircle />}>
          <Text>{error}</Text>
        </Alert>
      )}
      {credentialCreationOptions == undefined ? (
        <>
          <RelayChatTextInput
            value={email}
            onValueChange={setEmail}
            label={'Email'}
            error={invalidEmail ? 'Please enter a valid Email' : undefined}
          />
          <RelayChatTextInput
            value={displayName}
            onValueChange={setDisplayName}
            label={'Display name'}
            error={
              invalidDisplayName
                ? 'Please enter a name between 3 and 50 characters'
                : undefined
            }
          />
          <AsyncButton onClick={startRegister}>Register Passkey</AsyncButton>
          <Button variant="subtle" onClick={toLoginForm}>
            Log in with an existing Account
          </Button>
        </>
      ) : (
        <>
          <RelayChatTextInput
            value={tokenName}
            onValueChange={setTokenName}
            label="Passkey Name"
            placeholder="Give your Passkey a name to identify"
            error={
              invalidTokenName
                ? 'Please enter a token name between 1 and 50 characters'
                : undefined
            }
          />
          <AsyncButton onClick={finishRegister}>
            Finish Registration
          </AsyncButton>
          <Button
            variant="subtle"
            onClick={() => setCredentialCreationOtions(undefined)}
          >
            Back
          </Button>
        </>
      )}
    </Stack>
  )
}
