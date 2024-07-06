import { UIEventHandler } from 'react';
import ReactDOM from 'react-dom/client';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { COLORS_VINTAGE, LIGHT_LEVEL_LOW, getLightLevel } from "../../common/theme"
import { Link, Word } from "../../domain/models"
import { GraphNode } from "./GraphNode"
import { arrayNull, isEqual } from '../../common/array';
import nodeCss from './GraphNode.module.css'

export type GraphColors = {
  bg: string,
  nodes: string[],
  linkHigh: string,
  linkLow: string,
}

export function randomNodeColors (bgColor: string) {
  let nodeColors: string[] = []
  const bgLightLevel = getLightLevel(bgColor)
  if(bgLightLevel > LIGHT_LEVEL_LOW) {
    nodeColors = COLORS_VINTAGE.filter((c: string) => getLightLevel(c) < bgLightLevel - 100)
  } else {
    nodeColors = COLORS_VINTAGE.filter(c => getLightLevel(c) > bgLightLevel + 100)
  }
  return nodeColors
}

function resetNodeStyle (n) {
  n.highLight = false;
  n.lightText = false;
  n.lightBorder = false;
  n.lowLight = false;
  n.elementRef?.current?.classList?.remove(nodeCss.lowlight, nodeCss.lighttext, nodeCss.highlight, nodeCss.lightborder)
}

export function nodeStyle (
  colors: GraphColors,
  nodes: any[],
  links: any[],
  centerNodeId?: string,
  activeNodeIds: string[] = [],
  highLightRoute: string[] = [],
  forceUpdate = false
) {
  if(!Boolean(nodes)) return

  nodes.forEach(n => {
    if(!n.color || forceUpdate) {
      var randColor = colors.nodes[Math.floor(Math.random()*colors.nodes.length)];
      n.color = randColor;
      n.textColor = randColor;
      n.bgColor = randColor;
    }

    // if color is setted and its not centered node, skip
    // if color is setted but centered node, change text and bg color
    // if not setted, set by random color
    var isCenter = centerNodeId === n.id
    var isActive = activeNodeIds?.includes(n.id)
    var isHighLight = highLightRoute?.includes(n.id)
    var isLinkWithCenter = !isCenter && arrayNull(highLightRoute) && Boolean(links?.find(l => isEqual([l.source?.id, l.target?.id], [n.id, centerNodeId])))
    var isLowLight = centerNodeId || !arrayNull(activeNodeIds) || !arrayNull(highLightRoute)
    
    // update node text color base on centerNode
    if (isCenter) {
      n.textColor = getLightLevel(n.bgColor) > LIGHT_LEVEL_LOW ? '#000' : '#fff';
    } else {
      n.textColor = n.color;
    }

    resetNodeStyle(n)
    
    if(isCenter) {
      n.highLight = true;
    } else if (isActive) {
      n.lightText = true;
      n.lightBorder = true;
    } else if (isHighLight || isLinkWithCenter) {
      n.lightText = true
    } else if (isLowLight) {
      n.lowLight = true
    }
    
    var element = n.elementRef?.current
    if(!Boolean(element)) return;
    element.querySelector('.background').style.backgroundColor = n.bgColor;
    element.querySelector('.content').style.color = n.textColor;
    if(n.highLight) {
      element.classList?.add(nodeCss.highlight)
    }
    if(n.lightText) {
      element.classList?.add(nodeCss.lighttext)
    }
    if(n.lightBorder) {
      element.classList?.add(nodeCss.lightborder)
    }
    if(n.lowLight) {
      element.classList?.add(nodeCss.lowlight)
    }
  })
}

export function htmlTextNode (params: {
  node: Word,
  clickHandle: Function,
  dragStartHandle?: (e: UIEvent, node: object) => void,
  dragHandle?: (e: UIEvent, node: object) => void,
  dragEndHandle?: (e: UIEvent, node: object) => void,
  scrollHandle?: UIEventHandler<HTMLDivElement>,
  actionHandle?: (action: string, node: Word) => void,
  mouseOverHandle?: (node: object) => void,
  mouseLeaveHandle?: (node: object) => void,
}) {
  const {
    node,
    clickHandle,
    dragHandle, dragEndHandle, dragStartHandle, 
    mouseLeaveHandle, mouseOverHandle
  } = params
  const el = document.createElement("div");
  const nodeJsx = <GraphNode
    node={node}
    focus={node.focus}
    onMouseOver={e => mouseOverHandle(node)}
    onMouseLeave={e => mouseLeaveHandle(node)}
    onClick={() => clickHandle(node)}
    onDragStart={e => dragStartHandle(e, node)}
    onDrag={e => dragHandle(e, node)}
    onDragEnd={e => dragEndHandle(e, node)}
  />
  ReactDOM.createRoot(el).render(nodeJsx);
  return new CSS2DObject(el);
}

