import React, { MouseEventHandler, useMemo, useRef } from "react";
import { Word } from "../../domain/models";
import { ellipsis } from "../../common/text";

export const GraphNode: React.FC<{
  node: Word,
  focus?: boolean,
  onClick?: MouseEventHandler,
  onDragStart?: MouseEventHandler,
  onDrag?: MouseEventHandler,
  onDragEnd?: MouseEventHandler,
  onMouseOver?: MouseEventHandler,
  onMouseLeave?: MouseEventHandler,
}> = ({
  node,
  focus,
  onClick,
  onDragStart,
  onDrag,
  onDragEnd,
  onMouseOver,
  onMouseLeave,
}) => {

  node.elementRef = useRef();

  const wheelHandle = (e) => {
    window.graph3d?.querySelector('canvas')?.dispatchEvent(
      new WheelEvent('wheel', {
        deltaMode: 0, // Use 0 for pixel units, 1 for line units, 2 for page units
        deltaX: 0,    // Horizontal scroll amount
        deltaY: e.deltaY,  // Vertical scroll amount (adjust as needed)
        clientX: 0,   // X coordinate of the mouse
        clientY: 0,   // Y coordinate of the mouse
      })
    );
  }

  return useMemo(() => (
    <div
      ref={node.elementRef}
      key={`graph_node_${node.id}`}
      draggable={true}
      className={`node flex flex-row items-center justify-start hover:cursor-pointer pointer-events-auto`}
      onClick={onClick}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDragOver={e => e.preventDefault()}
      onWheel={wheelHandle}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <div className={`tooltip tooltip-secondary before:text-xs relative`} data-tip={node.content}>
        <div className="background absolute inset-0 opacity-30 rounded-btn"
          style={{backgroundColor: node.bgColor}}
        ></div>
        <div
          className={`content relative rounded-btn flex pointer-events-none font-weight-300 text-xs px-1 py-0.5`}
          style={{
            color: node.textColor
          }}
        >
          {focus? node.content : ellipsis(node.content, 30)}
        </div>
      </div>
    </div>
  ), [node.id, node.color, focus])
}
