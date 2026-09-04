import React, { useState } from 'react';
import { Play, X, Info } from 'lucide-react';

export default function DeployWizard({ onDeploy, onClose }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('nginx:alpine');
  const [port, setPort] = useState('80');
  const [cpu, setCpu] = useState('25');
  const [ram, setRam] = useState('128');
  const [envVars, setEnvVars] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter a service/container name.');

    onDeploy({
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim().toLowerCase().replace(/\s+/g, '-'),
      image,
      port: parseInt(port) || 80,
      cpu: parseInt(cpu) || 20,
      ram: parseInt(ram) || 128,
      status: 'running',
      created: 'Just now'
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 7, 17, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel fade-in" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '30px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Play style={{ color: 'var(--accent-cyan)' }} size={24} />
          Deploy New Container
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Service Name</label>
            <input 
              type="text" 
              placeholder="e.g. web-app-api"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Docker Image</label>
              <select 
                value={image}
                onChange={(e) => setImage(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="nginx:alpine">nginx:alpine (Web Server)</option>
                <option value="node:18-alpine">node:18-alpine (Backend Node.js)</option>
                <option value="redis:alpine">redis:alpine (In-Memory Key-Value)</option>
                <option value="postgres:alpine">postgres:alpine (Relational Database)</option>
                <option value="python:3.9-slim">python:3.9-slim (Python Microservice)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Container Port</label>
              <input 
                type="number" 
                placeholder="80"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>CPU Provision (Shares)</label>
              <select 
                value={cpu}
                onChange={(e) => setCpu(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="10">10% CPU Shares (Micro)</option>
                <option value="25">25% CPU Shares (Small)</option>
                <option value="50">50% CPU Shares (Medium)</option>
                <option value="100">100% CPU Shares (Compute Intensive)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>RAM Provision (MB)</label>
              <select 
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              >
                <option value="128">128 MB (Lightweight)</option>
                <option value="256">256 MB (Standard)</option>
                <option value="512">512 MB (Standard Plus)</option>
                <option value="1024">1024 MB (Enterprise DB)</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Environment Variables (Optional)</label>
            <textarea 
              placeholder="DATABASE_URL=postgres://...\nNODE_ENV=production"
              value={envVars}
              onChange={(e) => setEnvVars(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-card)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary" 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ flex: 2, justifyContent: 'center' }}
            >
              Deploy Container
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
