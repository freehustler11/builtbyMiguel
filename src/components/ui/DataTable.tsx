import React, { useState, useMemo } from 'react'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  MoreHorizontal,
  Layers,
  X,
} from 'lucide-react'

export interface ColumnDef<T> {
  id: string
  header: string
  accessor?: (item: T) => React.ReactNode
  sortKey?: string
  align?: 'left' | 'center' | 'right'
  width?: string
  className?: string
  headerClassName?: string
}

export interface BulkAction<T> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'danger' | 'accent' | 'secondary'
  onClick: (selectedItems: T[], clearSelection: () => void) => void | Promise<void>
}

export interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  keyExtractor: (item: T) => string
  sort?: string
  order?: 'asc' | 'desc'
  onSortChange?: (sortKey: string, order: 'asc' | 'desc') => void
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (sortKey: string, order: 'asc' | 'desc') => void
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  bulkActions?: BulkAction<T>[]
  rowActions?: (item: T) => React.ReactNode
  onRowClick?: (item: T) => void
  emptyMessage?: string
  isLoading?: boolean
  className?: string
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  sort,
  order = 'asc',
  onSortChange,
  sortKey: aliasSortKey,
  sortOrder: aliasSortOrder,
  onSort: aliasOnSort,
  selectable,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  bulkActions,
  rowActions,
  onRowClick,
  emptyMessage = 'No records found',
  isLoading = false,
  className = '',
}: DataTableProps<T>) {
  const effectiveSort = aliasSortKey !== undefined ? aliasSortKey : sort
  const effectiveOrder = aliasSortOrder !== undefined ? aliasSortOrder : order
  const triggerSortChange = (key: string, ord: 'asc' | 'desc') => {
    if (onSortChange) onSortChange(key, ord)
    if (aliasOnSort) aliasOnSort(key, ord)
  }

  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([])
  const selectedIds = controlledSelectedIds !== undefined ? controlledSelectedIds : internalSelectedIds

  const setSelectedIds = (ids: string[]) => {
    if (onSelectionChange) {
      onSelectionChange(ids)
    } else {
      setInternalSelectedIds(ids)
    }
  }

  const allKeys = useMemo(() => data.map(keyExtractor), [data, keyExtractor])
  const isAllSelected = allKeys.length > 0 && allKeys.every((k) => selectedIds.includes(k))
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(allKeys)
    }
  }

  const handleToggleRow = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (selectedIds.includes(key)) {
      setSelectedIds(selectedIds.filter((id) => id !== key))
    } else {
      setSelectedIds([...selectedIds, key])
    }
  }

  const handleHeaderSort = (columnSortKey?: string) => {
    if (!columnSortKey || (!onSortChange && !aliasOnSort)) return
    if (effectiveSort === columnSortKey) {
      triggerSortChange(columnSortKey, effectiveOrder === 'asc' ? 'desc' : 'asc')
    } else {
      triggerSortChange(columnSortKey, 'asc')
    }
  }

  const selectedItems = useMemo(() => {
    const set = new Set(selectedIds)
    return data.filter((item) => set.has(keyExtractor(item)))
  }, [data, selectedIds, keyExtractor])

  const showSelection = Boolean(bulkActions || selectable)

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-[8px] border border-[var(--line)] bg-[var(--panel)] shadow-2xs">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead className="bg-[var(--canvas)]/80 sticky top-0 z-10 border-b border-[var(--line)] backdrop-blur-xs">
            <tr>
              {/* Checkbox Column */}
              {showSelection && (
                <th className="w-10 px-3 py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                    className="w-4 h-4 rounded-[4px] border-[var(--line)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                  />
                </th>
              )}

              {/* Data Columns */}
              {columns.map((col) => {
                const isSorted = effectiveSort && col.sortKey === effectiveSort
                const isSortable = Boolean(col.sortKey && (onSortChange || aliasOnSort))

                return (
                  <th
                    key={col.id}
                    scope="col"
                    style={{ width: col.width }}
                    onClick={() => isSortable && handleHeaderSort(col.sortKey)}
                    className={`
                      px-3.5 py-2.5 text-[12px] font-medium text-[var(--muted)] select-none whitespace-nowrap
                      ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                      ${isSortable ? 'cursor-pointer hover:text-[var(--ink)] transition-colors' : ''}
                      ${col.headerClassName || ''}
                    `}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {isSortable && (
                        <span className="shrink-0 text-[var(--muted)]">
                          {isSorted ? (
                            effectiveOrder === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[var(--accent)]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}

              {/* Actions Column */}
              {rowActions && (
                <th className="w-24 px-3.5 py-2.5 text-right text-[12px] font-medium text-[var(--muted)] select-none">
                  <span>Actions</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[var(--line)]/50">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length + (showSelection ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-[13px] text-[var(--muted)]"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
                    <span>Loading records...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showSelection ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-[13px] text-[var(--muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item)
                const isSelected = selectedIds.includes(key)

                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={`
                      group transition-colors
                      ${onRowClick ? 'cursor-pointer' : ''}
                      ${isSelected ? 'bg-[var(--accent)]/5' : 'hover:bg-[var(--line)]/20'}
                    `}
                  >
                    {/* Checkbox */}
                    {showSelection && (
                      <td
                        className="w-10 px-3 py-2 text-center shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleRow(key, e as any)}
                          aria-label={`Select row ${key}`}
                          className="w-4 h-4 rounded-[4px] border-[var(--line)] text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Data Cells */}
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`
                          px-3.5 py-2.5 text-[13px] text-[var(--ink)] whitespace-nowrap
                          ${col.align === 'right' ? 'text-right font-mono tabular-nums' : col.align === 'center' ? 'text-center' : 'text-left'}
                          ${col.className || ''}
                        `}
                      >
                        {col.accessor ? col.accessor(item) : (item as any)[col.id]}
                      </td>
                    ))}

                    {/* Row Actions (Hover-Revealed) */}
                    {rowActions && (
                      <td
                        className="w-24 px-3.5 py-2 text-right shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {rowActions(item)}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Floating / Sticky Bulk Action Bar */}
      {bulkActions && selectedIds.length > 0 && (
        <div className="sticky bottom-3 left-0 right-0 mx-auto w-fit z-20 flex items-center gap-3 px-4 py-2 rounded-[8px] bg-[var(--panel)] border border-[var(--line)] shadow-xl text-[12px] font-medium text-[var(--ink)] animate-in slide-in-from-bottom-2 fade-in duration-150">
          <span className="flex items-center gap-1.5 text-[var(--accent)] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
          </span>

          <div className="h-4 w-px bg-[var(--line)]" />

          {/* Bulk Actions */}
          <div className="flex items-center gap-1.5">
            {bulkActions.map((action, idx) => {
              const Icon = action.icon
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => action.onClick(selectedItems, () => setSelectedIds([]))}
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] transition cursor-pointer text-[12px] font-medium
                    ${
                      action.variant === 'accent'
                        ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90'
                        : action.variant === 'danger'
                        ? 'bg-[var(--danger)] text-white hover:bg-[var(--danger)]/90'
                        : 'bg-[var(--canvas)] border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--line)]/40'
                    }
                  `}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>

          <div className="h-4 w-px bg-[var(--line)]" />

          {/* Clear Selection */}
          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="p-1 rounded-[4px] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)]/40 transition cursor-pointer"
            title="Deselect all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
