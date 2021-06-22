import type React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import WarningBanner from './components/WarningBanner'

type LayoutProps = {
  children: React.ReactNode
  isAuthenticated: boolean
  username: string
  signout: (cb?: (() => void) | undefined) => void
}

function Layout({ children, isAuthenticated, username, signout }: LayoutProps) {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isHomePage = location.pathname === '/'
  const isLoginPage = location.pathname === '/login'
  const isHomeLandingPage = isHomePage && !isAuthenticated
  const mainClassName = isHomeLandingPage
    ? ''
    : 'flex-1 lg:w-screen-lg mx-4 lg:mx-auto my-12'

  return (
    <>
      <WarningBanner />
      {isLoginPage || <Header {...{ isAuthenticated, username, signout }} />}
      <main className={mainClassName}>{children}</main>
      <Footer />
    </>
  )
}

export default Layout
