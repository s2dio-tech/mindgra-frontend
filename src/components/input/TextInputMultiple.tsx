import React, { ChangeEvent, useEffect, useState } from "react"
import { Icon, IconPlus, IconTrash } from "../Icons";

const TextInputMultiple: React.FC<{
  name: string,
  max: number,
  vals?: string[],
  placeholder?: string,
  disabled?: boolean,
  onChanged?: (e: ChangeEvent) => void,
}> = ({
  name,
  max = 3,
  vals,
  placeholder,
  disabled,
  onChanged
}) => {

    const [inputFields, setInputFields] = useState<string[]>([]);

    useEffect(() => {
      setInputFields(vals || [])
    }, [vals])

    // const update = (fls: string[]) => {
    //   setInputFields(fls)
    //   if (typeof onChanged === 'function') {
    //     onChanged(fls)
    //   }
    // }

    const addInputField = () => {
      setInputFields([...inputFields, ''])
    }

    const removeInputFields = (index: number) => {
      const rows = [...inputFields];
      rows.splice(index, 1);
      setInputFields(rows);
    }

    const handleChange = (index: number, e: ChangeEvent) => {
      var list: string[] = [...inputFields];
      list[index] = e.target.value;
      // update(list);
      setInputFields(list)
      onChanged?.call(this, e);
    }

    return (
      <div className="w-full">
        {
          inputFields.map((val, index) => {
            return (
              <div className="flex gap-2 mb-2" key={index}>
                <input
                  type="text"
                  name={`${name}[${index}]`}
                  value={val}
                  onChange={(evnt) => handleChange(index, evnt)}
                  disabled={disabled}
                  placeholder={placeholder}
                  className="input input-bordered input-sm w-full"
                />
                <button type="button"
                  className="btn btn-circle btn-sm"
                  onClick={() => removeInputFields(index)}
                  disabled={disabled}
                >
                  <Icon icon={IconTrash} className="w-2"/>
                </button>
              </div>
            )
          })
        }

        {inputFields.length < max && (
          <div className="w-full h-5">
            <button type="button"
              className="btn btn-square btn-sm btn-outline h-6 w-12 min-h-fit"
              onClick={addInputField}
              disabled={disabled}
            >
              <Icon icon={IconPlus} className="w-3"/>
            </button>
          </div>
        )}
      </div>

    )
  }
export default TextInputMultiple