import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      backgroundColor: '#080c14',
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.04) 0%, transparent 50%)
      `
    }}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 28
          }}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{
        flex: 1,
        marginLeft: 'clamp(0px, 220px, 220px)',
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh', minWidth: 0,
        transition: 'margin-left 0.3s ease'
      }}
        className="main-content"
      >
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main style={{
          flex: 1, padding: 'clamp(16px, 4vw, 28px)',
          overflowY: 'auto', overflowX: 'hidden'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}