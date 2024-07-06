import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Modal from "../Modal";
import { UIActions } from "../../redux/_ui.redux";
import AuthComponent from "./AuthComponent";


const AuthModal: React.FC<{}> = ({
}) => {

  const dispatch = useDispatch()
  const active = useSelector(state => state.ui.authModalActive)

  useEffect(() => {
    if(active) {
      window?.auth_modal?.showModal()
    } else {
      window?.auth_modal?.close()
    }
  }, [active])

  return (
    <Modal id={'auth_modal'} onClose={() => dispatch({type: UIActions.AUTH_MODAL_TOGGLE})}>
      <AuthComponent/>
    </Modal>
  )
}

export default AuthModal;