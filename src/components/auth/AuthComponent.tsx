import React, { useState } from "react";
import { useDispatch } from "react-redux";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPassword from "./ForgotPassword";

type Mode = 'login' | 'register' | 'forgotPassword'

const AuthComponent: React.FC<{}> = ({
}) => {

  const dispatch = useDispatch()
  const [mode, setMode] = useState<Mode>('login')

  return (
    <div className="flex flex-col justify-center">
      <div className="relative">
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary to-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-box">
        </div>
        <div className="relative bg-base-100 shadow-lg px-2 py-4 sm:p-10 sm:rounded-box border border-base-200">
          <div className="min-w-xl mx-auto">
            {mode === 'login' && (
              <LoginForm
                registerClick={() => setMode('register')}
                forgotPasswordClick={() => setMode('forgotPassword')}
              />
            )}
            {mode === 'register' && (
              <RegisterForm
                loginClick={() => setMode('login')}
              />
            )}
            {mode === 'forgotPassword' && (
              <ResetPassword
                backClick={() => setMode('login')}
                onComplete={() => setMode('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthComponent;