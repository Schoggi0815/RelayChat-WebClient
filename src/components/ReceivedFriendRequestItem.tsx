import { Group, ThemeIcon, ActionIcon, Text } from '@mantine/core'
import { FiUser, FiCheck } from 'react-icons/fi'
import { FriendRequest, isFriendRequest } from '../models/FriendRequest'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isUnrelateUser } from '../models/UnrelatedUser'
import { isListOf } from '../utils'
import { postAcceptFriendRequest } from '../api/friends'
import { useAuthedRequest } from '../hooks/useAuthedRequest'

export type ReceivedFriendRequestItemProps = {
  recievedRequest: FriendRequest
}

export const ReceivedFriendRequestItem = ({
  recievedRequest,
}: ReceivedFriendRequestItemProps) => {
  const acceptRequestAuthed = useAuthedRequest(postAcceptFriendRequest)

  const queryClient = useQueryClient()

  const { mutate: acceptRequest, isPending: acceptLoading } = useMutation({
    mutationFn: async () => await acceptRequestAuthed(recievedRequest.senderId),
    onSuccess: newFriend => {
      const currentFriends = queryClient.getQueryData(['friends'])
      if (isListOf(isUnrelateUser)(currentFriends)) {
        queryClient.setQueryData(['friends'], [newFriend, ...currentFriends])
      }

      const recievedFriendRequests = queryClient.getQueryData([
        'recieved-friend-requests',
      ])
      if (isListOf(isFriendRequest)(recievedFriendRequests)) {
        queryClient.setQueryData(
          ['recieved-friend-requests'],
          recievedFriendRequests.filter(fr => fr.senderId !== newFriend.id)
        )
      }
    },
  })

  return (
    <Group>
      <ThemeIcon size="xl" radius="xl">
        <FiUser />
      </ThemeIcon>
      <Text>{recievedRequest.sender?.displayName}</Text>
      <ActionIcon
        variant="light"
        radius="xl"
        loading={acceptLoading}
        onClick={() => acceptRequest()}
      >
        <FiCheck />
      </ActionIcon>
    </Group>
  )
}
