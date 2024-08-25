import { ActionIcon, Group, Text } from '@mantine/core'
import { FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { UnrelatedUser } from '../models/UnrelatedUser'

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
        <FiUser />
      </ActionIcon>
      <Text>{friend.displayName}</Text>
    </Group>
  )
}
