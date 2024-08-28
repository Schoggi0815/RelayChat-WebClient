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
import { FiSend, FiUser } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { getMyUserInformation, getUserInformation } from '../../api/common'
import { getMessages } from '../../api/messages'
import { useAuthedRequest } from '../../hooks/useAuthedRequest'
import { LoginContext } from '../../LoginContext'
import { DirectMessage } from '../../models/DirectMessage'
import { Pagination } from '../../models/Pagination'
import { RelayChatAppShell } from '../app-shell/RelayChatAppShell'
import { SignalRContext } from '../SignalRContext'

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
  const lastPageCount = useRef(0)

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
              pages: data.pages.map((p, i) =>
                i === 0 ? { ...p, items: [message, ...p.items] } : p
              ),
              pageParams: data.pageParams.map(n => n + 1),
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
    const pageCount = chatMessages?.pages.length ?? 0
    if (
      viewport.current != null &&
      'scrollTopMax' in viewport.current &&
      typeof viewport.current.scrollTopMax === 'number'
    ) {
      if (pageCount === lastPageCount.current) {
        console.log('lastScrollHeight', lastScrollHeight.current)
        console.log('newScrollHeight', viewport.current.scrollTopMax)
        console.log('scrollPos', viewport.current.scrollTop)

        if (lastScrollHeight.current === viewport.current.scrollTop) {
          viewport.current.scrollTop = viewport.current.scrollTopMax
        }

        lastScrollHeight.current = viewport.current.scrollTopMax
      } else if (viewport.current.scrollTopMax !== lastScrollHeight.current) {
        viewport.current.scrollTop =
          viewport.current.scrollTopMax - lastScrollHeight.current

        lastScrollHeight.current = viewport.current.scrollTopMax
        lastPageCount.current = pageCount
      }
    }
  }, [chatMessages])

  const onScroll = useCallback(
    ({ y }: { x: number; y: number }) => {
      if (y === 0 && !isFetching && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetching]
  )

  return (
    <RelayChatAppShell>
      <Stack mah="100%" flex={1} justify="flex-end" p="sm" pt={0} pr={0}>
        <ScrollAreaAutosize
          offsetScrollbars
          mah="100%"
          viewportRef={viewport}
          type="scroll"
          onScrollPositionChange={onScroll}
        >
          <Stack gap={0}>
            {isLoading
              ? [...Array(10).keys()].map(i => (
                  <Group key={i}>
                    <Skeleton height={44} circle />
                    <Skeleton height={20} width={150} />
                  </Group>
                ))
              : allMessages?.map((message, index) => {
                  const isFirstOfGroup =
                    allMessages[index - 1]?.senderId !== message.senderId
                  return (
                    <Group
                      key={message.id}
                      align="flex-start"
                      gap="xs"
                      style={{
                        flexDirection:
                          message.senderId === user.id ? 'row-reverse' : 'row',
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
                            ta={message.senderId === user.id ? 'end' : 'start'}
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
