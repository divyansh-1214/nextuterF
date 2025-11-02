import * as React from "react"

export interface ToastProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: "default" | "destructive" | "success"
}

export type ToastActionElement = React.ReactNode

/**
 * Toast component - minimal implementation
 * This is a simple toast UI component that can be used with the useToast hook
 */
export const Toast = React.forwardRef<
  HTMLDivElement,
  ToastProps & {
    title?: React.ReactNode
    description?: React.ReactNode
    action?: ToastActionElement
    onClose?: () => void
  }
>(({ open, onOpenChange, title, description, action, onClose, variant = "default", ...props }, ref) => {
  React.useEffect(() => {
    if (!open && onOpenChange) {
      onOpenChange(false)
    }
  }, [open, onOpenChange])

  if (!open) return null

  // Variant-specific styles
  let bgColor = "#222"
  let textColor = "white"
  let borderColor = "transparent"

  if (variant === "destructive") {
    bgColor = "#b00020"
    textColor = "white"
    borderColor = "#8b0015"
  } else if (variant === "success") {
    bgColor = "#2e7d32"
    textColor = "white"
    borderColor = "#1b5e20"
  }

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        backgroundColor: bgColor,
        color: textColor,
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        border: `1px solid ${borderColor}`,
        maxWidth: 400,
        zIndex: 9999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
      }}
      {...props}
    >
      <div>
        {title && <div style={{ fontWeight: 600, marginBottom: title && description ? 4 : 0 }}>{title}</div>}
        {description && <div style={{ fontSize: 14, opacity: 0.9 }}>{description}</div>}
      </div>
      {action && <div>{action}</div>}
      <button
        onClick={() => {
          if (onOpenChange) onOpenChange(false)
          if (onClose) onClose()
        }}
        style={{
          background: "none",
          border: "none",
          color: textColor,
          cursor: "pointer",
          fontSize: 20,
          padding: 0,
          marginLeft: "8px",
        }}
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  )
})

Toast.displayName = "Toast"

export const Toaster = () => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        pointerEvents: "none",
      }}
    />
  )
}
