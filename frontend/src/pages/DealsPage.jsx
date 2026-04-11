import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DealsPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDeal, setNewDeal] = useState({
    buyer_name: '',
    buyer_email: '',
    property_name: '',
    property_type: 'apt',
    deal_value: '',
    source: 'web',
    stage: 'prospectando',
    notes: ''
  });

  const API_BASE = import.meta.env.VITE_API_BASE || 'https://claude-fo-api.onrender.com';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsRes, auditRes] = await Promise.all([
        fetch(`${API_BASE}/api/deals/metrics`),
        fetch(`${API_BASE}/api/deals/analyze`, { method: 'POST' })
      ]);
      
      if (metricsRes.ok) setMetrics(await metricsRes.json());
      if (auditRes.ok) setAudit(await auditRes.json());
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/deals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDeal,
          deal_value: parseFloat(newDeal.deal_value)
        })
      });
      if (res.ok) {
        setNewDeal({
          buyer_name: '',
          buyer_email: '',
          property_name: '',
          property_type: 'apt',
          deal_value: '',
          source: 'web',
          stage: 'prospectando',
          notes: ''
        });
        setShowForm(false);
        fetchData();
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Doral Pipeline Analyzer</h1>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Close Rate</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{metrics?.close_rate || 0}%</div>
              </div>
              <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Revenue</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>${(metrics?.total_revenue / 1000000).toFixed(1)}M</div>
              </div>
              <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Avg Ciclo</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{metrics?.avg_cycle_days}d</div>
              </div>
              <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Deals</div>
                <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{metrics?.total_deals}</div>
              </div>
            </div>

            {/* Conversión por Origen */}
            {metrics?.by_source && (
              <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h3>Conversión por Origen</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #eee' }}>Origen</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Leads</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Conv.</th>
                      <th style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.by_source.map((s) => (
                      <tr key={s.source}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{s.source}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{s.leads}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{s.conversions}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>{s.conversion_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Recomendaciones */}
            {audit?.recommendations && (
              <div style={{ background: '#fff9e6', border: '1px solid #ffd966', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
                <h3>Recomendaciones</h3>
                {audit.recommendations.map((rec, i) => (
                  <div key={i} style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: 'bold', color: '#d46a2a' }}>P{rec.priority}: {rec.action}</div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>{rec.detail}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Form */}
            <button 
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px',
                background: '#378ADD',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '1rem'
              }}
            >
              {showForm ? 'Cancelar' : 'Nuevo Deal'}
            </button>

            {showForm && (
              <form onSubmit={handleCreateDeal} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Buyer name"
                    value={newDeal.buyer_name}
                    onChange={(e) => setNewDeal({ ...newDeal, buyer_name: e.target.value })}
                    required
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newDeal.buyer_email}
                    onChange={(e) => setNewDeal({ ...newDeal, buyer_email: e.target.value })}
                    required
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Property"
                    value={newDeal.property_name}
                    onChange={(e) => setNewDeal({ ...newDeal, property_name: e.target.value })}
                    required
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <select value={newDeal.property_type} onChange={(e) => setNewDeal({ ...newDeal, property_type: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option>apt</option>
                    <option>casa</option>
                    <option>townhouse</option>
                    <option>lote</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Deal value"
                    value={newDeal.deal_value}
                    onChange={(e) => setNewDeal({ ...newDeal, deal_value: e.target.value })}
                    required
                    style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <select value={newDeal.source} onChange={(e) => setNewDeal({ ...newDeal, source: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="web">web</option>
                    <option value="anuncio">anuncio</option>
                    <option value="referral">referral</option>
                    <option value="llamada">llamada</option>
                  </select>
                  <select value={newDeal.stage} onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value })} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="prospectando">prospectando</option>
                    <option value="cualificado">cualificado</option>
                    <option value="propuesta">propuesta</option>
                    <option value="negociacion">negociacion</option>
                    <option value="cierre">cierre</option>
                  </select>
                </div>
                <textarea
                  placeholder="Notes"
                  value={newDeal.notes}
                  onChange={(e) => setNewDeal({ ...newDeal, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px', marginBottom: '12px' }}
                />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#378ADD',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Create Deal
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </>
  );
}
