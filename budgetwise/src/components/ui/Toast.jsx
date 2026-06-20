import { useEffect } from 'react'
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi'

const ICONS = {
  success: FiCheckCircle,
  error:   FiAlertCircle,
  info:    FiInfo
}

const COLORS = {
  success: { bg: '#F0FDF4', border: '#BBF7D0', color: '#059669' },
  error:   { bg: '#FEF2F2', border: '#FECACA', color: '#dc2626' },
  info:    { bg: '#EFF6FF', border: '#BFDBFE', color: '#3b82f6' }
}

function Toast({ message, type = 'success', onClose }) {
  const Icon   = ICONS[type]  || ICONS.info
  const colors = COLORS[type] || COLORS.info

  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="toast" style={{
      background:  colors.bg,
      borderColor: colors.border,
      color:       colors.color
    }}>
      <Icon size={16} style={{ flexShrink: 0 }} />
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>
        <FiX size={14} />
      </button>
    </div>
  )
}

export default Toast