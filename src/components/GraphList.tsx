import React, {useEffect} from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";

import { Graph } from "../domain/models";
import { getMyGraphs } from "../redux/_graph.redux";
import GraphMenu from "./GraphMenu";

const GraphList: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user)
  const graphs = useSelector(state => state.graph.list)
  const currentGraphId = useSelector(state => state.word.graph.graphId)


  useEffect(() => {
    if(user) {
      refreshGraphsList()
    }
  }, [user])

  const refreshGraphsList = async () => {
    console.debug("load graphs")
    await dispatch(getMyGraphs()).catch((e) => {
      console.warn("loading graphs error", e)
    })
  }

  if (graphs.loading) {
    return (
      <div className="animate-pulse flex-1 space-y-2">
        <div className="h-8 bg-base-content opacity-20"></div>
        <div className="h-8 bg-base-content opacity-20"></div>
        <div className="h-8 bg-base-content opacity-20"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-1">
      {graphs.items.map((s: Graph, i: number) => (
        <a key={i} href={'/graphs/' + s.id}
          className={`join-item flex flex-rows justify-between items-center mt-2 p-2 text-sm rounded-btn cursor-pointer hover:bg-base-300 ${currentGraphId === s.id ? 'bg-base-300' : ''}`}
        >
          <span className="truncate">{s.name}</span>
          <GraphMenu id={i} graph={s}/>
        </a>
      ))}
    </div>
  )
}

export default GraphList