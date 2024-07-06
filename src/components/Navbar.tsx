import React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { Logo } from "./Logo";
import { WordSearchBox } from "./WordSearchBox";
import { useDispatch, useSelector, } from "react-redux";
import { UIActions } from "../redux/_ui.redux";
import { Icon, IconGear, IconUser } from "./Icons";
import { Graph } from "../domain/models";
import { GraphInfo } from "./GraphInfo";

export const Navbar: React.FC<{
  graph?: Graph,
  hideUserMenu?: boolean,
}> = ({
  graph,
  hideUserMenu
}) => {
  const dispatch = useDispatch();
  const credential = useSelector(state => state.auth.user)

  return (
    <div className="navbar absolute left-0 top-0 pointer-events-none bg-transparent z-10 justify-between">
      <div className="pl-4 pr-4 space-x-4 pointer-events-auto">
        <div className="mask mask-squircle bg-accent p-1">
          <Link href={"/"}>
            <Logo className="stroke-accent-content stroke-[10px] h-10"/>
          </Link>
        </div>
        {Boolean(graph) && (
          <div className="lg:max-w-lg md:max-w-md sm:max-w-xs">
            <GraphInfo graph={graph!}/>
          </div>
        )}
        {/* <div className="bg-base-100 rounded-md w-full">
          <WordSearchBox graphId={graph.id}/>
        </div> */}
      </div>
      <div className="flex-none bg-base-100 pointer-events-auto">
        <ul className="menu menu-horizontal space-x-2">
          <li>
            <button className="btn content-center"
              onClick={_ => dispatch({type: UIActions.SETTING_MODAL_TOGGLE})}>
              <Icon icon={IconGear}/>
            </button>
          </li>
          {!hideUserMenu && (
            <li>
              <button className="btn content-center"
                onClick={_ => dispatch({
                  type: Boolean(credential) ? UIActions.USER_INFO_MODAL_TOGGLE : UIActions.AUTH_MODAL_TOGGLE
                })}
              >
                <Icon icon={IconUser}/>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}