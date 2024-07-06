import React from "react";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";

import { Graph } from "../domain/models";
import { Icon, IconDotsVertical, IconPen, IconTrash } from "./Icons";
import { GraphActions } from "../redux/_graph.redux";

const GraphMenu: React.FC<{
  id: number,
  className?: string,
  graph: Graph
}> = ({
  id,
  className,
  graph
}) => {
  const {t} = useTranslation()
  const dispatch = useDispatch();

  const menuHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, graph: Graph, action: string) => {
    console.debug('event fire')
    e.preventDefault()
    e.stopPropagation()
    switch (action) {
      case 'edit':
        dispatch({type: GraphActions.EDIT_GRAPH_START, graph: graph})
        break
      case 'delete':
        dispatch({type: GraphActions.DELETE_GRAPH_START, graph: graph})
        break
      default: break
    }
  }

  return (
    <div onClick={e => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={"dropdown dropdown-hover dropdown-end " + className}
    >
      <div tabIndex={id} role="button" className="btn btn-sm"><Icon icon={IconDotsVertical}/></div>
      <ul tabIndex={id} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
        <li><div onClick={(e) => menuHandler(e, graph, 'edit')}><Icon icon={IconPen} className="w-2"/>{t('edit')}</div></li>
        <li><div onClick={(e) => menuHandler(e, graph, 'delete')}><Icon icon={IconTrash} className="w-2"/>{t('delete')}</div></li>
      </ul>
    </div>
  )
}

export default GraphMenu