export function canvasTextNode(node: any, ctx: CanvasRenderingContext2D, globalScale: any, styles: any) {
  const label = node.content;
  //font
  let fontSize = 12/globalScale;
  if(node.highLight) {
    fontSize += 1;
  }
  ctx.font = `${fontSize}px Sans-Serif`;
  const textWidth = ctx.measureText(label).width + 4; // more vertical padding
  const size = [textWidth, fontSize].map(n => n + fontSize * 0.2 + 4); // some padding

  // background color
  ctx.beginPath();
  ctx.fillStyle = node.bgColor + '30';
  if(node.highLight) {
    ctx.fillStyle = node.bgColor;
  } else if (node.lightText) {
    ctx.fillStyle = node.bgColor + '00';
  } else if (node.lowLight) {
    ctx.fillStyle = node.bgColor + '20';
  }
  ctx.roundRect(node.x - size[0] / 2, node.y - size[1] / 2, size[0], size[1], Array(4).fill(styles.nodeRounded));
  ctx.fill();
  if(node.lightBorder) {
    ctx.strokeStyle = node.bgColor;
    ctx.stroke();
  }

  //text color
  ctx.fillStyle = node.textColor;
  if (node.lowLight) {
    ctx.fillStyle = node.textColor + '25';
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, node.x, node.y);

  node._size = size; // to re-use in nodePointerAreaPaint
}

export const calculateLinkColor = (
  colors: GraphColors,
  link: Link,
  highLightRoute: string[] = [],
  centerNodeId?: string,
) => {

  if (!arrayNull(highLightRoute)) {
    var isHighLight = highLightRoute.find((w, idx) => (
      (idx < highLightRoute.length - 1)
      && isEqual([w, highLightRoute[idx + 1]], [link.source?.id, link.target?.id])
    ))
    return isHighLight ? colors.linkHigh : colors.linkLow
  }

  if(!centerNodeId) {
    return colors.linkLow;
  }

  var linkWithCenter = [link.source?.id, link.target?.id, link.source, link.target].includes(centerNodeId)
  return linkWithCenter ? colors.linkHigh : colors.linkLow;
}


export const calculateLinkWidth = (link: Link, highLightRoute: string[] = [], centerNodeId?: string, hoverLink: any) => {
  if(centerNodeId && [link.sourceId, link.targetId].includes(centerNodeId) && link.sourceId === hoverLink?.sourceId && link.targetId === hoverLink?.targetId) {
    return 1;
  }
  if (!arrayNull(highLightRoute)) {
    var isHighLight = highLightRoute.find((w, idx) => (
      (idx < highLightRoute.length - 1)
      && isEqual([w, highLightRoute[idx + 1]], [link.source?.id, link.target?.id])
    ))
    return isHighLight ? 1 : 0.2
  }

  if(!centerNodeId) {
    return 0.3;
  }

  var linkWithCenter = [link.source?.id, link.target?.id, link.source, link.target].includes(centerNodeId)
  return linkWithCenter ? 0.6 : 0.2
}

export const findNodeDragEvent = (e, nodes) => {
  if(e.target.nodeName !== 'DIV') return undefined
  if(!Array.isArray(nodes) || nodes.length === 0) return undefined;
  const id = e.target.getAttribute('data-id')
  if(!id) return undefined
  return nodes.find(n => n.id?.toString() === id)
}

/**
 * in threejs, node position is position of the center of node
 * node position = cursor postion - distance from cursor postion to center of node
*/
export function getNodePosition (e, view, epos): {x: number, y: number} {
  return {
    x: ((e.clientX - epos.x) / view.width) * 2 - 1,
    y: -((e.clientY - epos.y) / view.height) * 2 + 1,
  }
}
