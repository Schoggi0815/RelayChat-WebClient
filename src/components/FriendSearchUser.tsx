import { ActionIcon, Group, Text, ThemeIcon } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FiPlus, FiUser } from 'react-icons/fi'
import { postFriendRequest } from '../api/friends'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { UnrelatedUser } from '../models/UnrelatedUser'
import { isListOf } from '../utils'
import { isFriendRequest } from '../models/FriendRequest'

export type FriendSearchUserProps = {
  user: UnrelatedUser
}

export const FriendSearchUser = ({ user }: FriendSearchUserProps) => {
  const sendRequestAuthed = useAuthedRequest(postFriendRequest)

  const queryClient = useQueryClient()

  const { mutate: sendRequest, isPending: loadingRequest } = useMutation({
    mutationFn: async (receiver: UnrelatedUser) =>
      await sendRequestAuthed(receiver.id),
    onSuccess: friendRequest => {
      const currentSentRequests = queryClient.getQueryData([
        'sent-friend-requests',
      ])
      if (!isListOf(isFriendRequest)(currentSentRequests)) {
        throw new Error('Curren requests wrong type')
      }

      queryClient.setQueryData(
        ['sent-friend-requests'],
        [friendRequest, ...currentSentRequests]
      )
    },
  })

  return (
    <Group align="center">
      <ThemeIcon radius="xl" size="xl">
        <FiUser />
      </ThemeIcon>
      <Text>{user.displayName}</Text>
      <ActionIcon
        radius="xl"
        variant="light"
        loading={loadingRequest}
        onClick={() => sendRequest(user)}
      >
        <FiPlus />
      </ActionIcon>
    </Group>
  )
}
