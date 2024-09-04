import { Loader, Stack, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { searchUsers } from '../../api/friends'
import { useAuthedRequest } from '../../hooks/useAuthedRequest'
import { RelayChatAppShell } from '../app-shell/RelayChatAppShell'
import { FriendSearchUser } from '../FriendSearchUser'

export const FriendsWindow = () => {
  const getUsersAuthed = useAuthedRequest(searchUsers)

  const { data: users, isLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async ({ signal }) => getUsersAuthed(signal),
  })

  return (
    <RelayChatAppShell>
      <Stack>
        <Title>Search for People</Title>
        {isLoading ? (
          <Loader />
        ) : (
          users?.map(user => <FriendSearchUser user={user} />)
        )}
      </Stack>
    </RelayChatAppShell>
  )
}
