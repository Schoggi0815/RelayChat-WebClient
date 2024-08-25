import {
  ActionIcon,
  Box,
  Group,
  ScrollAreaAutosize,
  Skeleton,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { FiSend, FiUser } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { getMessages, sendNewMessage } from '../../api/messages'
import { useAuthedRequest } from '../../hooks/useAuthedRequest'
import { LoginContext } from '../../LoginContext'
import { isDirectMessage } from '../../models/DirectMessage'
import { isListOf } from '../../utils'
import { RelayChatAppShell } from '../app-shell/RelayChatAppShell'
import { getMyUserInformation, getUserInformation } from '../../api/common'

type MappedMessage = {
  senderId: string
  key: string
  messages: { id: string; message: string }[]
}

export const DirectMessagesWindow = () => {
  const { toId } = useParams()

  const { user } = useContext(LoginContext)

  const [currentText, setCurrentText] = useState('')

  const viewport = useRef<HTMLDivElement>(null)

  const getChatMessagesAuthed = useAuthedRequest(getMessages)
  const sendMessageAuthed = useAuthedRequest(sendNewMessage)
  const getMyUserAuthed = useAuthedRequest(getMyUserInformation)
  const getUserInfoAuthed = useAuthedRequest(getUserInformation)

  const queryClient = useQueryClient()

  const { data: chatMessages, isLoading } = useQuery({
    queryKey: ['direct-messages', toId],
    queryFn: ({ signal }) => getChatMessagesAuthed(toId ?? '', signal),
  })

  const { data: you } = useQuery({
    queryKey: ['my-user'],
    queryFn: ({ signal }) => getMyUserAuthed(signal),
  })

  const { data: otherUser } = useQuery({
    queryKey: ['user-info', toId],
    queryFn: ({ signal }) => getUserInfoAuthed(toId ?? '', signal),
  })

  useEffect(() => {
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: 'instant',
    })
  }, [chatMessages])

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: () =>
      sendMessageAuthed(toId ?? '', currentText, new Date().toISOString()),
    onSuccess: directMessage => {
      const currentMessages = queryClient.getQueryData([
        'direct-messages',
        toId,
      ])
      if (isListOf(isDirectMessage)(currentMessages)) {
        queryClient.setQueryData(
          ['direct-messages', toId],
          [...currentMessages, directMessage]
        )
      }
      setCurrentText('')
    },
  })

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await sendMessage()
  }

  const mappedMessages = chatMessages?.reduce<MappedMessage[]>(
    (previous: MappedMessage[], current) =>
      previous[previous.length - 1]?.senderId === current.senderId
        ? previous.map(mm =>
            mm.key === previous[previous.length - 1].key
              ? {
                  ...previous[previous.length - 1],
                  messages: [
                    ...previous[previous.length - 1].messages,
                    { id: current.id, message: current.message },
                  ],
                }
              : mm
          )
        : [
            ...previous,
            {
              senderId: current.senderId,
              key: current.id,
              messages: [{ message: current.message, id: current.id }],
            },
          ],
    []
  )

  return (
    <RelayChatAppShell>
      <Stack mah="100%" flex={1} justify="space-between" p="sm">
        <Box flex={1} style={{ overflow: 'auto' }}>
          <ScrollAreaAutosize
            offsetScrollbars
            mah="100%"
            viewportRef={viewport}
          >
            <Stack>
              {isLoading
                ? [...Array(10).keys()].map(i => (
                    <Group key={i}>
                      <Skeleton height={44} circle />
                      <Skeleton height={20} width={150} />
                    </Group>
                  ))
                : mappedMessages?.map(messageGroup => (
                    <Group
                      key={messageGroup.key}
                      align="flex-start"
                      gap="xs"
                      style={{
                        flexDirection:
                          messageGroup.senderId === user.id
                            ? 'row-reverse'
                            : 'row',
                      }}
                      wrap="nowrap"
                    >
                      <ThemeIcon size="xl" radius="xl" variant="default">
                        <FiUser />
                      </ThemeIcon>
                      <Stack
                        align={
                          messageGroup.senderId === user.id
                            ? 'flex-end'
                            : 'flex-start'
                        }
                        gap="xs"
                        maw="80%"
                      >
                        <Title order={4} c="relay">
                          {messageGroup.senderId === user.id
                            ? you?.displayName
                            : otherUser?.displayName}
                        </Title>
                        <Stack
                          gap="xs"
                          align={
                            messageGroup.senderId === user.id
                              ? 'flex-end'
                              : 'flex-start'
                          }
                          w="100%"
                        >
                          {messageGroup.messages.map(message => (
                            <Text
                              component="pre"
                              style={{
                                textWrap: 'wrap',
                                textAlign:
                                  messageGroup.senderId === user.id
                                    ? 'end'
                                    : 'start',
                              }}
                            >
                              {message.message}
                            </Text>
                          ))}
                        </Stack>
                      </Stack>
                    </Group>
                  ))}
            </Stack>
          </ScrollAreaAutosize>
        </Box>
        <form onSubmit={onSubmit}>
          <Textarea
            minRows={1}
            maxRows={4}
            autosize
            variant="filled"
            size="md"
            w="100%"
            placeholder="Type your message..."
            radius="lg"
            value={currentText}
            onChange={e => setCurrentText(e.currentTarget.value)}
            rightSection={
              <ActionIcon radius="xl" type="submit">
                <FiSend />
              </ActionIcon>
            }
            onKeyDown={e => {
              if (e.code === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSubmit(e)
              }
            }}
          />
        </form>
      </Stack>
    </RelayChatAppShell>
  )
}
