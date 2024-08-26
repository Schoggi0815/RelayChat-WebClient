import {
  Group,
  Loader,
  Stack,
  Tabs,
  TabsList,
  TabsPanel,
  TabsTab,
  Text,
  ThemeIcon,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FiInbox, FiSend, FiUser } from 'react-icons/fi'
import {
  getReceivedFriendRequests,
  getSentFriendRequests,
  markAllFriendRequestsAsRead,
} from '../../api/friends'
import { useAuthedRequest } from '../../hooks/useAuthedRequest'
import { RelayChatAppShell } from '../app-shell/RelayChatAppShell'
import { ReceivedFriendRequestItem } from '../ReceivedFriendRequestItem'
import { useEffect } from 'react'

export const FriendRequestsWindow = () => {
  const getSentAuthed = useAuthedRequest(getSentFriendRequests)
  const getReceivedAuthed = useAuthedRequest(getReceivedFriendRequests)
  const markAllFriendRequests = useAuthedRequest(markAllFriendRequestsAsRead)

  const { data: sentRequests, isLoading: isSentLoading } = useQuery({
    queryKey: ['sent-friend-requests'],
    queryFn: async ({ signal }) => getSentAuthed(signal),
  })

  const { data: recievedRequests, isLoading: isRecievedLoading } = useQuery({
    queryKey: ['recieved-friend-requests'],
    queryFn: async ({ signal }) => getReceivedAuthed(signal),
  })

  const queryClient = useQueryClient()

  const { mutate: markFriendRequests } = useMutation({
    mutationFn: () => markAllFriendRequests(),
    onSuccess: () => {
      queryClient.setQueryData(['friend-requests-unread'], [])
    },
  })

  useEffect(() => {
    markFriendRequests()
  }, [markFriendRequests])

  return (
    <RelayChatAppShell>
      <Tabs defaultValue="recieved">
        <TabsList>
          <TabsTab value="recieved" leftSection={<FiInbox />}>
            Recieved
          </TabsTab>
          <TabsTab value="sent" leftSection={<FiSend />}>
            Sent
          </TabsTab>
        </TabsList>

        <TabsPanel value="recieved">
          <Stack>
            {isRecievedLoading ? (
              <Loader />
            ) : (
              recievedRequests?.map(recievedRequest => (
                <ReceivedFriendRequestItem recievedRequest={recievedRequest} />
              ))
            )}
          </Stack>
        </TabsPanel>

        <TabsPanel value="sent">
          <Stack>
            {isSentLoading ? (
              <Loader />
            ) : (
              sentRequests?.map(sentRequest => (
                <Group>
                  <ThemeIcon size="xl" radius="xl">
                    <FiUser />
                  </ThemeIcon>
                  <Text>{sentRequest.receiver?.displayName}</Text>
                </Group>
              ))
            )}
          </Stack>
        </TabsPanel>
      </Tabs>
    </RelayChatAppShell>
  )
}