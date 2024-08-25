import { ActionIcon, Group, Text } from '@mantine/core'
import { FiUser } from 'react-icons/fi'
import { UnrelatedUser } from '../models/UnrelatedUser'
import { modals } from '@mantine/modals'
import { useContext } from 'react'
import { LoginContext } from '../LoginContext'

export type FriendNavigationItemProps = {
  friend: UnrelatedUser
}

export const FriendNavigationItem = ({ friend }: FriendNavigationItemProps) => {
  const loginContext = useContext(LoginContext)

  const onClick = () => {
    modals.openContextModal({
      modal: 'user',
      withCloseButton: false,
      innerProps: { user: friend, loginContext },
    })
  }

  return (
    <Group>
      <ActionIcon radius="xl" size="xl" variant="default" onClick={onClick}>
        <FiUser />
      </ActionIcon>
      <Text>{friend.displayName}</Text>
    </Group>
  )
}
