import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex', minHeight: '100vh',
      backgroundColor: '#080c14',
      backgroundImage: `
        radial-gradient(ellipse at 20% 50%, rgba(34,211,238,0.04) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(16,185,129,0.04) 0%, transparent 50%)
      `
    }}>
      <Sidebar />
      <div style={{
        flex: 1, marginLeft: '220px',
        display: 'flex', flexDirection: 'column',
        minHeight: '100vh', minWidth: 0
      }}>
        <Navbar />
        <main style={{
          flex: 1, padding: '24px 28px',
          overflowY: 'auto', overflowX: 'hidden'
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}