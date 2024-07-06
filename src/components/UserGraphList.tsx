import React, {useEffect} from "react";
import { useTranslation } from "next-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { Graph } from "../domain/models";
import { Icon, IconPlus } from "./Icons";
import { GraphActions, getMyGraphs } from "../redux/_graph.redux";
import GraphMenu from "./GraphMenu";
import Link from "next/link";

const UserGraphList: React.FC<{}> = ({}) => {
  const {t} = useTranslation()
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector(state => state.auth.user)
  const graphs = useSelector(state => state.graph.list)


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
      <div>
        <h1 className="text-2xl mb-4">{t('myGraphs')}</h1>
        <div className="animate-pulse grid md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="card aspect-square bg-base-content opacity-20"></div>
          <div className="card aspect-square bg-base-content opacity-20"></div>
          <div className="card aspect-square bg-base-content opacity-20"></div>
          <div className="card aspect-square bg-base-content opacity-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl mb-4">{t('myGraphs')}</h1>
      <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-4">
        <a className="card aspect-square relative cursor-pointer bg-base-200 hover:bg-base-300"
          onClick={() => dispatch({type: GraphActions.ADD_GRAPH_START})}
        >
          <div className="card-body flex-col">
            <Icon icon={IconPlus} className="w-6"/>
            <h2 className="card-title">
              {t('addNewGraph')}
            </h2>
          </div>
        </a>
        {graphs.items.map((s: Graph, i: number) => (
          <Link className="card aspect-square relative bg-base-200 hover:bg-base-300"
            href={'/graphs/' + s.id}>
            <div className="card-body">
              <h2 className="card-title">{s.name}</h2>
            </div>
            <GraphMenu
              id={i}
              graph={s}
              className="absolute top-0 right-0"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default UserGraphList