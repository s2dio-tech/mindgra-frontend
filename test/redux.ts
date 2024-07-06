import { isEqual } from "../src/common/array";
import { actionSuccess } from "../src/redux";
import { WordActions } from "../src/redux/_word.redux";
import { randomTree, getRandomInt } from "./graph";

export function testLoadMoreWords(id: number) {
  const ids = Array(10).fill(1).map((_)=>getRandomInt(1000, 9999));
  const action = {
    type: actionSuccess(WordActions.GET_MORE_GRAPH_NODES),
    data: {
      words: ids.map(i => ({id: i, content: "test-"+i})),
      links: ids.map(i => ({source: id, target: i}))
    }
  }
  return action;
}

export function testFindPath() {
  const path = ['Mabeuf', 'Marius', 'Cosette', 'Tholomyes', 'Fantine', 'Bamatabois']
  const words = path.map(w => randomTree.nodes.find(n => w === n.content)).filter(w => !!w)
  let links: any[] = []
  words.forEach((w, idx) => {
    if(idx >= (words.length -1)) return;
    // const link = randomTree.links.find(l => isEqual([l.source.id, l.target.id], [w!.id, words[idx + 1]!.id]))
    // if(link) {
      links.push({source: w!.id, target: words[idx + 1]!.id})
    // }
  })
  return {
    type: actionSuccess(WordActions.FIND_PATH),
    data: {words, links}
  }
}
