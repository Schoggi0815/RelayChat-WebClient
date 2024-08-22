import { Group, Loader, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { RelayChatAppShell } from '../app-shell/RelayChatAppShell'
import { useAuthedRequest } from '../../hooks/useAuthedRequest'
import { searchUsers } from '../../api/friends'
import { useQuery } from '@tanstack/react-query'
import { FiUser } from 'react-icons/fi'

export const FriendsWindow = () => {
  const getUsersAuthed = useAuthedRequest(searchUsers)

  const { data: users, isLoading } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async ({ signal }) => getUsersAuthed(signal),
  })

  return (
    <RelayChatAppShell>
      <Title>Friends</Title>
      <Stack>
        {isLoading ? (
          <Loader />
        ) : (
          users?.map(user => (
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <FiUser />
              </ThemeIcon>
              <Text>{user.displayName}</Text>
            </Group>
          ))
        )}
      </Stack>
    </RelayChatAppShell>
  )
}
