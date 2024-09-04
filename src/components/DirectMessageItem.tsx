import { Group, Stack, Text, Title } from '@mantine/core'
import { DirectMessage } from '../models/DirectMessage'
import { UnrelatedUser } from '../models/UnrelatedUser'
import { UserAvatar } from './UserAvatar'

export type DirectMessageItemProps = {
  message: DirectMessage
  alignRight: boolean
  user: UnrelatedUser | undefined
  showUsername: boolean
  firstOfDay: boolean
}

export const DirectMessageItem = ({
  message,
  alignRight,
  user,
  showUsername,
  firstOfDay,
}: DirectMessageItemProps) => {
  return (
    <Group
      key={message.id}
      className="hover:bg-[var(--mantine-color-default-hover)] rounded-md group"
      align="flex-start"
      gap="xs"
      style={{
        flexDirection: alignRight ? 'row-reverse' : 'row',
        alignSelf: alignRight ? 'flex-end' : 'flex-start',
      }}
      wrap="nowrap"
      w="100%"
      mt={showUsername ? (firstOfDay ? 'xs' : 'md') : undefined}
    >
      {showUsername ? (
        <>
          <UserAvatar size={44} user={user} />
          <Stack gap={0}>
            <Group className={alignRight ? 'flex-row-reverse' : undefined}>
              <Title order={4} c="relay" ta={alignRight ? 'end' : 'start'}>
                {user?.displayName}
              </Title>
              <Text size="xs">
                {new Date(message.sentAt).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  hourCycle: 'h23',
                })}
              </Text>
            </Group>
            <Text
              ta={alignRight ? 'end' : 'start'}
              style={{
                textWrap: 'wrap',
              }}
            >
              {message.message}
            </Text>
          </Stack>
        </>
      ) : (
        <>
          <Text
            w={44}
            size="xs"
            h="100%"
            className="self-center opacity-0 group-hover:opacity-100"
            ta="center"
            c="var(--mantine-color-gray-text)"
          >
            {new Date(message.sentAt).toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
              hourCycle: 'h23',
            })}
          </Text>
          <Text
            flex={1}
            ta={alignRight ? 'end' : 'start'}
            style={{
              textWrap: 'wrap',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.message}
          </Text>
        </>
      )}
    </Group>
  )
}
