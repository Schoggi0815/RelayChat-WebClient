import { Avatar, AvatarProps, createPolymorphicComponent } from '@mantine/core'
import { UnrelatedUser } from '../models/UnrelatedUser'
import { forwardRef } from 'react'

export interface UserAvatarProps extends AvatarProps {
  user?: UnrelatedUser
}

export const UserAvatar = createPolymorphicComponent<'div', UserAvatarProps>(
  forwardRef<HTMLDivElement, UserAvatarProps>(
    ({ user, ...props }: UserAvatarProps & AvatarProps) => {
      return <Avatar name={user?.displayName} color="initials" {...props} />
    }
  )
)
