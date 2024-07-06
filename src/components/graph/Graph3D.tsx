import React, { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D, { ForceGraph3DInstance } from "3d-force-graph";
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import * as THREE from 'three'

import styles from './Graph3D.module.css'
import { Link, Word } from "../../domain/models";
import { getNodePosition, calculateLinkColor, calculateLinkWidth, htmlTextNode, nodeStyle, GraphColors, randomNodeColors } from "./common";
import { useSelector } from "react-redux";
import { getBgColor, getLightLevel } from "../../common/theme";


// variables for drag
var vec = new THREE.Vector3()
var pos = new THREE.Vector3()
var epos = {x: 0, y: 0}

const Graph3D: React.FunctionComponent<{
  theme: string,
  data: {nodes: Word[], links: Link[]},
  focusNodeId?: string,
  selectedNodeIds?: string[],
  highLightNodeIds?: string[],
  hoverLink?: Link,
  onNodeClick?: (node: Word) => void,
  onNodeMouseOver?: (node: Word) => void,
  onNodeMouseLeave?: (node: Word) => void,
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
  onNodeMouseOver,
  onNodeMouseLeave,
  onLinkHover,
  onRenderComplete,
}) => {
  const gRef = useRef();
  const graphRef = useRef<ForceGraph3DInstance>();
  const cameraRef = useRef();

  const [graphData, setGraphData] = useState<{nodes: any[], links: any[]}>({nodes: [], links: []})
  const [centerNodeId, setCenterNodeId] = useState<string>();
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
  const [colors, setColors] = useState<GraphColors>({bg: '#000000', linkHigh: '#ffffff', linkLow: '#555555', nodes: []});
  
  function focusNode (node: any) {
    if(!Boolean(node)) return;
    // setAnimationing(true);
    gRef.current?.classList?.add(styles.animationing)
    // save current camera
    cameraRef.current = graphRef.current?.cameraPosition();

    const distance = 500;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    const newPos = node.x || node.y || node.z
      ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
      : { x: 0, y: 0, z: distance }; // special case if node is in (0,0,0)
    graphRef.current?.cameraPosition(
      newPos, // new position
      node, // lookAt ({ x, y, z })
      2000  // ms transition duration
    );
    setTimeout(() => gRef.current?.classList?.remove(styles.animationing), 1500)
  }

  function nodeClickHandle(node: Word) {
    if(!Boolean(node) || node.id < 0) return;
    focusNode(node)
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

  function nodeDragStartHandle (e, node) {
    // setDragStartPos({ x: e.clientX, y: e.clientY });
    // const node = findNodeDragEvent(e, graphRef.current?.graphData()?.nodes)
    if(!Boolean(node)) return;
    const controls = graphRef.current?.controls();
    controls.enabled = false; // Disable controls while dragging
    // // lock node
    const nodeObj = node.__threeObj;
    const data = nodeObj.__data;
    ['x', 'y', 'z'].forEach(c => data[`f${c}`] = data[c]);

    const rect = e.target.getBoundingClientRect()
    epos = {
      x: e.clientX - (rect.left + rect.width/2),
      y: e.clientY - (rect.top + rect.height/2),
    }
  }

  function nodeDragHandle(e, node) {
    // e.preventDefault()
    // const node = findNodeDragEvent(e, graphRef.current?.graphData()?.nodes)
    
    if(!Boolean(node)) return;
    const camera = graphRef.current?.camera()
    const nodeObj = node.__threeObj;
    const data = nodeObj.__data;

    // cursor position
    const position = getNodePosition(e, {width: gRef.current?.offsetWidth, height: gRef.current?.offsetHeight}, epos)
    vec.set(position.x, position.y, 0.5).unproject( camera );
    // Calculate a unit vector from the camera to the projected position
    vec.sub( camera.position ).normalize();
    // Project onto node z
    var distance = (data.z - camera.position.z) / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );

    const translate = {x: pos.x - data.x + 2, y: pos.y - data.y+1, z: pos.z - data.z+1};
    // Move fx/fy/fz (and x/y/z) of nodes based on object new position
    ['x', 'y', 'z'].forEach(c => data[`f${c}`] = data[c] = pos[c]);

    graphRef.current?.getForceGraph()?.d3AlphaTarget(0.3) // keep engine running at low intensity throughout drag
      .resetCountdown();  // prevent freeze while dragging

    data.__dragged = true;
    graphRef.current.onNodeDrag(data, translate);
  }

  function nodeDragEndHandle(e, node){
    if(!Boolean(node)) return;
    const controls = graphRef.current?.controls()

    graphRef.current?.getForceGraph()?.d3AlphaTarget(0)   // release engine low intensity
      .resetCountdown();  // let the engine readjust after releasing fixed nodes

    if (graphRef.current.enableNavigationControls) {
      controls.enabled = true; // Re-enable controls
      controls.domElement && controls.domElement.ownerDocument && controls.domElement.ownerDocument.dispatchEvent(
        // simulate mouseup to ensure the controls don't take over after dragend
        new PointerEvent('pointerup', { pointerType: 'touch' })
      );
    }
  }

  const updateStyle = (forceUpdate = false) => {
    console.debug(centerNodeId, activeNodeIds, highLightNodeIds)
    nodeStyle(colors, graphData.nodes, graphData.links, centerNodeId, activeNodeIds, highLightNodeIds, forceUpdate)
    graphRef.current?.linkWidth(
      (link: Link) => calculateLinkWidth(link, highLightNodeIds, centerNodeId)
    ).linkColor(
      (link: Link) => calculateLinkColor(colors, link, highLightNodeIds, centerNodeId)
    )
  }

  function scrollHandle (e: UIEvent) {
    graphRef.current?.controls().zoomCamera()
  }

  useEffect(() => {
    console.debug("rendered")
    const Graph = ForceGraph3D({extraRenderers: [new CSS2DRenderer()]})
    (document.getElementById('graph3d')!)
    .width(gRef.current?.offsetWidth)
    .height(gRef.current?.offsetHeight)
    .backgroundColor('#00000000')
    .cooldownTime(3000)
    .nodeThreeObject((node) => htmlTextNode({
      node: node,
      clickHandle: nodeClickHandle,
      dragStartHandle: nodeDragStartHandle,
      dragHandle: nodeDragHandle,
      dragEndHandle: nodeDragEndHandle,
      scrollHandle: scrollHandle,
      mouseOverHandle: onNodeMouseOver,
      mouseLeaveHandle: onNodeMouseLeave,
    }))
    .enableNodeDrag(false)
    .linkOpacity(1)
    .linkDirectionalParticles(0.2)
    .linkDirectionalParticleWidth(0.3)
    .linkDirectionalParticleSpeed(0.002)
    .onLinkClick(linkClickHandle)
    .onEngineTick(onRenderComplete)
    .onLinkHover(onLinkHover)
    
    // Spread nodes a little wider
    Graph.d3Force('charge')?.strength(-300);
    graphRef.current = Graph;
    
    // slowdown when graphdata changed
    setTimeout(() => Graph.d3AlphaDecay(0.2), 5000)
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
    setColors({
      bg: bgColor,
      linkHigh: lightLevel > 150 ? '#000000' : '#ffffff',
      linkLow: lightLevel > 150 ? '#bbbbbb' : '#777777',
      nodes: randomNodeColors(bgColor)
    })
  }, [theme])

  useEffect(() => {
    console.debug("colors.bg updated")
    updateStyle(true)
  }, [colors.bg])

  useEffect(() => {
    console.debug("activeNodeIds, highLightNodeIds updated")
    updateStyle()
  }, [activeNodeIds?.join('_'), highLightNodeIds?.join('_'), centerNodeId])

  useEffect(() => {
    // move camera back to last position
    if(!Boolean(centerNodeId) && Boolean(cameraRef.current)) {
      const {x, y, z} = cameraRef.current!
      graphRef.current?.cameraPosition({x,y,z}, ({x: 0, y: 0, z: 0}), 2000)
    }
  }, [centerNodeId])

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

  // useEffect(() => {
  //   const observer = new ResizeObserver(_ => {
  //     gRef.current?.width(gRef.current?.offsetWidth)
  //     .height(gRef.current?.offsetHeight)
  //   })
  //   observer.observe(gRef.current)
  //   return () => gRef.current && observer.unobserve(gRef.current)
  // }, [])

  // useEffect(() => {
  //   // gRef
  //   gRef.current?.classList?.toggle(styles.animationing)
  // }, [animationing])

  return useMemo(() => (
    <div ref={gRef} className={styles.graph} id="graph3d"></div>
  ), [1])
}

export default Graph3D
