import React, { ReactNode } from 'react'

export const Drawer: React.FC<{
  id: string,
  open: boolean,
  side?: 'left' | 'right',
  onClose: () => void,
  children: ReactNode
}> = ({
  id = 'my_drawer',
  side = 'right',
  open,
  onClose,
  children,
}) => {
  

  return (
    <div className={`drawer ${side === 'left' ? '' : 'drawer-end'} z-[101] ${open ? 'absolute left-0 top-0 w-full pointer-events-auto' : 'w-0 pointer-events-none'}`}>
      <input id={id} type="checkbox" className="drawer-toggle" checked={open} readOnly/>
      <div className="drawer-side absolute">
        <label htmlFor={id} className={`drawer-overlay`} onClick={onClose}></label>
        <div className="max-w-sm drop-shadow-xl h-full flex flex-row bg-base-100">
          <div className="divider divider-horizontal h-full w-px m-0"></div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Drawer;