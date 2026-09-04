import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Play, Trash2, ShieldAlert } from 'lucide-react';

export default function LogsTerminal({ containers, activeContainerId, setActiveContainerId }) {
  const [terminalInput, setTerminalInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Welcome to Antigravity Cloud Container Shell v1.0.0' },
    { type: 'system', text: 'Type "help" to see available commands.' },
  ]);
  const [logs, setLogs] = useState({});
  const [followLogs, setFollowLogs] = useState(true);
  const logsEndRef = useRef(null);

  // Fetch logs for active container from backend
  useEffect(() => {
    if (!activeContainerId) return;

    const fetchLogs = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/containers/${activeContainerId}/logs`);
        if (res.ok) {
          const data = await res.json();
          setLogs(prev => ({
            ...prev,
            [activeContainerId]: data
          }));
        }
      } catch (err) {
        console.error("Failed to fetch logs", err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 2000);
    return () => clearInterval(interval);
  }, [activeContainerId]);

  // Scroll to bottom of logs/terminal
  useEffect(() => {
    if (followLogs) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, logs, activeContainerId, followLogs]);

  const handleCommand = async (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'prompt', text: `$ ${terminalInput}` }];

    if (cmd === 'clear') {
      setHistory([]);
      setTerminalInput('');
      return;
    }

    if (cmd === 'help') {
      newHistory.push({
        type: 'system',
        text: 'Available commands: \n  help - Show list of commands\n  clear - Clear terminal history\n  docker ps - List all containers\n  docker logs [container_name] - Show logs of container\n  system info - Show host system specs',
      });
    } else if (cmd === 'docker ps') {
      const psLines = containers.map(c => 
        `${c.id.substring(0, 8)}\t${c.name.padEnd(20)}\t${c.status.padEnd(10)}\tPort: ${c.port}`
      ).join('\n');
      newHistory.push({ type: 'output', text: `CONTAINER ID\tNAME\t\t\tSTATUS\t\tPORTS\n${psLines}` });
    } else if (cmd.startsWith('docker logs ')) {
      const name = cmd.replace('docker logs ', '').trim();
      const container = containers.find(c => c.name.toLowerCase() === name || c.id.toLowerCase().startsWith(name));
      if (container) {
        try {
          const res = await fetch(`http://localhost:8080/api/containers/${container.id}/logs`);
          if (res.ok) {
            const cLogs = await res.json();
            newHistory.push({ type: 'output', text: cLogs.join('\n') });
          } else {
            newHistory.push({ type: 'error', text: `Error: Failed to fetch logs for ${name}` });
          }
        } catch (err) {
          newHistory.push({ type: 'error', text: `Error: Could not reach backend` });
        }
      } else {
        newHistory.push({ type: 'error', text: `Error: No such container: ${name}` });
      }
    } else if (cmd === 'system info') {
      try {
        const res = await fetch('http://localhost:8080/api/system/info');
        if (res.ok) {
          const info = await res.json();
          const infoStr = `OS: ${info.OS}\nArch: ${info.Arch}\nKernel: ${info.Kernel}\nDocker Version: ${info.DockerVersion}\nCPUs: ${info.CPUs}\nRAM: ${info.RAM}`;
          newHistory.push({ type: 'output', text: infoStr });
        } else {
          newHistory.push({ type: 'error', text: 'Error: Failed to fetch system info' });
        }
      } catch (err) {
        newHistory.push({ type: 'error', text: 'Error: Could not reach backend' });
      }
    } else {
      newHistory.push({ type: 'error', text: `command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setTerminalInput('');
  };

  const selectedContainerLogs = logs[activeContainerId] || [];

  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', minHeight: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-card)', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalIcon style={{ color: 'var(--accent-cyan)' }} size={20} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Shell & Live Logs</h2>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={followLogs} 
              onChange={(e) => setFollowLogs(e.target.checked)} 
              style={{ accentColor: 'var(--accent-cyan)' }}
            />
            Autoscroll
          </label>
          <select 
            value={activeContainerId} 
            onChange={(e) => setActiveContainerId(e.target.value)}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-card)',
              borderRadius: '6px',
              padding: '4px 12px',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.85rem'
            }}
          >
            {containers.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Terminal View */}
      <div 
        style={{
          flexGrow: 1,
          background: '#040711',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: '#e2e8f0',
          overflowY: 'auto',
          maxHeight: '350px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', borderBottom: '1px dashed rgba(255,255,255,0.05)', paddingBottom: '8px', marginBottom: '4px' }}>
          -- Container Logs Stream for {containers.find(c => c.id === activeContainerId)?.name} --
        </div>
        
        {/* Stream logs */}
        {selectedContainerLogs.map((log, idx) => (
          <div key={`log-${idx}`} style={{ whiteSpace: 'pre-wrap', color: log.includes('[ERROR]') ? 'var(--accent-rose)' : log.includes('[WARN]') ? 'var(--accent-amber)' : '#a7f3d0' }}>
            {log}
          </div>
        ))}

        {/* Command Shell History */}
        {history.length > 0 && (
          <div style={{ marginTop: '16px', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '12px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '8px' }}>-- Interactive Terminal --</div>
            {history.map((h, idx) => (
              <div key={`hist-${idx}`} style={{ 
                color: h.type === 'prompt' ? 'var(--accent-cyan)' : h.type === 'error' ? 'var(--accent-rose)' : h.type === 'system' ? 'var(--accent-purple)' : '#f8fafc',
                whiteSpace: 'pre-wrap',
                marginBottom: '4px'
              }}>
                {h.text}
              </div>
            ))}
          </div>
        )}

        <div ref={logsEndRef} />
      </div>

      {/* Shell Form */}
      <form onSubmit={handleCommand} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center' }}>$</span>
        <input 
          type="text" 
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          placeholder="Enter command (e.g. 'docker ps', 'system info', 'help')..."
          style={{
            flexGrow: 1,
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-card)',
            borderRadius: '6px',
            padding: '8px 12px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            outline: 'none'
          }}
        />
      </form>
    </div>
  );
}
