import { ActionIcon, Group, Text } from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FiPlus } from 'react-icons/fi'
import { postFriendRequest } from '../api/friends'
import { useAuthedRequest } from '../hooks/useAuthedRequest'
import { isFriendRequest } from '../models/FriendRequest'
import { UnrelatedUser } from '../models/UnrelatedUser'
import { isListOf } from '../utils'
import { UserAvatar } from './UserAvatar'

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
      <UserAvatar size={44} user={user} />
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
