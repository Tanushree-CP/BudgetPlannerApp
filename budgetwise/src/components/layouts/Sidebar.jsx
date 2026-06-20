import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiList, FiPieChart, FiTarget,
  FiUser, FiLogOut, FiTrendingUp, FiPlus
} from 'react-icons/fi'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { to: '/',          icon: FiGrid,     label: 'Dashboard'   },
  { to: '/expenses',  icon: FiList,     label: 'Expenses'    },
  { to: '/add',       icon: FiPlus,     label: 'Add Expense' },
  { to: '/analytics', icon: FiPieChart, label: 'Analytics'   },
  { to: '/budget',    icon: FiTarget,   label: 'Budget'      },
  { to: '/profile',   icon: FiUser,     label: 'Profile'     },
]

function Sidebar() {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FiTrendingUp size={20} color="white" />
        </div>
        <span className="sidebar-logo-text">BudgetWise</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={18} className="nav-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.avatar || 'U'}
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name || 'User'}</p>
            <p className="user-email">{user?.email || ''}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  )
}

export default Sidebar