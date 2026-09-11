import { useState, useEffect, useCallback } from 'react'

export interface BoardStatusColumnDef {
  id: string
  label: string
}

export interface UseBoardKeyboardNavOptions<T extends { id: string; status: string }> {
  items: T[]
  columns: BoardStatusColumnDef[]
  onStatusChange: (item: T, newStatus: string) => void | Promise<void>
  onOpenItem?: (item: T) => void
  disabled?: boolean
}

export function useBoardKeyboardNav<T extends { id: string; status: string }>({
  items,
  columns,
  onStatusChange,
  onOpenItem,
  disabled = false,
}: UseBoardKeyboardNavOptions<T>) {
  const [focusedId, setFocusedId] = useState<string | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return

      // Do not trigger if typing in an input, textarea, or select
      const activeElement = document.activeElement as HTMLElement | null
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable)
      ) {
        return
      }

      const key = e.key.toLowerCase()

      // Escape: clear selection
      if (e.key === 'Escape') {
        setFocusedId(null)
        return
      }

      // J / ArrowDown: Next card
      if (key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault()
        if (items.length === 0) return
        if (!focusedId) {
          setFocusedId(items[0].id)
          return
        }
        const currentIndex = items.findIndex((i) => i.id === focusedId)
        if (currentIndex === -1 || currentIndex === items.length - 1) {
          setFocusedId(items[0].id)
        } else {
          setFocusedId(items[currentIndex + 1].id)
        }
        return
      }

      // K / ArrowUp: Previous card
      if (key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault()
        if (items.length === 0) return
        if (!focusedId) {
          setFocusedId(items[items.length - 1].id)
          return
        }
        const currentIndex = items.findIndex((i) => i.id === focusedId)
        if (currentIndex <= 0) {
          setFocusedId(items[items.length - 1].id)
        } else {
          setFocusedId(items[currentIndex - 1].id)
        }
        return
      }

      // Enter: Open item
      if (e.key === 'Enter' && focusedId && onOpenItem) {
        const currentItem = items.find((i) => i.id === focusedId)
        if (currentItem) {
          e.preventDefault()
          onOpenItem(currentItem)
        }
        return
      }

      // 1-5: Move status to corresponding column
      const num = parseInt(e.key, 10)
      if (!isNaN(num) && num >= 1 && num <= columns.length) {
        if (!focusedId) return
        const currentItem = items.find((i) => i.id === focusedId)
        if (!currentItem) return

        const targetCol = columns[num - 1]
        if (targetCol && targetCol.id !== currentItem.status) {
          e.preventDefault()
          onStatusChange(currentItem, targetCol.id)
        }
      }
    },
    [disabled, items, columns, focusedId, onStatusChange, onOpenItem]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return {
    focusedId,
    setFocusedId,
  }
}
