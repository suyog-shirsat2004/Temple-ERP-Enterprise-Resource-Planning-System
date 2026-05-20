import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const tabs = [
  { key: 'all', label: 'All Receipts', icon: 'fa-receipt' },
  { key: 'pass', label: 'Darshan Pass', icon: 'fa-ticket-alt' },
  { key: 'donation', label: 'Donations', icon: 'fa-donate' },
  { key: 'order', label: 'Restaurant', icon: 'fa-utensils' },
  { key: 'booking', label: 'Room Booking', icon: 'fa-hotel' },
];

const typeConfig = {
  pass: { bg: '#e0e7ff', color: '#3730a3', gradient: 'linear-gradient(135deg, #3730a3 0%, #6366f1 100%)', icon: 'fa-ticket-alt', label: 'Darshan Pass', lightBg: '#eef2ff' },
  donation: { bg: '#d1fae5', color: '#065f46', gradient: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)', icon: 'fa-donate', label: 'Donation', lightBg: '#ecfdf5' },
  order: { bg: '#fce7f3', color: '#9d174d', gradient: 'linear-gradient(135deg, #9d174d 0%, #ec4899 100%)', icon: 'fa-utensils', label: 'Restaurant Order', lightBg: '#fdf2f8' },
  booking: { bg: '#fef3c7', color: '#92400e', gradient: 'linear-gradient(135deg, #92400e 0%, #f59e0b 100%)', icon: 'fa-hotel', label: 'Room Booking', lightBg: '#fffbeb' },
};

