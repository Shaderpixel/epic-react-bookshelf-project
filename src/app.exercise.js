/** @jsx jsx */
import {jsx} from '@emotion/core'


// 🐨 import the AuthContext you created in ./context/auth-context
import {useAuth} from './context/auth-context'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'

function App() {
    // 🐨 wrap all of this in the AuthContext.Provider and set the `value` to props
    const {user} = useAuth()
    return user ? (
      //{/* 💣 remove the props spread here */}
      <AuthenticatedApp />
    ) : (
      // 💣 remove the props spread here
      <UnauthenticatedApp />
    )
}

export {App}
