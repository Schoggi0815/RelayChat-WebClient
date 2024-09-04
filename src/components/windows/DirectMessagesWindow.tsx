import {
  ActionIcon,
  Divider,
  Group,
  ScrollAreaAutosize,
  Skeleton,
  Stack,
  Textarea,
  Title,
} from '@mantine/core'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { FiSend } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { getMyUserInformation, getUserInformation } from '../../api/common'
import { getMessages } from '../../api/messages'
import { useAuthedRequest } from '../../hooks/useAuthedRequest'
import { LoginContext } from '../../LoginContext'
import { DirectMessage } from '../../models/DirectMessage'
import { Pagination } from '../../models/Pagination'
import { RelayChatAppShell } from '../app-shell/RelayChatAppShell'
import { DirectMessageItem } from '../DirectMessageItem'
import { SignalRContext } from '../SignalRContext'
import { UserAvatar } from '../UserAvatar'
import React from 'react'

const PAGE_SIZE = 50

export const DirectMessagesWindow = () => {
  const { toId } = useParams()

  const { user } = useContext(LoginContext)

  const [currentText, setCurrentText] = useState('')

  const viewport = useRef<HTMLDivElement>(null)

  const getChatMessagesAuthed = useAuthedRequest(getMessages)
  const getMyUserAuthed = useAuthedRequest(getMyUserInformation)
  const getUserInfoAuthed = useAuthedRequest(getUserInformation)

  const lastScrollHeight = useRef(0)
  const firstMessageId = useRef('')

  const { connection, connectionState } = useContext(SignalRContext)

  useEffect(() => console.log(connectionState), [connectionState])

  const queryClient = useQueryClient()

  const {
    data: chatMessages,
    isLoading,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['direct-messages', toId],
    queryFn: ({ signal, pageParam }) =>
      getChatMessagesAuthed(toId ?? '', pageParam, PAGE_SIZE, signal),
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + PAGE_SIZE : undefined,
    initialPageParam: 0,
    select: data => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
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
    const scrollable =
      viewport.current!.scrollHeight > viewport.current!.clientHeight
    if (!scrollable && hasNextPage && !isFetching) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetching, viewport])

  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async () =>
      await connection?.send(
        'SendMessage',
        currentText,
        toId ?? '',
        new Date().toISOString()
      ),
    onSuccess: () => setCurrentText(''),
  })

  const allMessages = useMemo(
    () => chatMessages?.pages.flatMap(page => [...page.items].reverse()),
    [chatMessages]
  )

  useEffect(() => {
    if (connection) {
      connection.on('ReceiveMessage', (message: DirectMessage) => {
        queryClient.setQueryData(
          ['direct-messages', toId],
          (data: {
            pages: Pagination<DirectMessage>[]
            pageParams: number[]
          }) => {
            if (data.pages.some(p => p.items.some(m => m.id === message.id))) {
              return {
                pages: data.pages,
                pageParams: data.pageParams,
              }
            }

            return {
              pages: [
                {
                  offset: 0,
                  take: 1,
                  hasMore: data.pages.length > 0,
                  items: [message],
                },
                ...data.pages.map(p => ({ ...p, offset: p.offset + 1 })),
              ],
              pageParams: [0, ...data.pageParams.map(n => n + 1)],
            }
          }
        )
      })
    }
  }, [allMessages, connection, queryClient, toId])

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await sendMessage()
  }

  useEffect(() => {
    if (
      viewport.current != null &&
      'scrollTopMax' in viewport.current &&
      typeof viewport.current.scrollTopMax === 'number'
    ) {
      const newFirstId =
        chatMessages?.pages[chatMessages.pages.length - 1]?.items[0]?.id
      if (newFirstId !== firstMessageId.current) {
        if (lastScrollHeight.current === viewport.current.scrollTop) {
          viewport.current.scrollTop = viewport.current.scrollTopMax
        }

        lastScrollHeight.current = viewport.current.scrollTopMax
        firstMessageId.current = newFirstId ?? ''
      } else if (viewport.current.scrollTopMax !== lastScrollHeight.current) {
        viewport.current.scrollTop =
          viewport.current.scrollTop +
          viewport.current.scrollTopMax -
          lastScrollHeight.current

        lastScrollHeight.current = viewport.current.scrollTopMax
      }
    }
  }, [chatMessages])

  const onScroll = useCallback(
    ({ y }: { x: number; y: number }) => {
      if (y <= 300 && !isFetching && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetching]
  )

  return (
    <RelayChatAppShell
      aside={{
        width: 500,
        breakpoint: 1200,
        collapsed: { desktop: false, mobile: true },
      }}
      asideChildren={
        <Stack p="xl">
          <UserAvatar size="xl" user={otherUser} />
          <Title>{otherUser?.displayName}</Title>
        </Stack>
      }
    >
      <Stack mah="100%" flex={1} justify="flex-end" p="sm" pt={0} pr={0}>
        <ScrollAreaAutosize
          offsetScrollbars
          mah="100%"
          viewportRef={viewport}
          type="scroll"
          onScrollPositionChange={onScroll}
        >
          <Stack gap={0}>
            {(hasNextPage || isLoading) &&
              [...Array(5).keys()].map(i => (
                <Group
                  key={i}
                  mb="sm"
                  className={i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}
                >
                  <Skeleton height={44} circle />
                  <Skeleton height={20} flex={1} />
                </Group>
              ))}
            {allMessages?.map((message, index) => {
              const lastMessage: DirectMessage | undefined =
                allMessages[index - 1]
              const lastDate = new Date(lastMessage?.sentAt)
              const thisDate = new Date(message.sentAt)
              const isNewDay =
                lastMessage !== undefined &&
                (lastDate.getDate() !== thisDate.getDate() ||
                  lastDate.getMonth() !== thisDate.getMonth() ||
                  lastDate.getFullYear() !== thisDate.getFullYear())

              const isFirstOfGroup =
                lastMessage?.senderId !== message.senderId || isNewDay
              return (
                <React.Fragment key={message.id}>
                  {isNewDay && (
                    <Divider
                      label={thisDate.toLocaleDateString(undefined, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    />
                  )}
                  <DirectMessageItem
                    message={message}
                    alignRight={message.senderId === user.id}
                    showUsername={isFirstOfGroup}
                    user={message.senderId === user.id ? you : otherUser}
                  />
                </React.Fragment>
              )
            })}
          </Stack>
        </ScrollAreaAutosize>
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
