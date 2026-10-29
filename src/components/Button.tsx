import type { ReactElement, ReactNode } from 'react'

export type ButtonProps = {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  type?: 'button' | 'submit'
  disabled?: boolean
  pressed?: boolean
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  pressed,
}: ButtonProps): ReactElement => (
  <button
    type={type}
    className={`btn btn-${variant}`}
    onClick={onClick}
    disabled={disabled}
    aria-pressed={pressed}
  >
    {children}
  </button>
)
