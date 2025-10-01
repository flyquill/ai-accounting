import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import { Outlet } from 'react-router-dom'

const Login = () => {

  return (
    <div className='container text-center my-5'>
        <SignedOut>
            Please SignUp or Login for using this app!
            <hr />
            <SignInButton />
            <SignUpButton />
        </SignedOut>
        <SignedIn>
          <Outlet />
        </SignedIn>
    </div>
  )
}

export default Login
