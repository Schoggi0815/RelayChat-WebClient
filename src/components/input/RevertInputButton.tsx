import {
  ActionIcon,
  ActionIconProps,
  PolymorphicComponentProps,
} from '@mantine/core'
import { FiRotateCcw } from 'react-icons/fi'

export const RevertInputButton = (
  props: PolymorphicComponentProps<'button', ActionIconProps>
) => (
  <ActionIcon {...props} variant="subtle" aria-label="revert">
    <FiRotateCcw />
  </ActionIcon>
)
