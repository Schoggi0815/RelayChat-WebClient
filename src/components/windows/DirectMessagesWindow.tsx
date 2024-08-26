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
import { getMyUserInformation, getUserInformation } from '../../api/common'
import { getMessages, sendNewMessage } from '../../api/messages'
import { useAuthedRequest } from '../../hooks/useAuthedRequest'
import { LoginContext } from '../../LoginContext'
import { isDirectMessage } from '../../models/DirectMessage'
import { isListOf } from '../../utils'
import { RelayChatAppShell } from '../app-shell/RelayChatAppShell'

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

  return (
    <RelayChatAppShell>
      <Stack mah="100%" flex={1} justify="space-between" p="sm" pt={0} pr={0}>
        <Box flex={1} style={{ overflow: 'auto' }}>
          <ScrollAreaAutosize
            offsetScrollbars
            mah="100%"
            viewportRef={viewport}
            type="scroll"
          >
            <Stack gap={0}>
              {isLoading
                ? [...Array(10).keys()].map(i => (
                    <Group key={i}>
                      <Skeleton height={44} circle />
                      <Skeleton height={20} width={150} />
                    </Group>
                  ))
                : chatMessages?.map((message, index) => {
                    const isFirstOfGroup =
                      chatMessages[index - 1]?.senderId !== message.senderId
                    return (
                      <Group
                        key={message.id}
                        align="flex-start"
                        gap="xs"
                        style={{
                          flexDirection:
                            message.senderId === user.id
                              ? 'row-reverse'
                              : 'row',
                          alignSelf:
                            message.senderId === user.id
                              ? 'flex-end'
                              : 'flex-start',
                        }}
                        wrap="nowrap"
                        maw="80%"
                      >
                        {isFirstOfGroup ? (
                          <>
                            <ThemeIcon size="xl" radius="xl" variant="default">
                              <FiUser />
                            </ThemeIcon>
                            <Stack gap={0}>
                              <Title
                                order={4}
                                c="relay"
                                ta={
                                  message.senderId === user.id ? 'end' : 'start'
                                }
                              >
                                {message.senderId === user.id
                                  ? you?.displayName
                                  : otherUser?.displayName}
                              </Title>
                              <Text
                                component="pre"
                                ta={
                                  message.senderId === user.id ? 'end' : 'start'
                                }
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
                            <Box w={44} h="100%" />
                            <Text
                              flex={1}
                              component="pre"
                              ta={
                                message.senderId === user.id ? 'end' : 'start'
                              }
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
                  })}
            </Stack>
          </ScrollAreaAutosize>
        </Box>
        <form onSubmit={onSubmit}>
          <Textarea
            pr="sm"
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
