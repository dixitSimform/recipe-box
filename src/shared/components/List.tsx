import type { ReactElement, ReactNode } from 'react'

export type ListProps<T> = {
  items: T[]
  renderItem: (item: T) => ReactNode
  getKey: (item: T) => string
  emptyMessage: string
}

// T is inferred from `items`, so renderItem and getKey get the same item type
export function List<T>({
  items,
  renderItem,
  getKey,
  emptyMessage,
}: ListProps<T>): ReactElement {
  if (items.length === 0) {
    return <p className="empty">{emptyMessage}</p>
  }

  return (
    <ul className="list">
      {items.map((item) => (
        <li key={getKey(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
