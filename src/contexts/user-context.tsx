import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
} from 'react'
import nookies from 'nookies'

type user = {
  id?: string
  name?: string
  email?: string
  type?: string
}

interface UserContextProps {
  user?: user
  setUser: Dispatch<SetStateAction<user>>
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const userId = nookies.get()['@portjobs.user.id']
  const userType = nookies.get()['@portjobs.user.type']
  const userEmail = nookies.get()['@portjobs.user.email']
  const userName = nookies.get()['@portjobs.user.name']

  const [user, setUser] = useState<user>({
    id: userId,
    name: userName,
    email: userEmail,
    type: userType,
  })

  return (
    <UserContext.Provider value={{ setUser, user }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
