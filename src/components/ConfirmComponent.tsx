import React from "react";
import { useTranslation } from "next-i18next";
import { Icon, IconWarning } from "./Icons";


const ConfirmComponent: React.FC<{
  message: string,
  detail?: any,
  loading: boolean,
  error?: Error,
  acceptText?: string,
  cancelText?: string,
  onCancel?: () => void,
  onAccept?: () => void,
}> = ({
  message,
  loading,
  detail,
  error,
  cancelText,
  acceptText,
  onCancel,
  onAccept
}) => {
  const {t} = useTranslation('common')

  return (
    <div className="flex-1 space-y-6 relative">
      <div className="text-xl uppercase">{t('confirm')}</div>
      {Boolean(error) && (
        <div role="alert" className="alert alert-error text-sm p-2 mb-2">
          <Icon icon={IconWarning} className="w-4 h-4"/>
          <span>{t(error!.message) || (t('somethingWentWrong'))}</span>
        </div>
      )}
      <div className="space-y-3 text-base">
        {message}
      </div>
      {detail}
      <div className="flex space-x-2">
        <button
          className="btn btn-outline"
          disabled={loading}
          onClick={onCancel}
        >
          {cancelText || t('cancel')}
        </button>
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={onAccept}
        >
          {acceptText || t('ok')} {loading && <span className="loading loading-dots loading-sm"></span>}
        </button>
      </div>
      {loading && (
        <div className="absolute w-full h-full left-0 top-0">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      )}
    </div>
  )
}

export default ConfirmComponent