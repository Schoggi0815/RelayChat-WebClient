import { TextInput, TextInputProps } from '@mantine/core'
import classes from './ProculinaTextInput.module.css'
import { RevertInputButton } from './RevertInputButton'

export type RelayChatTextInputProps = {
  value?: string
  originalValue?: string
  disabled?: boolean
  label?: string

  onValueChange?: (newValue: string) => void
  autoFocus?: boolean
} & TextInputProps

export const RelayChatTextInput = (props: RelayChatTextInputProps) => {
  const hasChange =
    props.originalValue != null && props.value !== props.originalValue

  return (
    <TextInput
      {...props}
      data-autoFocus={props.autoFocus}
      label={props.label}
      value={props.value}
      disabled={props.disabled}
      onChange={e => props.onValueChange?.(e.currentTarget.value)}
      classNames={{
        input: hasChange ? classes.changed : undefined,
      }}
      rightSection={
        hasChange && (
          <RevertInputButton
            onClick={e => {
              e.stopPropagation()
              if (props.originalValue != null)
                props.onValueChange?.(props.originalValue)
            }}
          />
        )
      }
    />
  )
}
