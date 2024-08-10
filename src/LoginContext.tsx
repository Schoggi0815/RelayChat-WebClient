import { openContextModal, closeModal } from '@mantine/modals'
import {
  createContext,
  PropsWithChildren,
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import { postRefresh } from './api/common'
import { TokenDto } from './models/TokenDto'
import { parseJwt, hasExpiryDate, createLock } from './utils'

export type LoginContextType = {
  getJwt: () => Promise<string>
  logOut: () => void
  user: User
}

type User = {
  email: string
}

export const LoginContext = createContext<LoginContextType>({
  getJwt: () => {
    throw new Error('No Provider found!')
  },
  user: {
    email: '',
  },
  logOut: () => {
    throw new Error('No Provider found!')
  },
})

const TokenBufferTime = 10

type Token = TokenDto & {
  exp: number
}

const ACCESS_KEY = 'AccessToken'
const REFRESH_KEY = 'RefreshToken'

export const LoginProvider = (props: PropsWithChildren) => {
  const [user, setUser] = useState<User>()
  const token = useRef<Token>()

  const openLoginModal = useCallback((): Promise<TokenDto> => {
    let resolver: (value: TokenDto) => void
    const promise: Promise<TokenDto> = new Promise(r => (resolver = r))

    openContextModal({
      modal: 'login',
      title: 'Login',
      centered: true,
      withCloseButton: false,
      closeOnClickOutside: false,
      closeOnEscape: false,
      modalId: 'loginModalId',
      innerProps: {
        onSuccess: tokenDto => {
          setToken(tokenDto)
          resolver(tokenDto)
        },
      },
    })

    return promise
  }, [])

  useEffect(() => {
    if (user) {
      return
    }

    const accessToken = localStorage.getItem(ACCESS_KEY)
    const refreshToken = localStorage.getItem(REFRESH_KEY)

    if (!accessToken || !refreshToken) {
      openLoginModal().catch(console.error)
      return
    }

    setToken({
      token: accessToken,
      refreshToken,
    })

    return () => closeModal('loginModalId')
  }, [openLoginModal, user])

  const logOut = useCallback(() => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    setUser(undefined)
  }, [])

  const setToken = (tokenDto: TokenDto) => {
    const data = parseJwt(tokenDto.token)
    if (!hasExpiryDate(data)) {
      throw new Error('No expiery date in token found')
    }

    token.current = {
      ...tokenDto,
      exp: data.exp,
    }

    localStorage.setItem(ACCESS_KEY, tokenDto.token)
    localStorage.setItem(REFRESH_KEY, tokenDto.refreshToken)

    let newUser: User | undefined = undefined

    if (
      typeof data !== 'object' ||
      !('unique_name' in data) ||
      typeof data.unique_name !== 'string'
    ) {
      return
    }

    newUser = { email: data.unique_name }

    setUser(newUser)
  }

  const lock = useMemo(() => createLock(), [])

  const getJwt = useCallback(async (): Promise<string> => {
    if (token.current == null) {
      throw new Error('No user found')
    }

    const now = new Date().getTime() / 1000

    if (token.current.exp >= now + TokenBufferTime) {
      return token.current.token
    }

    const result = await postRefresh(
      token.current.token,
      token.current.refreshToken
    )

    if (!result.ok) {
      const newToken = await openLoginModal()
      setToken(newToken)
      return newToken.token
    }

    setToken(result.data)
    return result.data.token
  }, [openLoginModal])

  const getJwtLocked = useCallback(
    async (): Promise<string> => lock(getJwt),
    [getJwt, lock]
  )

  const contextValue = useMemo(
    () => user && { getJwt: getJwtLocked, user, logOut },
    [getJwtLocked, logOut, user]
  )

  return (
    <>
      {contextValue && (
        <LoginContext.Provider value={contextValue}>
          {props.children}
        </LoginContext.Provider>
      )}
    </>
  )
}
