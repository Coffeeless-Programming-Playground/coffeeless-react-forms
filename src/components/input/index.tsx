import { useCoffeelessHandler, useCoffeelessValidator } from '../../core'
import { ChangeEventHandler } from 'react'

type Props = {
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  value?: any
  type: 'text' | 'email' | 'password' | 'checkbox' | 'number' | 'textarea'
  id: string
  name?: string
  placeholder?: string
  label?: string
  readOnly?: boolean
  className?: string
  checked?: boolean
  style?: any
  rows?: number
}

const Input: React.FC<Props> = ({
  id,
  name,
  onChange,
  placeholder,
  type,
  value,
  label,
  readOnly,
  className,
  checked,
  style,
  rows
}) => {
  const { handleOnChange } = useCoffeelessHandler()
  const contextState = useCoffeelessValidator(name)

  const hasError = contextState.field && contextState.field.some((e: any) => e.error)

  function onChangeInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    onChange && onChange(e)

    contextState.field && handleOnChange(e)
  }

  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      {type === 'textarea' ? (
        <>
          <br />
          <textarea
            data-status={hasError ? 'invalid' : 'valid'}
            style={style}
            readOnly={readOnly || false}
            onChange={onChangeInput}
            value={value ?? ''}
            className={`${className || 'cofp-form-control'}`}
            id={id}
            name={name}
            placeholder={placeholder}
            rows={rows}
          />
        </>
      ) : (
        <input
          data-status={hasError ? 'invalid' : 'valid'}
          style={style}
          readOnly={readOnly || false}
          onChange={onChangeInput}
          value={value ?? ''}
          type={type}
          className={`${className || 'cofp-form-control'}`}
          id={id}
          name={name}
          placeholder={placeholder}
          checked={checked}
        />
      )}

      {hasError &&
        contextState.field.map(
          (e: any, i: number) =>
            e.error && (
              <p key={i} className="field-error .mt-2-error">
                {e.error.message}
              </p>
            )
        )}
    </>
  )
}

export default Input
