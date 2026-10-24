import { useApp } from '../store'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  return (
    <div className={`toast toast-${toast.tone}`} key={toast.key} role="status">
      {toast.message}
    </div>
  )
}
