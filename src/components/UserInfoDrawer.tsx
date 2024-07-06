import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { UIActions } from "../redux/_ui.redux";
import { GraphActions } from "../redux/_graph.redux";
import Drawer from "./Drawer";
import { Icon, IconClose, IconPlus, IconSignOut } from "./Icons";
import GraphsList from "./GraphList";
import { AuthActions } from "../redux/_auth.redux";

const UserInfoDrawer: React.FC<{
}> = ({
}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user)
  const isActive = useSelector(state => state.ui.userInfoModalActive)
  
  return (
    <Drawer id="theme_select_drawer" open={isActive} onClose={() => dispatch({type: UIActions.USER_INFO_MODAL_TOGGLE})}>
      <div className="w-full h-screen flex flex-col overflow-y-scroll">
        <div>
          <button onClick={() => dispatch({type: UIActions.USER_INFO_MODAL_TOGGLE})}
            className='btn btn-ghost'
          >
            <Icon icon={IconClose} className='w-4'/>
          </button>
        </div>
        <div className="p-2">
          <div className="flex flex-row justify-between">
            <h2 className="font-semibold">{user?.name}</h2>
            <div className="tooltip tooltip-left before:text-xs" data-tip={t('logout')}>
              <div className="btn btn-ghost btn-sm btn-square"
                onClick={() => {
                  dispatch({type: AuthActions.LOGOUT})
                  dispatch({type: UIActions.USER_INFO_MODAL_TOGGLE})
                }}
              >
                <Icon icon={IconSignOut} className="w-4"/>
              </div>
            </div>
          </div>
          <div className="divider w-full h-1"/>
          <div className="flex flex-row justify-between align-middle">
            <Link href={'/my-graphs'}
              className="mb-1 font-semibold opacity-60 underline"
              onClick={() => dispatch({type: UIActions.USER_INFO_MODAL_TOGGLE})}
            >
              {t('myGraphs')}
            </Link>
            <button
              onClick={() => dispatch({type: GraphActions.ADD_GRAPH_START})}
              className="btn btn-xs btn-outline normal-case font-light"
            >
              <Icon icon={IconPlus} className="w-3"/>{t('new')}
            </button>
          </div>
          <GraphsList/>
        </div>
      </div>
    </Drawer>
  )
}

export default UserInfoDrawer