import { InputHTMLAttributes, ReactNode } from 'react'
import { SelectContainer, SelectContent } from './styles'

interface SelectPropsType extends InputHTMLAttributes<HTMLInputElement> {
  children: ReactNode
}

export function Select({ children, ...rest }: SelectPropsType) {
  return (
    <SelectContainer>
      <input type="radio" {...rest} />

      <SelectContent>{children}</SelectContent>
    </SelectContainer>
  )
}
