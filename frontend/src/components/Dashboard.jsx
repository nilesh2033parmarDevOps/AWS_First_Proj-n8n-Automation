import React, { useState } from 'react';
import { 
  Search, Play, Square, RotateCw, Trash2, Cpu, HardDrive, 
  Network, Layers, Plus, ExternalLink 
} from 'lucide-react';

export default function Dashboard({ 
  containers, 
  onStartContainer, 
  onStopContainer, 
  onRestartContainer, 
  onDeleteContainer, 
  onOpenDeployWizard,
  onSelectContainer
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Resource Calculations
  const totalContainers = containers.length;
  const runningContainers = containers.filter(c => c.status === 'running').length;
  
  const totalCpu = containers.reduce((acc, c) => acc + (c.status === 'running' ? c.cpu : 0), 0);
  const totalRam = containers.reduce((acc, c) => acc + (c.status === 'running' ? c.ram : 0), 0);
  
  const cpuPercent = Math.min(100, Math.round((totalCpu / 200) * 100)); // assume 200 shares cap
  const ramPercent = Math.min(100, Math.round((totalRam / 2048) * 100)); // assume 2048 MB cap

  // Filtering Logic
  const filteredContainers = containers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.image.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        {/* Total Services */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
            <Layers size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Services</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {runningContainers} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/ {totalContainers} active</span>
            </div>
          </div>
        </div>

        {/* CPU Provisioned */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Cpu size={24} />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>CPU Shares Allocated</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{totalCpu}%</div>
            </div>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${cpuPercent}%`, background: 'var(--accent-cyan)', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>

        {/* Memory Provisioned */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
              <HardDrive size={24} />
            </div>
            <div style={{ flexGrow: 1 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>RAM Allocated</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{totalRam} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>MB</span></div>
            </div>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${ramPercent}%`, background: 'var(--accent-blue)', transition: 'width 0.5s ease-out' }}></div>
          </div>
        </div>

        {/* Bandwidth Usage */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-green)' }}>
            <Network size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Network Rx/Tx</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>84.3 <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Mbps</span></div>
          </div>
        </div>

      </div>

      {/* Main Containers list Panel */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Controls header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Active Services</h2>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', maxWidth: '500px', justifyContent: 'flex-end' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flexGrow: 1, maxWidth: '240px' }}>
              <Search style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} size={16} />
              <input 
                type="text" 
                placeholder="Search containers..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '6px',
                  padding: '8px 12px 8px 32px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Filter select */}
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-card)',
                borderRadius: '6px',
                padding: '8px 12px',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.85rem'
              }}
            >
              <option value="all">All States</option>
              <option value="running">Running</option>
              <option value="stopped">Stopped</option>
              <option value="restarting">Restarting</option>
            </select>

            {/* Deploy New Service Button */}
            <button onClick={onOpenDeployWizard} className="btn btn-primary">
              <Plus size={16} /> Deploy
            </button>
          </div>
        </div>

        {/* Table / Cards List */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-card)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <th style={{ padding: '12px 16px' }}>SERVICE / ID</th>
                <th style={{ padding: '12px 16px' }}>IMAGE</th>
                <th style={{ padding: '12px 16px' }}>STATUS</th>
                <th style={{ padding: '12px 16px' }}>PORT</th>
                <th style={{ padding: '12px 16px' }}>PROVISION</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredContainers.map(container => (
                <tr 
                  key={container.id} 
                  onClick={() => onSelectContainer(container.id)}
                  style={{ 
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'var(--transition-smooth)'
                  }}
                  className="table-row-hover"
                >
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {container.name}
                      <ExternalLink size={12} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ID: {container.id.substring(0, 12)}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.8rem', 
                      background: 'rgba(255,255,255,0.05)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      color: 'var(--text-secondary)'
                    }}>
                      {container.image}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`status-dot ${container.status}`}></span>
                      <span style={{ fontSize: '0.85rem', textTransform: 'capitalize', color: container.status === 'running' ? 'var(--accent-green)' : 'var(--text-secondary)' }}>
                        {container.status}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                    {container.status === 'running' ? (
                      <a href={`http://localhost:${container.port}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                        localhost:{container.port}
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>CPU: {container.cpu}%</span>
                      <span>RAM: {container.ram}MB</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {container.status === 'running' ? (
                        <button 
                          onClick={() => onStopContainer(container.id)} 
                          className="btn-icon action-stop" 
                          title="Stop Container"
                        >
                          <Square size={14} fill="currentColor" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => onStartContainer(container.id)} 
                          className="btn-icon action-start" 
                          title="Start Container"
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                      )}
                      <button 
                        onClick={() => onRestartContainer(container.id)} 
                        className="btn-icon" 
                        title="Restart Container"
                      >
                        <RotateCw size={14} />
                      </button>
                      <button 
                        onClick={() => onDeleteContainer(container.id)} 
                        className="btn-icon action-delete" 
                        title="Delete Container"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContainers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No microservices match current filters or search terms.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
