import styled from 'styled-components'

export const Container = styled.div`
  padding: 0.5rem 0.25rem;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: ${({ theme }) => theme.color.base.card};
`

export const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;

  > div {
    > p {
      color: ${({ theme }) => theme.color.base.subtitle};
      margin-bottom: 0.5rem;
    }
  }
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.5rem;
  background: ${({ theme }) => theme.color.base.button};
  border-radius: 6px;
  height: 2rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.purple[500]};
  transition: 0.3s;

  span {
    color: ${({ theme }) => theme.color.base.text};
    transition: 0.3s;
  }

  :hover {
    background: ${({ theme }) => theme.color.base.hover};

    span {
      color: ${({ theme }) => theme.color.base.subtitle};
    }
  }
`

export const Total = styled.span`
  display: flex;
  align-items: center;
  font-weight: 700;
`
