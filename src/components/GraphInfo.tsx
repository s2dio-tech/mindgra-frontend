import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "next-i18next";

import { Graph, GraphType, GraphTypeArr } from "../domain/models";
import { Icon, IdonChevronDown } from "./Icons";
import { GraphActions, updateGraphAction } from "../redux/_graph.redux";
import { showToast } from "../common/toast";
import { useRouter } from "next/router";


export const GraphInfo: React.FC<{graph: Graph}> = ({
  graph
}) => {
  const {t} = useTranslation('common')
  const dispatch = useDispatch()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const typeSelectHandle = async (graph: Graph, type: GraphType) => {
    await dispatch(updateGraphAction(graph.id, {type})).then(_ => {
      // showToast('success', t('graphTypeWasSaved'))
      router.reload();
    }).catch((err: any) => {
      showToast('error', t('errowWhileSaveGraphType') + '. ' + t(err.message))
    })
  }

  return (
    <div className="flex flex-row items-center bg-base-200 rounded-btn pr-3">
      <div
        className={"dropdown dropdown-hover"}
      >
        <summary className="m-1 btn btn-sm btn-outline p-1 gap-1 flex-nowrap">
          <span>{t(graph.type)}</span>
          <Icon icon={IdonChevronDown} className="w-2"/>
        </summary>
        <ul className="p-2 shadow dropdown-content menu p-2 shadow bg-base-100 rounded-box">
          {GraphTypeArr.map(type => (
            <li key={type}><a onClick={_ => typeSelectHandle(graph, type)}>{t(type)}</a></li>
          ))}
        </ul>
      </div>
      <div className="truncate" onClick={_ => dispatch({type: GraphActions.EDIT_GRAPH_START, graph: graph})}>{graph.name}</div>
    </div>
  )
}