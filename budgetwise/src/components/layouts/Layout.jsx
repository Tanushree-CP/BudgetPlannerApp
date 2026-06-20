import Sidebar from './Sidebar'
import Toast from '../ui/Toast'
import { useApp } from '../../context/AppContext'

function Layout({ children }) {
  const { toast, hideToast } = useApp()

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
      {toast && (
        <div className="toast-container">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        </div>
      )}
    </div>
  )
}

export default Layout