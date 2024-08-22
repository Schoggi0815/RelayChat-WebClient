import {
  ActionIcon,
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Box,
  Divider,
  Group,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { PropsWithChildren, useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import classes from './RelayChatAppShell.module.css'

export const RelayChatAppShell = (props: PropsWithChildren<unknown>) => {
  const [openNavbarPanel, setOpenNavbarPanel] = useState<'Friends' | 'Servers'>(
    'Friends'
  )

  return (
    <AppShell
      navbar={{
        width: 300,
        breakpoint: 500,
        collapsed: { desktop: false, mobile: false },
      }}
    >
      <AppShellMain>{props.children}</AppShellMain>
      <AppShellNavbar>
        <Stack gap={0} h="100%">
          <UnstyledButton w="100%" className={classes.menuButton}>
            <Title>Dashboard</Title>
          </UnstyledButton>
          <Divider />
          <UnstyledButton
            w="100%"
            className={classes.menuButton}
            onClick={() => setOpenNavbarPanel('Friends')}
          >
            <Title>Friends</Title>
          </UnstyledButton>
          <ScrollArea
            flex={openNavbarPanel === 'Friends' ? 1 : 0}
            style={{ transition: 'all 200ms' }}
          >
            <Stack p={16}>
              <UnstyledButton>
                <Group>
                  <ActionIcon
                    radius="xl"
                    size="xl"
                    variant="outline"
                    component={Link}
                    to="/friends"
                  >
                    <FiUserPlus />
                  </ActionIcon>
                  <Text>Add Friends</Text>
                </Group>
              </UnstyledButton>
              {[...Array(10).keys()].map(() => (
                <Group>
                  <Skeleton height={50} circle />
                  <Skeleton height={20} width={150} />
                </Group>
              ))}
            </Stack>
          </ScrollArea>
          <Divider />
          <UnstyledButton
            w="100%"
            className={classes.menuButton}
            onClick={() => setOpenNavbarPanel('Servers')}
          >
            <Title>Servers</Title>
          </UnstyledButton>
          <ScrollArea
            flex={openNavbarPanel === 'Servers' ? 1 : 0}
            style={{ transition: 'all 200ms' }}
          >
            <Group p={16}>
              <Stack h="100%">
                {[...Array(10).keys()].map(() => (
                  <Skeleton height={50} circle />
                ))}
              </Stack>
              <Box bg="gray" flex={1} h="100%">
                <Stack p="sm">
                  {[...Array(10).keys()].map(() => (
                    <Group>
                      <Skeleton height={10} circle />
                      <Skeleton height={10} width={100} />
                    </Group>
                  ))}
                </Stack>
              </Box>
            </Group>
          </ScrollArea>
          <Divider />
          <UnstyledButton w="100%" className={classes.menuButton}>
            <Title>Settings</Title>
          </UnstyledButton>
        </Stack>
      </AppShellNavbar>
    </AppShell>
  )
}
