import { Button, ButtonProps, createPolymorphicComponent } from '@mantine/core'
import { forwardRef, useState } from 'react'

export interface AsyncButtonProps extends ButtonProps {
  onClick: () => Promise<void>
}

export const AsyncButton = createPolymorphicComponent<
  'button',
  AsyncButtonProps
>(
  forwardRef<HTMLButtonElement, AsyncButtonProps>(
    ({ onClick, ...others }, ref) => {
      const [isLoading, setIsLoading] = useState(false)

      const onThisClick = () => {
        setIsLoading(true)
        onClick().finally(() => setIsLoading(false))
      }

      return (
        <Button
          {...others}
          ref={ref}
          onClick={onThisClick}
          loading={isLoading ? isLoading : undefined}
        />
      )
    }
  )
)
