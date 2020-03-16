import ReactGA from 'react-ga';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export const stats = localStorage.getItem('stats') === 'true'

export function useUser() {
  const [user, setUser] = useState(window.localStorage.getItem('user'))

  useEffect(() => {
    if (!user) {
      const id = uuidv4()
      window.localStorage.setItem('user', id)
      setUser(id)
    }
  }, [user])

  return user
}

export function usePageView() {
  if (!stats) return

  const location = useLocation()

  useEffect(() => {
    ReactGA.pageview(location.pathname)
  }, [location.pathname])
}