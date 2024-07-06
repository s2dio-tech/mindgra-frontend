import { toast } from "react-toastify"

type ToastType = 'success' | 'warn' | 'error' | 'info'

export function showToast(type: ToastType, message: string) {
  const config = {
    position: toast.POSITION.TOP_LEFT
  }

  switch(type) {
    case 'success': return toast.success(message, config)
    case 'warn': return toast.warn(message, config)
    case 'error': return toast.error(message, config)
    case 'info':
    default: return toast.info(message, config)
  }
}