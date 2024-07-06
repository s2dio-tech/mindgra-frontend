import React, { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph, { ForceGraphInstance } from "force-graph";

import cssStyles from './Graph3D.module.css'
import { Link, Word } from "../../domain/models";
import { calculateLinkColor, calculateLinkWidth, nodeStyle, GraphColors, randomNodeColors, canvasTextNode } from "./common";
import { getBgColor, getButtonRoundPx, getLightLevel } from "../../common/theme";


const Graph2D: React.FunctionComponent<{
  theme: string,
  data: {nodes: Word[], links: Link[]},
  focusNodeId?: string,
  selectedNodeIds?: string[],
  highLightNodeIds?: string[],
  hoverLink?: Link,
  onNodeClick?: (node: Word) => void,
  onNodeHover?: (node: Word) => void,
  onLinkHover?: (link?: Link) => void,
  onRenderComplete?: (graph: any) => void,
}> = ({
  theme,
  data,
  focusNodeId,
  selectedNodeIds,
  highLightNodeIds,
  hoverLink,
  onNodeClick,
  onNodeHover,
  onLinkHover,
  onRenderComplete,
}) => {
  const htmlNodeRef = useRef();
  const graphRef = useRef<ForceGraphInstance>();

  const [graphData, setGraphData] = useState<{nodes: any[], links: any[]}>({nodes: [], links: []})
  const [centerNodeId, setCenterNodeId] = useState<string>();
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
  const [styles, setStyles] = useState<{colors: GraphColors, nodeRounded: number}>({
    colors: {bg: '#000000', linkHigh: '#ffffff', linkLow: '#555555', nodes: []},
    nodeRounded: 0
  });
  
  // function focusNode (node: any) {
  //   if(!Boolean(node)) return;
  //   // setAnimationing(true);
  //   htmlNodeRef.current?.classList?.add(cssStyles.animationing)
  //   // save current camera
  //   cameraRef.current = graphRef.current?.cameraPosition();

  //   const distance = 500;
  //   const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
  //   const newPos = node.x || node.y || node.z
  //     ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
  //     : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)
  //   graphRef.current?.cameraPosition(
  //     newPos, // new position
  //     node, // lookAt ({ x, y, z })
  //     2000  // ms transition duration
  //   );
  //   setTimeout(() => htmlNodeRef.current?.classList?.remove(cssStyles.animationing), 1500)
  // }

  function nodeClickHandle(node: Word) {
    if(!Boolean(node) || node.id < 0) return;
    // focusNode(node)
    if(typeof onNodeClick === 'function') {
      setTimeout(() => onNodeClick(node), 100)
    }
  }


  function linkClickHandle(link: object) {
    console.debug(link)
    // if(typeof onLinkClick === 'function') {
    //   onLinkClick(link)
    // }
  }

  const updateStyle = (forceUpdate = false) => {
    console.debug(centerNodeId, activeNodeIds, highLightNodeIds)
    nodeStyle(styles.colors, graphData.nodes, graphData.links, centerNodeId, activeNodeIds, highLightNodeIds, forceUpdate)
    graphRef.current?.nodeCanvasObject((node, ctx, globalScale) => canvasTextNode(node, ctx, globalScale, styles))
    .linkWidth(
      (link: Link) => calculateLinkWidth(link, highLightNodeIds, centerNodeId)
    ).linkColor(
      (link: Link) => calculateLinkColor(styles.colors, link, highLightNodeIds, centerNodeId)
    )
  }

  function scrollHandle (e: UIEvent) {
    graphRef.current?.controls().zoomCamera()
  }

  useEffect(() => {
    console.debug("rendered")
    const Graph = ForceGraph()
    (document.getElementById('graph2d')!)
    .width(htmlNodeRef.current?.offsetWidth)
    .height(htmlNodeRef.current?.offsetHeight)
    .backgroundColor('#00000000')
    .cooldownTime(3000)
    .nodeCanvasObject(canvasTextNode)
    .nodePointerAreaPaint((node, color, ctx) => {
      ctx.fillStyle = color;
      const size = node._size;
      size && ctx.fillRect(node.x - size[0] / 2, node.y - size[1] / 2, ...size);
    })
    .onNodeClick(nodeClickHandle)
    .onNodeHover(onNodeHover)
    .onNodeDragEnd(node => {
      node.fx = node.x;
      node.fy = node.y;
    })
    .linkDirectionalParticles(0.2)
    .linkDirectionalParticleWidth(0.3)
    .linkDirectionalParticleSpeed(0.002)
    .onEngineStop(() => onRenderComplete(graphRef.current))
    .onLinkHover(onLinkHover)
    .onLinkClick(linkClickHandle)
    
    // Spread nodes a little wider
    // Graph.d3Force('charge')?.strength(-300);
    graphRef.current = Graph;
    
    // slowdown when graphdata changed
    // setTimeout(() => Graph.d3AlphaDecay(0.2), 5000)
  }, [])

  useEffect (() => {
    console.debug("data updated")
    // const _nodes = mergeDiff(graphData.nodes, data.nodes, (o, n) => o.id === n.id)
    // const _links = mergeDiff(graphData.links, data.links, (o, n) => isEqual([o.sourceId, o.targetId], [n.sourceId, n.targetId]))
    const _nodes = data.nodes
    const _links = data.links
    setGraphData({
      nodes: _nodes,
      links: _links.map(l => ({...l, source: l.sourceId, target: l.targetId})),
    })
  }, ['ws_' + data.nodes?.map(n => n.id).join('_'), 'ls_' + data.links?.map(l => l.sourceId + '|' + l.targetId).join('_')])

  useEffect (() => {
    console.debug("graphData updated")
    graphRef.current?.graphData(graphData)
    updateStyle()
  }, [graphData.nodes?.map(n => n.id).join('_'), graphData.links?.map(l => l.sourceId + '|' + l.targetId).join('_')])

  useEffect (() => {
    console.debug("theme updated")
    // random new linkColors
    const bgColor = getBgColor(theme) || '#000000'
    const lightLevel = getLightLevel(bgColor)
    const btnRounded = getButtonRoundPx(theme)
    setStyles((styles) => ({
      ...styles,
      nodeRounded: btnRounded,
      colors: {
        bg: bgColor,
        linkHigh: lightLevel > 150 ? '#000000' : '#ffffff',
        linkLow: lightLevel > 150 ? '#bbbbbb' : '#999999',
        nodes: randomNodeColors(bgColor)
      }
    }))
  }, [theme])

  useEffect(() => {
    console.debug("colors.bg updated")
    updateStyle(true)
  }, [styles.colors.bg])

  useEffect(() => {
    console.debug("activeNodeIds, highLightNodeIds updated")
    updateStyle()
  }, [activeNodeIds?.join('_'), highLightNodeIds?.join('_'), centerNodeId])

  // useEffect(() => {
  //   // move camera back to last position
  //   if(!Boolean(centerNodeId) && Boolean(cameraRef.current)) {
  //     const {x, y, z} = cameraRef.current!
  //     graphRef.current?.cameraPosition({x,y,z}, ({x: 0, y: 0, z: 0}), 2000)
  //   }
  // }, [centerNodeId])

  useEffect(() => {
    console.debug("selectedNodeIds updated")
    setActiveNodeIds(selectedNodeIds || [])
  }, [selectedNodeIds?.join('-')])

  useEffect(() => {
    console.debug("focusNodeId updated")
    setCenterNodeId(focusNodeId)
  }, [focusNodeId])

  useEffect(() => {
    graphRef.current?.linkWidth(
      (link: Link) => calculateLinkWidth(link, highLightNodeIds, centerNodeId, hoverLink)
    )
  }, [hoverLink])

  return useMemo(() => (
    <div ref={htmlNodeRef} className={cssStyles.graph} id="graph2d"></div>
  ), [1])
}

export default Graph2D
