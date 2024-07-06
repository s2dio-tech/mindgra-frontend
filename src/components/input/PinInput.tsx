import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, useEffect, useState } from "react";

const PinInput: React.FC<{
  length: number,
  onChange: (val: string) => void,
  error?: boolean
}> = ({
  length,
  onChange,
  error
}) => {

  const [values, setValues] = useState<(`number` | '')[]>(Array(length).fill(''))

  useEffect(() => {
    var _focusIdx = length - 1;
    values.forEach((val, idx) => {
      _focusIdx = val === '' && idx < _focusIdx ? idx : _focusIdx;
    })
    focusTo(_focusIdx)
  }, [values])

  const onValueChange = (e: ChangeEvent, index: number) => {
    if(index < 0 || index > length) return;
    var value = e.target.value
    var tmps = [...values]
    tmps[index] = value;
    setValues(tmps);
    onChange(tmps.join(''))
  }

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
    } else if( e.key === 'Backspace' || e.key == 'Delete' ) {
      if(values[index] === '' && 0 < index) {
        focusTo(index - 1)
      }
    }
  }

  const onPaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain")
    const vals = pasted.replace(/^\D+/g, '').split("").slice(0, length)
    vals.push(...Array(length-vals.length).fill(''))
    setValues(vals)
    onChange(vals.join(''))
  }

  const focusTo = (idx: number) => {
    var input = window[`pin_input_${idx}`];
    input?.focus();
  }

  return (
    <div className="flex flex-row items-center justify-between space-x-2">
      {values.map((val, idx) => {
        
        return (
          <input
            key={`pin_input_${idx}`}
            id={`pin_input_${idx}`}
            className={`input input-bordered bg-base-300 text-center rounded-lg text-xl p-px aspect-square appearance-none ${error ? 'input-error' : ''}`}
            type="number"
            name={`pin_input_${idx}`}
            maxLength={1}
            value={val}
            onKeyDown={e => onKeyDown(e, idx)}
            onChange={(e) => onValueChange(e, idx)}
            onPaste={onPaste}
          />
        )
      })}
    </div>
  )
}

export default PinInput;
