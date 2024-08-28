import * as signalR from '@microsoft/signalr'
import React, { useContext, useEffect } from 'react'
import { PropsWithChildren, useState } from 'react'
import { LoginContext } from '../LoginContext'

export type SignalRContextType = {
  connection?: signalR.HubConnection
  connectionState: signalR.HubConnectionState
}

export const SignalRContext = React.createContext<SignalRContextType>({
  connectionState: signalR.HubConnectionState.Disconnected,
})

export const SignalRProvider = (props: PropsWithChildren) => {
  const [connection, setConnection] = useState<signalR.HubConnection>()
  const [connectionState, setConnectionState] =
    useState<signalR.HubConnectionState>(
      signalR.HubConnectionState.Disconnected
    )

  const loginContext = useContext(LoginContext)

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/signalr', { accessTokenFactory: loginContext.getJwt })
      .build()

    connection.onclose(() => {
      setConnectionState(signalR.HubConnectionState.Disconnected)
    })

    connection.onreconnecting(() => {
      setConnectionState(signalR.HubConnectionState.Connecting)
    })

    connection.onreconnected(() => {
      setConnectionState(signalR.HubConnectionState.Connected)
    })

    connection.start().then(() => {
      setConnection(connection)
      setConnectionState(signalR.HubConnectionState.Connected)
    })

    return () => {
      connection?.stop()
    }
  }, [])

  return (
    <SignalRContext.Provider value={{ connection, connectionState }}>
      {props.children}
    </SignalRContext.Provider>
  )
}
