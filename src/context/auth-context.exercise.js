import React from 'react'
import * as auth from 'auth-provider'
import {client} from 'utils/api-client'
import {useAsync} from 'utils/hooks'
import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'
// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext
const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

async function getUser () {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', {token})
    user = data.user
  }

  return user
}

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    return (
      <AuthContext.Provider value={{user, login, register, logout}} {...props} />
    )
   }
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an Authprovider')
  }

  return context
}

function useClient() {
  const {user: {token}} = useAuth()
  return React.useCallback((endpoint, config) => client(endpoint, {...config, token}),[token])
}

export {AuthProvider, useAuth, useClient}