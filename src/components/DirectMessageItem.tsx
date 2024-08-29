import { Group, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { FiUser } from 'react-icons/fi'
import { DirectMessage } from '../models/DirectMessage'

export type DirectMessageItemProps = {
  message: DirectMessage
  alignRight: boolean
  username: string | undefined
  showUsername: boolean
}

export const DirectMessageItem = ({
  message,
  alignRight,
  username,
  showUsername,
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
      mt={showUsername ? 'md' : undefined}
    >
      {showUsername ? (
        <>
          <ThemeIcon size="xl" radius="xl" variant="default">
            <FiUser />
          </ThemeIcon>
          <Stack gap={0}>
            <Group className={alignRight ? 'flex-row-reverse' : undefined}>
              <Title order={4} c="relay" ta={alignRight ? 'end' : 'start'}>
                {username}
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
              component="pre"
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
            component="pre"
            ta={alignRight ? 'end' : 'start'}
            style={{
              textWrap: 'wrap',
            }}
          >
            {message.message}
          </Text>
        </>
      )}
    </Group>
  )
}
