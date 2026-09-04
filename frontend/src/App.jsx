import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LogsTerminal from './components/LogsTerminal';
import DeployWizard from './components/DeployWizard';
import { 
  CloudLightning, RefreshCw, Cpu, Database, 
  Terminal, ShieldCheck, User, Settings 
} from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

export default function App() {
  const [containers, setContainers] = useState([]);
  const [activeContainerId, setActiveContainerId] = useState('c1-nginx');
  const [isDeployWizardOpen, setIsDeployWizardOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch containers list
  const fetchContainers = async () => {
    try {
      const res = await fetch(`${API_BASE}/containers`);
      if (res.ok) {
        const data = await res.json();
        setContainers(data);
        // Default active container if currently active one is missing/deleted
        if (data.length > 0 && !data.some(c => c.id === activeContainerId)) {
          setActiveContainerId(data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch containers", err);
    }
  };

  // Poll containers state every 3 seconds
  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 3000);
    return () => clearInterval(interval);
  }, [activeContainerId]);

  // Actions
  const handleStartContainer = async (id) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, status: 'running' } : c));
    try {
      await fetch(`${API_BASE}/containers/${id}/start`, { method: 'POST' });
      fetchContainers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStopContainer = async (id) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, status: 'stopped' } : c));
    try {
      await fetch(`${API_BASE}/containers/${id}/stop`, { method: 'POST' });
      fetchContainers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestartContainer = async (id) => {
    setContainers(prev => prev.map(c => c.id === id ? { ...c, status: 'restarting' } : c));
    try {
      await fetch(`${API_BASE}/containers/${id}/restart`, { method: 'POST' });
      fetchContainers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteContainer = async (id) => {
    if (confirm('Are you sure you want to terminate and delete this microservice container?')) {
      try {
        const res = await fetch(`${API_BASE}/containers/${id}`, { method: 'DELETE' });
        if (res.ok) {
          const remaining = containers.filter(c => c.id !== id);
          setContainers(remaining);
          if (activeContainerId === id && remaining.length > 0) {
            setActiveContainerId(remaining[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeployContainer = async (newContainer) => {
    try {
      const res = await fetch(`${API_BASE}/containers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContainer)
      });
      if (res.ok) {
        const created = await res.json();
        setContainers(prev => [...prev, created]);
        setActiveContainerId(created.id);
        setIsDeployWizardOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchContainers();
    setTimeout(() => setIsRefreshing(false), 800);
  };


  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Panel */}
      <header className="glass-panel" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Logo and environment info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            borderRadius: '10px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(6,182,212,0.3)'
          }}>
            <CloudLightning size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Antigravity Cloud Engine
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--accent-green)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} /> AWS us-east-1 (Staging)
              </span>
              <span>•</span>
              <span>Account: 4882-9901-1102</span>
            </div>
          </div>
        </div>

        {/* Global actions and user info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleRefresh} 
            style={{ padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border-card)', paddingLeft: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-cyan)'
            }}>
              <User size={16} />
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 500 }}>pc@antigravity</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Dev Cluster Admin</div>
            </div>
          </div>
        </div>

      </header>

      {/* Main Grid View */}
      <div className="dashboard-grid">
        
        {/* Left Side: Container Dashboard */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Dashboard 
            containers={containers}
            onStartContainer={handleStartContainer}
            onStopContainer={handleStopContainer}
            onRestartContainer={handleRestartContainer}
            onDeleteContainer={handleDeleteContainer}
            onOpenDeployWizard={() => setIsDeployWizardOpen(true)}
            onSelectContainer={(id) => setActiveContainerId(id)}
          />
        </div>

        {/* Right Side: Logs Terminal Shell */}
        <div>
          {containers.length > 0 ? (
            <LogsTerminal 
              containers={containers}
              activeContainerId={activeContainerId}
              setActiveContainerId={setActiveContainerId}
            />
          ) : (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No containers active. Deploy a service to access the logs terminal.
            </div>
          )}
        </div>

      </div>

      {/* Deployment Form Wizard Popup */}
      {isDeployWizardOpen && (
        <DeployWizard 
          onDeploy={handleDeployContainer}
          onClose={() => setIsDeployWizardOpen(false)}
        />
      )}

      {/* CSS Animation rule */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>

    </div>
  );
}
