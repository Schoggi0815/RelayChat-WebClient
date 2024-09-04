import { Button, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FiUser } from 'react-icons/fi'
import { LoginContextType } from '../../LoginContext'
import { removeFriend } from '../../api/friends'
import { useAuthedRequestWithContext } from '../../hooks/useAuthedRequestWithContext'
import { isUnrelateUser, UnrelatedUser } from '../../models/UnrelatedUser'
import { isListOf } from '../../utils'
import { UserAvatar } from '../UserAvatar'

export const UserContextModal = ({
  innerProps,
}: ContextModalProps<{
  user: UnrelatedUser
  loginContext: LoginContextType
}>) => {
  const removeFriendAuthed = useAuthedRequestWithContext(
    removeFriend,
    innerProps.loginContext
  )

  const queryClient = useQueryClient()

  const { mutate: unfriend, isPending: unfriendLoading } = useMutation({
    mutationFn: () => removeFriendAuthed(innerProps.user.id),
    onSuccess: () => {
      const friends = queryClient.getQueryData(['friends'])
      if (!isListOf(isUnrelateUser)(friends)) {
        return
      }

      queryClient.setQueryData(
        ['friends'],
        friends.filter(f => f.id !== innerProps.user.id)
      )
    },
  })

  return (
    <Stack>
      <Group>
        <UserAvatar size={44} user={innerProps.user} />
        <Text>{innerProps.user.displayName}</Text>
      </Group>
      <Group justify="flex-end">
        <Button
          color="red"
          variant="light"
          loading={unfriendLoading}
          onClick={() => unfriend()}
        >
          Unfriend
        </Button>
      </Group>
    </Stack>
  )
}
