import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UIActions } from "../redux/_ui.redux";

const PrivateComponent: React.FC<{
  forceActive?: boolean,
  onCancel?: () => void,
  children?: any
}> = ({
  forceActive,
  onCancel,
  children
}) => {

  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)
  const authModalActive = useSelector(state => state.ui.authModalActive)

  const [authModalActivating, setAuthModalActivating] = useState(false)

  useEffect(() => {
    if(user && authModalActive) {
      dispatch({type: UIActions.AUTH_MODAL_TOGGLE, active: false})
    } else if(!user && forceActive) {
      dispatch({type: UIActions.AUTH_MODAL_TOGGLE, active: true})
    }else if(!user && !authModalActive) {
      dispatch({type: UIActions.AUTH_MODAL_TOGGLE, active: true})
    }
  }, [user, authModalActive])

  useEffect(() => {
    // canceled
    if (!user && !authModalActive && authModalActivating) {
      if(!forceActive) {
        onCancel?.call(this)
      }
    }
    setAuthModalActivating(authModalActive)
  }, [authModalActive])
  
  return (
    <div>
      {children}
    </div>
  )
}

export default PrivateComponent;