import React from 'react'
import { SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'

const Login = () => {

  return (
    <div className='container text-center my-5'>
        <SignedOut>
            Please SignUp or Login for using this app!
            <hr />
            <SignInButton />
            <SignUpButton />
        </SignedOut>
    </div>
  )
}

export default Login
