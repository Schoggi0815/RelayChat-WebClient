import { ActionIcon, Group, Text } from '@mantine/core'
import { Link } from 'react-router-dom'
import { UnrelatedUser } from '../models/UnrelatedUser'
import { UserAvatar } from './UserAvatar'

export type FriendNavigationItemProps = {
  friend: UnrelatedUser
}

export const FriendNavigationItem = ({ friend }: FriendNavigationItemProps) => {
  // const loginContext = useContext(LoginContext)

  // const onClick = () => {
  //   modals.openContextModal({
  //     modal: 'user',
  //     withCloseButton: false,
  //     innerProps: { user: friend, loginContext },
  //   })
  // }

  return (
    <Group>
      <ActionIcon
        radius="xl"
        size="xl"
        variant="default"
        component={Link}
        to={`/chat/${friend.id}`}
      >
        <UserAvatar size={44} user={friend} />
      </ActionIcon>
      <Text>{friend.displayName}</Text>
    </Group>
  )
}