const PassHistory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [passes, setPasses] = useState([]);
  const [donations, setDonations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailItem, setDetailItem] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    const [passRes, donRes, ordRes, bookRes] = await Promise.allSettled([
      api.get('/passes'),
      api.get('/donations'),
      api.get('/restaurant'),
      api.get('/bookings'),
    ]);
    if (passRes.status === 'fulfilled') setPasses(passRes.value.data.passes || []);
    if (donRes.status === 'fulfilled') setDonations(donRes.value.data.donations || []);
    if (ordRes.status === 'fulfilled') setOrders(ordRes.value.data.orders || []);
    if (bookRes.status === 'fulfilled') setBookings(bookRes.value.data.bookings || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const allItems = [
    ...passes.map(p => ({ ...p, _type: 'pass', _id: p.id || p._id, _date: p.visit_date || p.created_at, _title: p.devotee_name || p.name, _amount: p.total_amount, _status: p.status, _ref: p.confirmation_code || p.pass_id })),
    ...donations.map(d => ({ ...d, _type: 'donation', _id: d._id, _date: d.donation_date || d.created_at, _title: d.name || 'Donation', _amount: d.amount, _status: d.payment_status, _ref: d.receipt_no })),
    ...orders.map(o => ({ ...o, _type: 'order', _id: o._id, _date: o.order_date || o.created_at, _title: o.name || 'Order', _amount: o.total_amount, _status: o.status, _ref: o.order_id })),
    ...bookings.map(b => ({ ...b, _type: 'booking', _id: b._id, _date: b.check_in || b.created_at, _title: b.guest_name || 'Booking', _amount: b.total_amount, _status: b.booking_status, _ref: b.booking_id })),
  ].sort((a, b) => new Date(b._date || 0) - new Date(a._date || 0));

  const filteredItems = activeTab === 'all' ? allItems : allItems.filter(i => i._type === activeTab);

  const getStatusBadge = (item) => {
    const s = (item._status || '').toLowerCase();
    if (['approved', 'active', 'confirmed', 'completed', 'paid', 'success'].includes(s))
      return { bg: '#d1fae5', color: '#065f46', label: s.charAt(0).toUpperCase() + s.slice(1) };
    if (['pending'].includes(s))
      return { bg: '#fef3c7', color: '#92400e', label: 'Pending' };
    return { bg: '#fee2e2', color: '#991b1b', label: s.charAt(0).toUpperCase() + s.slice(1) };
  };

  const handlePrint = (item) => {
    const win = window.open('', '_blank');
    const tc = typeConfig[item._type];
    win.document.write(`
      <html><head><title>Receipt - ${item._ref || item._id}</title>
      <style>
        body { font-family: 'Courier New', monospace; padding: 40px; max-width: 600px; margin: auto; }
        .header { text-align: center; border-bottom: 2px dashed ${tc.color}; padding-bottom: 20px; margin-bottom: 20px; }
        .header h1 { margin: 0; font-size: 24px; color: ${tc.color}; }
        .header p { margin: 4px 0; color: #666; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dotted #ddd; }
        .label { color: #666; }
        .value { font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed ${tc.color}; font-size: 12px; color: #666; }
        .items-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .items-table th { padding: 8px; text-align: left; border-bottom: 2px solid ${tc.color}; background: ${tc.lightBg}; }
        .items-table td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <h1>Shri Trimbakeshwar Temple</h1>
        <p>Trimbakeshwar, Nashik, Maharashtra - 422212</p>
        <p style="margin-top:8px;font-size:18px;font-weight:bold;color:${tc.color}">${tc.label} Receipt</p>
      </div>
      <div class="row"><span class="label">Receipt No</span><span class="value">${item._ref || item._id}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${item._date ? new Date(item._date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span></div>
      ${item._type === 'pass' ? `
        <div class="row"><span class="label">Devotee</span><span class="value">${item.devotee_name || 'N/A'}</span></div>
        <div class="row"><span class="label">Pass Type</span><span class="value">${item.pass_type || 'N/A'}</span></div>
        <div class="row"><span class="label">Visit Date</span><span class="value">${item.visit_date ? new Date(item.visit_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span></div>
        <div class="row"><span class="label">Time Slot</span><span class="value">${item.visit_time || 'N/A'}</span></div>
        <div class="row"><span class="label">Persons</span><span class="value">${item.no_of_persons || 'N/A'}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${item.phone || 'N/A'}</span></div>
        ${item.aadhar_number ? `<div class="row"><span class="label">Aadhar</span><span class="value">${item.aadhar_number}</span></div>` : ''}
        <div class="row"><span class="label">Transaction ID</span><span class="value">${item.transaction_id || 'N/A'}</span></div>
      ` : item._type === 'donation' ? `
        <div class="row"><span class="label">Donor</span><span class="value">${item.name || 'Anonymous'}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${item.email || 'N/A'}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${item.phone || 'N/A'}</span></div>
        <div class="row"><span class="label">Type</span><span class="value">${item.donation_type || 'General Donation'}</span></div>
        ${item.notes ? `<div class="row"><span class="label">Message</span><span class="value">${item.notes}</span></div>` : ''}
        <div class="row"><span class="label">Donation Date</span><span class="value">${item.donation_date ? new Date(item.donation_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span></div>
      ` : item._type === 'order' ? `
        <div class="row"><span class="label">Customer</span><span class="value">${item.name || 'N/A'}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${item.phone || 'N/A'}</span></div>
        <div class="row"><span class="label">Order Time</span><span class="value">${item.order_time || 'N/A'}</span></div>
        ${item.items && item.items.length ? `
          <table class="items-table"><tr><th>Item</th><th>Qty</th><th>Price</th></tr>
          ${item.items.map(it => `<tr><td>${it.name || it.item_name || 'Item'}</td><td>${it.qty || 1}</td><td>₹${it.price || 0}</td></tr>`).join('')}
          </table>
        ` : ''}
      ` : `
        <div class="row"><span class="label">Guest</span><span class="value">${item.guest_name || 'N/A'}</span></div>
        <div class="row"><span class="label">Phone</span><span class="value">${item.phone || 'N/A'}</span></div>
        <div class="row"><span class="label">Email</span><span class="value">${item.email || 'N/A'}</span></div>
        <div class="row"><span class="label">Room</span><span class="value">${item.room?.room_name || item.room_name || 'N/A'}</span></div>
        <div class="row"><span class="label">Check-in</span><span class="value">${item.check_in ? new Date(item.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span></div>
        <div class="row"><span class="label">Check-out</span><span class="value">${item.check_out ? new Date(item.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</span></div>
        <div class="row"><span class="label">Guests</span><span class="value">${item.no_of_guests || 'N/A'}</span></div>
      `}
      <div class="row" style="font-size:18px;font-weight:bold;border-top:2px solid ${tc.color};padding-top:12px;margin-top:8px">
        <span class="label">Total Amount</span><span class="value">₹${item._amount || 0}</span>
      </div>
      <div class="row"><span class="label">Payment Method</span><span class="value">${item.payment_method || 'N/A'}</span></div>
      <div class="row"><span class="label">Payment Status</span><span class="value">${item.payment_status || item._status || 'N/A'}</span></div>
      <div class="footer">
        <p>Thank you for your visit. Blessed be!</p>
        <p>ॐ नमः शिवाय</p>
        <p style="margin-top:16px;font-size:10px">This is a computer-generated receipt.</p>
      </div>
      <script>window.onload = function() { window.print(); }</script>
    </body></html>`);
    win.document.close();
  };

  const DetailRow = ({ label, value, fullWidth }) => (
    <div style={{
      display: 'flex', gap: 8,
      padding: '10px 0', borderBottom: '1px solid #f1f5f9',
      gridColumn: fullWidth ? '1 / -1' : undefined
    }}>
      <div style={{ minWidth: 120, fontSize: 13, color: '#64748b', fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', wordBreak: 'break-word' }}>{value || <span style={{ color: '#94a3b8' }}>N/A</span>}</div>
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <i className="fa fa-spinner fa-spin" style={{ fontSize: 32, color: '#667eea' }}></i>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#f8fafc', minHeight: '100vh', paddingTop: 90 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ color: '#1e3c72', fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fas fa-receipt" style={{ color: '#667eea' }}></i>
            My Receipts
          </h1>
          <div style={{ fontSize: 14, color: '#64748b' }}>
            {allItems.length} record{allItems.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
              background: activeTab === tab.key ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff',
              color: activeTab === tab.key ? '#fff' : '#475569',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(102,126,234,0.4)' : '0 1px 3px rgba(0,0,0,0.08)',
              transition: 'all 0.2s ease'
            }}>
              <i className={`fas ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, padding: 60, textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <i className="fas fa-receipt" style={{ fontSize: 64, color: '#dee2e6', marginBottom: 16, display: 'block' }}></i>
            <h3 style={{ color: '#6c757d', marginBottom: 8 }}>No Records Found</h3>
            <p style={{ color: '#adb5bd', marginBottom: 20 }}>You haven't made any {activeTab !== 'all' ? activeTab : ''} transactions yet.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/passes/new" style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>Book Darshan Pass</Link>
              <Link to="/donations" style={{ padding: '10px 20px', borderRadius: 10, background: '#10b981', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>Make a Donation</Link>
              <Link to="/restaurant" style={{ padding: '10px 20px', borderRadius: 10, background: '#ec4899', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>Order Food</Link>
              <Link to="/bookings" style={{ padding: '10px 20px', borderRadius: 10, background: '#f59e0b', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 13 }}>Book Room</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredItems.map((item) => {
              const tc = typeConfig[item._type];
              const badge = getStatusBadge(item);
              return (
                <div key={item._id} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderLeft: `4px solid ${tc.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: tc.bg, color: tc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        <i className={`fas ${tc.icon}`}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#64748b', marginBottom: 2 }}>{tc.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{item._title || 'N/A'}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 12, padding: '4px 12px', borderRadius: 12, fontWeight: 600, background: badge.bg, color: badge.color }}>{badge.label}</span>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Receipt No</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b', fontFamily: "'Courier New', monospace" }}>{item._ref || 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Date</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1e293b' }}>{item._date ? new Date(item._date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Amount</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>₹{item._amount || 0}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 2 }}>Payment</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: '#475569' }}>{item.payment_method || 'N/A'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                    <button onClick={() => setDetailItem(item)} style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      background: tc.gradient, color: '#fff', display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }}
                    >
                      <i className="fas fa-eye"></i> View Details
                    </button>

                    <button onClick={() => handlePrint(item)} style={{
                      padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                      background: '#1e293b', color: '#fff', display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => { e.target.style.background = '#334155'; e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.target.style.background = '#1e293b'; e.target.style.transform = 'translateY(0)'; }}
                    >
                      <i className="fas fa-print"></i> Print Receipt
                    </button>

                    {item._type === 'pass' && (item._status === 'approved' || item._status === 'active') && (
                      <a href={`/passes/${item.pass_id}/print`} target="_blank" style={{
                        padding: '8px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600,
                        background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        <i className="fas fa-ticket-alt"></i> Print Pass
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && (() => {
        const tc = typeConfig[detailItem._type];
        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
          }} onClick={() => setDetailItem(null)}>
            <div style={{
              background: '#fff', borderRadius: 24, maxWidth: 650, width: '100%',
              maxHeight: '85vh', overflow: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease'
            }} onClick={e => e.stopPropagation()}>
              <div style={{
                background: tc.gradient, padding: '28px 32px', position: 'relative',
                borderRadius: '24px 24px 0 0'
              }}>
                <button onClick={() => setDetailItem(null)} style={{
                  position: 'absolute', top: 16, right: 16,
                  background: 'rgba(255,255,255,0.2)', border: 'none', width: 36, height: 36,
                  borderRadius: '50%', cursor: 'pointer', color: '#fff', fontSize: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>✕</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#fff' }}>
                    <i className={`fas ${tc.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>{tc.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>{detailItem._title || 'N/A'}</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', bottom: 16, right: 28, fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'Courier New', monospace" }}>#{detailItem._ref || detailItem._id}</div>
              </div>

              <div style={{ padding: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-info-circle" style={{ color: tc.color }}></i>
                  Receipt Information
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                  <DetailRow label="Receipt No" value={detailItem._ref} fullWidth />
                  <DetailRow label="Date" value={detailItem._date ? new Date(detailItem._date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'} fullWidth />

                  {detailItem._type === 'pass' && <>
                    <DetailRow label="Devotee Name" value={detailItem.devotee_name} />
                    <DetailRow label="Pass Type" value={detailItem.pass_type} />
                    <DetailRow label="Visit Date" value={detailItem.visit_date ? new Date(detailItem.visit_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} />
                    <DetailRow label="Time Slot" value={detailItem.visit_time} />
                    <DetailRow label="No. of Persons" value={detailItem.no_of_persons} />
                    <DetailRow label="Phone" value={detailItem.phone} />
                    <DetailRow label="Aadhar Number" value={detailItem.aadhar_number} />
                    <DetailRow label="Transaction ID" value={detailItem.transaction_id} />
                    {detailItem.aadhar_card && (
                      <DetailRow label="Aadhar Card" value={<a href={`/uploads/passes/${detailItem.aadhar_card}`} target="_blank" style={{ color: tc.color, fontWeight: 600 }}>View Document</a>} />
                    )}
                  </>}

                  {detailItem._type === 'donation' && <>
                    <DetailRow label="Donor Name" value={detailItem.name} />
                    <DetailRow label="Email" value={detailItem.email} />
                    <DetailRow label="Phone" value={detailItem.phone} />
                    <DetailRow label="Donation Type" value={detailItem.donation_type} />
                    <DetailRow label="Donation Date" value={detailItem.donation_date ? new Date(detailItem.donation_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} />
                    <DetailRow label="Message" value={detailItem.notes} />
                  </>}

                  {detailItem._type === 'order' && <>
                    <DetailRow label="Customer Name" value={detailItem.name} />
                    <DetailRow label="Phone" value={detailItem.phone} />
                    <DetailRow label="Order Time" value={detailItem.order_time} />
                    <DetailRow label="Order Date" value={detailItem.order_date ? new Date(detailItem.order_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} />
                    {detailItem.items && detailItem.items.length > 0 && (
                      <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
                        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Order Items</div>
                        <div style={{ background: '#f8fafc', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr style={{ background: tc.lightBg, borderBottom: `2px solid ${tc.color}` }}>
                                <th style={{ padding: '10px 14px', fontSize: 12, textAlign: 'left', fontWeight: 600, color: tc.color }}>Item</th>
                                <th style={{ padding: '10px 14px', fontSize: 12, textAlign: 'center', fontWeight: 600, color: tc.color }}>Qty</th>
                                <th style={{ padding: '10px 14px', fontSize: 12, textAlign: 'right', fontWeight: 600, color: tc.color }}>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {detailItem.items.map((it, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 500, color: '#1e293b' }}>{it.name || it.item_name || 'Item'}</td>
                                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'center', color: '#475569' }}>{it.qty || 1}</td>
                                  <td style={{ padding: '10px 14px', fontSize: 13, textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>₹{it.price || 0}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>}

                  {detailItem._type === 'booking' && <>
                    <DetailRow label="Guest Name" value={detailItem.guest_name} />
                    <DetailRow label="Phone" value={detailItem.phone} />
                    <DetailRow label="Email" value={detailItem.email} />
                    <DetailRow label="Room" value={detailItem.room?.room_name || detailItem.room_name} />
                    <DetailRow label="Room Type" value={detailItem.room?.room_type || detailItem.room_type} />
                    <DetailRow label="Check-in" value={detailItem.check_in ? new Date(detailItem.check_in).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} />
                    <DetailRow label="Check-out" value={detailItem.check_out ? new Date(detailItem.check_out).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'} />
                    <DetailRow label="No. of Guests" value={detailItem.no_of_guests} />
                    <DetailRow label="Room Number" value={detailItem.room?.room_number} />
                  </>}
                </div>

                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '2px dashed #e2e8f0' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div style={{ background: tc.lightBg, borderRadius: 12, padding: 16, border: `1px solid ${tc.bg}` }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Total Amount</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: tc.color }}>₹{detailItem._amount || 0}</div>
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Payment Method</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>{detailItem.payment_method || 'N/A'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
                    <button onClick={() => { setDetailItem(null); handlePrint(detailItem); }} style={{
                      flex: 1, padding: '12px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      background: tc.gradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s ease', minWidth: 140
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.9'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                    >
                      <i className="fas fa-print"></i> Print Receipt
                    </button>
                    <button onClick={() => setDetailItem(null)} style={{
                      padding: '12px 20px', borderRadius: 12, border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      background: '#fff', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.2s ease', minWidth: 120
                    }}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default PassHistory;
