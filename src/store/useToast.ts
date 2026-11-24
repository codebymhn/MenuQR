import { create } from 'zustand'

export type ToastKind = 'success' | 'error' | 'info'
export interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

interface ToastState {
  toasts: ToastItem[]
  push: (message: string, kind?: ToastKind) => void
  dismiss: (id: number) => void
}

let counter = 0

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  push: (message, kind = 'success') => {
    const id = ++counter
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, kind }] }))
    setTimeout(() => get().dismiss(id), 3200)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = (message: string, kind?: ToastKind) => useToast.getState().push(message, kind)
