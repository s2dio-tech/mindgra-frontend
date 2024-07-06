import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";

import { forgotPasswordAction, resetPasswordAction, verifyPasswordResetOTPAction } from "../../redux/_auth.redux";
import { showToast } from "../../common/toast";
import RequestOTPForm from "./RequestOTPForm";
import VerifyOTPForm from "./VerifyOTPForm";
import ResetPasswordForm from "./ResetPasswordForm";

const ForgotPassword: React.FC<{
  backClick: () => void,
  onComplete?: () => void,
}> = ({
  backClick,
  onComplete
}) => {
  const {t} = useTranslation('common')
  const dispatch = useDispatch()

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState<string>()
  const [resetPasswordToken, setResetPasswordToken] = useState<string>()

  const onBack = () => {
    if(step > 1) {
      setStep((step) => step - 1)
    } else {
      backClick();
    }
  }

  const onEmailSubmit = async (email: string) => {
    setLoading(true)
    setEmail(email)
    await dispatch(
      forgotPasswordAction({email})
    ).then(() => {
      showToast('success', t('otpWasSent'))
      setStep(2)
    }).catch((err: Error) => {
      showToast('error', t(err.message))
    }).finally(() => {
      setLoading(false);
    })
  }

  const onOTPSubmit = async (otp: string) => {
    setLoading(true)
    await dispatch(
      verifyPasswordResetOTPAction({email, otp})
    ).then((res: any) => {
      setResetPasswordToken(res.token)
      setStep(3)
    }).catch((err: Error) => {
      showToast('error', t(err.message))
    }).finally(() => {
      setLoading(false);
    })
  }

  const onPasswordSubmit = async (password: string) => {
    setLoading(true)
    await dispatch(
      resetPasswordAction({email, password, token: resetPasswordToken})
    ).then((res: any) => {
      showToast('success', t('passwordResetSuccessNowUCanLogin'));
      onComplete?.call(this);
    }).catch((err: Error) => {
      showToast('error', t(err.message))
    }).finally(() => {
      setLoading(false);
    })
  }


  return (
    <div className="w-full">
			<div>
				<h1 className="text-xl text-secondary font-mono pl-1">{t('forgotPassword')}</h1>
			</div>
      <div className="text-center mt-4">
        <ul className="steps">
          <li className={'text-xs step ' + (step === 1 ? 'step-primary' : '')}></li>
          <li className={'text-xs step ' + (step === 2 ? 'step-primary' : '')}></li>
          <li className={'text-xs step ' + (step === 3 ? 'step-primary' : '')}></li>
        </ul>
      </div>
      <div className="text-md text-center mt-4">
        {step === 1 ? t('sendRequest')
        : step === 2 ? t('verifyOTP')
        : step === 3 ? t('resetPassword')
        : ''}
      </div>
      <div className="w-full mt-8">
        {step == 1 && (
          <RequestOTPForm
            loading={loading}
            onSubmit={onEmailSubmit}
          />
        )}
        {step == 2 && (
          <VerifyOTPForm
            loading={loading}
            onSubmit={onOTPSubmit}
          />
        )}
        {step === 3 && (
          <ResetPasswordForm
            loading={loading}
            onSubmit={onPasswordSubmit}
          />
        )}
      </div>
      <p className="mt-8 text-center">
				<a className="link text-sm"
					onClick={e => {
						e.preventDefault()
						onBack()
					}}
				>{t('back')}</a>
			</p>
    </div>
  )
}

export default ForgotPassword