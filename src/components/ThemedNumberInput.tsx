import React, { useRef } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

export interface ThemedNumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  theme?: 'blue' | 'emerald' | 'indigo' | 'rose' | 'slate'
  step?: number | string
  min?: number | string
  max?: number | string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (val: number | '') => void
  containerClassName?: string
  inputClassName?: string
}

export function ThemedNumberInput({
  theme = 'blue',
  step = 1,
  min = 0,
  max,
  value,
  onChange,
  onValueChange,
  placeholder,
  className = '',
  containerClassName = '',
  inputClassName = '',
  disabled = false,
  ...rest
}: ThemedNumberInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const numStep = typeof step === 'string' ? parseFloat(step) || 1 : step
  const numMin = min !== undefined && min !== '' ? (typeof min === 'string' ? parseFloat(min) : min) : undefined
  const numMax = max !== undefined && max !== '' ? (typeof max === 'string' ? parseFloat(max) : max) : undefined

  // Compute decimal precision based on step
  const decimals = step.toString().includes('.')
    ? step.toString().split('.')[1].length
    : 0

  const themeClasses = {
    emerald: {
      hover: 'hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60',
      active: 'active:bg-emerald-100 dark:active:bg-emerald-900/60',
      focusRing: 'focus-within:ring-emerald-500',
    },
    indigo: {
      hover: 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60',
      active: 'active:bg-indigo-100 dark:active:bg-indigo-900/60',
      focusRing: 'focus-within:ring-indigo-500',
    },
    blue: {
      hover: 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60',
      active: 'active:bg-blue-100 dark:active:bg-blue-900/60',
      focusRing: 'focus-within:ring-blue-500',
    },
    rose: {
      hover: 'hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60',
      active: 'active:bg-rose-100 dark:active:bg-rose-900/60',
      focusRing: 'focus-within:ring-rose-500',
    },
    slate: {
      hover: 'hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
      active: 'active:bg-slate-200 dark:active:bg-slate-700',
      focusRing: 'focus-within:ring-slate-500',
    },
  }[theme]

  const triggerChange = (newVal: number | '') => {
    if (onValueChange) {
      onValueChange(newVal)
    }

    if (inputRef.current) {
      // Create a native input event to trigger React's synthetic onChange
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(inputRef.current, newVal === '' ? '' : String(newVal))
      } else {
        inputRef.current.value = newVal === '' ? '' : String(newVal)
      }

      const event = new Event('input', { bubbles: true })
      inputRef.current.dispatchEvent(event)

      if (onChange) {
        const syntheticEvent = {
          ...event,
          target: inputRef.current,
          currentTarget: inputRef.current,
        } as unknown as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }
  }

  const handleStep = (direction: 'up' | 'down') => {
    if (disabled) return

    const currentValStr = value !== undefined ? String(value) : inputRef.current?.value || ''
    let currentNum = parseFloat(currentValStr)

    if (isNaN(currentNum)) {
      currentNum = numMin !== undefined ? numMin : 0
    }

    let nextVal: number
    if (direction === 'up') {
      nextVal = currentNum + numStep
      if (numMax !== undefined && nextVal > numMax) {
        nextVal = numMax
      }
    } else {
      nextVal = currentNum - numStep
      if (numMin !== undefined && nextVal < numMin) {
        nextVal = numMin
      }
    }

    // Fix floating point precision
    const rounded = Number(nextVal.toFixed(decimals))
    triggerChange(rounded)
  }

  return (
    <div className={`relative flex items-center group ${containerClassName}`}>
      <input
        ref={inputRef}
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full pr-5 pl-2.5 py-1.5 rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${inputClassName} ${className}`}
        {...rest}
      />

      {/* Themed Stepper Buttons */}
      {!disabled && (
        <div className="absolute right-1 inset-y-1 flex flex-col justify-center items-center w-3.5 z-10 select-none py-0.5 border-l border-slate-200/80 dark:border-slate-800">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep('up')}
            aria-label="Increase value"
            className={`flex-1 w-full flex items-center justify-center text-slate-400 dark:text-slate-500 rounded-t-sm transition-colors cursor-pointer ${themeClasses.hover} ${themeClasses.active}`}
          >
            <ChevronUp className="w-2.5 h-2.5 stroke-[2.5]" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep('down')}
            aria-label="Decrease value"
            className={`flex-1 w-full flex items-center justify-center text-slate-400 dark:text-slate-500 rounded-b-sm transition-colors cursor-pointer ${themeClasses.hover} ${themeClasses.active}`}
          >
            <ChevronDown className="w-2.5 h-2.5 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  )
}
