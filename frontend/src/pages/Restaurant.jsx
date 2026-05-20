import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Restaurant = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showProcessing, setShowProcessing] = useState(false);

  const menuImages = ['re1.jpg', 're2.jpg', 're4.jpg', 're5.jpg', 're7.webp', 'rre3.jpg'];

  const defaultMenuItems = [
    { id: 1, item_name: 'Puri Bhaji', category: 'breakfast', price: 80, description: 'Crispy fried puris served with spicy potato bhaji', is_veg: true },
    { id: 2, item_name: 'Poha', category: 'breakfast', price: 50, description: 'Flattened rice tempered with mustard, curry leaves & peanuts', is_veg: true },
    { id: 3, item_name: 'Upma', category: 'breakfast', price: 60, description: 'Savory semolina porridge with vegetables & ghee', is_veg: true },
    { id: 4, item_name: 'Idli Sambhar', category: 'breakfast', price: 70, description: 'Steamed rice cakes served with lentil soup & chutney', is_veg: true },
    { id: 5, item_name: 'Veg Thali', category: 'meals', price: 180, description: 'Complete meal with dal, rice, roti, sabzi, salad & dessert', is_veg: true },
    { id: 6, item_name: 'Pulav', category: 'meals', price: 120, description: 'Fragrant basmati rice cooked with mixed vegetables & spices', is_veg: true },
    { id: 7, item_name: 'Chapati Bhaji', category: 'meals', price: 100, description: 'Whole wheat chapatis with seasonal vegetable curry', is_veg: true },
    { id: 8, item_name: 'Dal Khichdi', category: 'meals', price: 110, description: 'Comforting rice & lentil porridge tempered with ghee', is_veg: true },
    { id: 9, item_name: 'Masala Dosa', category: 'breakfast', price: 90, description: 'Crispy rice crepe filled with spiced potato filling', is_veg: true },
    { id: 10, item_name: 'Butter Milk', category: 'beverages', price: 30, description: 'Refreshing spiced buttermilk with cumin & mint', is_veg: true },
    { id: 11, item_name: 'Tea', category: 'beverages', price: 20, description: 'Aromatic Indian chai with ginger & cardamom', is_veg: true },
    { id: 12, item_name: 'Coffee', category: 'beverages', price: 30, description: 'Filter coffee brewed to perfection', is_veg: true },
    { id: 13, item_name: 'Shrikhand', category: 'special', price: 80, description: 'Creamy sweetened yogurt dessert with saffron & nuts', is_veg: true },
    { id: 14, item_name: 'Kheer', category: 'special', price: 60, description: 'Rice pudding slow-cooked with milk, cardamom & dry fruits', is_veg: true },
    { id: 15, item_name: 'Prasad Special', category: 'special', price: 50, description: 'Blessed temple prasad - sweet offering of the day', is_veg: true },
  ];

  useEffect(() => {
    api.get('/restaurant/menu').then(res => {
      const items = res.data.menu_items || [];
      if (items.length > 0) {
        setMenuItems(items);
        const cats = [...new Set(items.map(item => item.category))];
        setCategories(cats);
      } else {
        setMenuItems(defaultMenuItems);
        const cats = [...new Set(defaultMenuItems.map(item => item.category))];
        setCategories(cats);
      }
    }).catch(() => {
      setMenuItems(defaultMenuItems);
      const cats = [...new Set(defaultMenuItems.map(item => item.category))];
      setCategories(cats);
    });
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`${item.item_name} added to cart!`);
  };

  const changeQty = (index, delta) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].qty += delta;
      if (updated[index].qty <= 0) {
        updated.splice(index, 1);
      }
      return updated;
    });
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const selectPayment = (method) => {
    setPaymentMethod(method);
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setShowProcessing(true);
    try {
      const payload = {
        items: cart.map(item => ({ name: item.item_name, price: item.price, qty: item.qty })),
        payment_method: paymentMethod
      };
      const res = await api.post('/restaurant', payload);
      setMessage({ type: 'success', text: res.data.message || 'Order placed successfully!' });
      setCart([]);
      setShowCart(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Order failed' });
    } finally {
      setTimeout(() => setShowProcessing(false), 2000);
    }
  };

  const showToast = (text) => {
    setMessage({ type: 'success', text });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  };

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const categoryIcons = {
    'breakfast': 'fa-coffee',
    'meals': 'fa-utensils',
    'beverages': 'fa-mug-hot',
    'special': 'fa-star'
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
      minHeight: '100vh'
    }}>
      {/* Toast */}
      {message.text && (
        <div style={{
          position: 'fixed', top: 100, right: 20, zIndex: 9999,
          background: 'white', borderRadius: 12, padding: '15px 20px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex',
          alignItems: 'center', gap: 12,
          borderLeft: `4px solid ${message.type === 'success' ? '#22c55e' : '#ef4444'}`,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <i className={`fas fa-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'}`}
            style={{ color: message.type === 'success' ? '#22c55e' : '#ef4444', fontSize: '1.3rem' }}></i>
          <span>{message.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
        padding: '80px 0 120px', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'url(/images/temple/icon symbol.webp) no-repeat center center',
          backgroundSize: 250, opacity: 0.1, animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            color: '#ffd700', fontSize: '3rem', fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)', marginBottom: 15,
            animation: 'slideInDown 0.8s ease-out'
          }}><i className="fas fa-utensils" style={{ marginRight: 20 }}></i>Temple Restaurant</h1>
          <p style={{
            color: 'rgba(255,255,255,0.95)', fontSize: '1.2rem',
            animation: 'slideInUp 0.8s ease-out'
          }}>Authentic vegetarian meals & prasad prepared with devotion</p>
        </div>
        <div style={{
          position: 'absolute', bottom: -50, left: 0, right: 0,
          height: 100, background: 'linear-gradient(to top, #fdf2f8, transparent)'
        }}></div>
      </div>

      <div style={{ position: 'relative', zIndex: 10, marginTop: -50, marginBottom: 50, padding: '0 20px' }}>
        {/* Category Tabs */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 40, flexWrap: 'wrap'
        }}>
          <button onClick={() => setActiveCategory('all')}
            style={{
              background: activeCategory === 'all' ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : 'white',
              border: '2px solid transparent', color: activeCategory === 'all' ? 'white' : '#be185d',
              padding: '12px 28px', borderRadius: 50, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== 'all') {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
            }}
          >
            <i className="fas fa-utensils" style={{ marginRight: 8 }}></i>All Items
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : 'white',
                border: '2px solid transparent', color: activeCategory === cat ? 'white' : '#be185d',
                padding: '12px 28px', borderRadius: 50, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}
            >
              <i className={`fas ${categoryIcons[cat] || 'fa-utensils'}`} style={{ marginRight: 8 }}></i>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 30
          }}>
            {filteredItems.map((item, index) => {
              const img = menuImages[index % menuImages.length];
              const isVeg = item.is_veg !== false;
              return (
                <div key={item.id} style={{
                  background: 'white', borderRadius: 20, overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 60px rgba(236, 72, 153, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
                }}
                >
                  <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
                    <img src={`/images/restro/${img}`} alt={item.item_name} style={{
                      width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.15)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      width: '100%', height: '100%', display: 'none', alignItems: 'center',
                      justifyContent: 'center', background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
                    }}>
                      <i className="fas fa-utensils" style={{ fontSize: '4rem', color: 'rgba(236, 72, 153, 0.3)' }}></i>
                    </div>
                  <div style={{
                    position: 'absolute', top: 15, left: 15, width: 28, height: 28,
                    borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 'bold',
                    background: isVeg ? '#22c55e' : '#ef4444',
                    color: 'white', border: `2px solid ${isVeg ? '#16a34a' : '#dc2626'}`
                  }}>
                    <i className={`fas fa-${isVeg ? 'leaf' : 'fire'}`}></i>
                  </div>
                  <div style={{
                    position: 'absolute', top: 15, right: 15,
                    background: 'rgba(255,255,255,0.95)', padding: '6px 14px',
                    borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                    color: '#be185d', textTransform: 'uppercase'
                  }}>{item.category}</div>
                </div>
                <div style={{ padding: 25 }}>
                  <h3 style={{ color: '#1e3c72', fontSize: '1.3rem', fontWeight: 700, marginBottom: 10 }}>
                    {item.item_name}
                  </h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 15, minHeight: 45 }}>
                    {item.description || 'Delicious vegetarian dish prepared with love and devotion'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, borderTop: '1px solid #eee' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ec4899' }}>
                      <i className="fas fa-rupee-sign" style={{ fontSize: '1rem' }}></i> {item.price}
                      <span style={{ fontSize: '0.85rem', color: '#999', fontWeight: 400 }}>/ person</span>
                    </div>
                    <button onClick={() => addToCart(item)}
                      style={{
                        background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                        color: 'white', border: 'none', padding: '10px 22px',
                        borderRadius: 25, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 8,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 8px 25px rgba(236, 72, 153, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fas fa-plus"></i> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{
              width: 120, height: 120, margin: '0 auto 30px',
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <i className="fas fa-utensils" style={{ fontSize: '3rem', color: '#ec4899' }}></i>
            </div>
            <h3 style={{ color: '#1e3c72', fontSize: '1.8rem', marginBottom: 15 }}>Menu Coming Soon</h3>
            <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto' }}>
              We're preparing our menu with delicious vegetarian meals and prasad. Please check back later!
            </p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <div style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
        <button onClick={() => setShowCart(true)}
          style={{
            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            color: 'white', border: 'none', width: 65, height: 65,
            borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(236, 72, 153, 0.5)',
            transition: 'all 0.3s ease', position: 'relative'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <i className="fas fa-shopping-cart"></i>
          {totalItems > 0 && (
            <div style={{
              position: 'absolute', top: -5, right: -5,
              background: '#ffd700', color: '#1e3c72',
              width: 28, height: 28, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700
            }}>{totalItems}</div>
          )}
        </button>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowCart(false)}>
          <div style={{
            background: 'white', borderRadius: 20, border: 'none',
            width: '90%', maxWidth: 500, maxHeight: '80vh', overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
              color: 'white', borderBottom: 'none',
              borderTopLeftRadius: 20, borderTopRightRadius: 20,
              padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h5 style={{ margin: 0, fontWeight: 700 }}>
                <i className="fas fa-shopping-basket" style={{ marginRight: 10 }}></i>Your Cart
              </h5>
              <button onClick={() => setShowCart(false)} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
                width: 35, height: 35, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem'
              }}>×</button>
            </div>
            <div style={{ padding: 25 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: '#ddd', marginBottom: 20, display: 'block' }}></i>
                  <h4 style={{ color: '#666', marginBottom: 10 }}>Your cart is empty</h4>
                  <p style={{ color: '#999' }}>Add some delicious items!</p>
                </div>
              ) : (
                <>
                  {cart.map((item, index) => (
                    <div key={item.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '15px 0', borderBottom: '1px solid #eee'
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, color: '#1e3c72' }}>{item.item_name}</div>
                        <div style={{ color: '#ec4899', fontWeight: 600 }}>
                          <i className="fas fa-rupee-sign" style={{ fontSize: '0.8rem' }}></i> {item.price} x {item.qty}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button onClick={() => changeQty(index, -1)} style={{
                          width: 32, height: 32, borderRadius: '50%', border: '2px solid #ec4899',
                          background: 'white', color: '#ec4899', fontWeight: 'bold',
                          cursor: 'pointer', transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#ec4899'; e.target.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#ec4899'; }}
                        >-</button>
                        <span style={{ fontWeight: 600, minWidth: 30, textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => changeQty(index, 1)} style={{
                          width: 32, height: 32, borderRadius: '50%', border: '2px solid #ec4899',
                          background: 'white', color: '#ec4899', fontWeight: 'bold',
                          cursor: 'pointer', transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.background = '#ec4899'; e.target.style.color = 'white'; }}
                        onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.color = '#ec4899'; }}
                        >+</button>
                      </div>
                    </div>
                  ))}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '20px 0', borderTop: '2px solid #eee', marginTop: 10
                  }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e3c72' }}>Total Amount</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ec4899' }}>
                      <i className="fas fa-rupee-sign" style={{ fontSize: '1rem' }}></i> {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: 15, padding: 20, marginTop: 15 }}>
                    <div style={{ fontWeight: 600, color: '#1e3c72', marginBottom: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <i className="fas fa-credit-card" style={{ color: '#ec4899' }}></i> Select Payment Method
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {[
                        { method: 'UPI', icon: 'fa-mobile-alt', color: '#22c55e' },
                        { method: 'Card', icon: 'fa-credit-card', color: '#3b82f6' },
                        { method: 'Cash', icon: 'fa-money-bill-wave', color: '#f59e0b' }
                      ].map(pm => (
                        <div key={pm.method}
                          onClick={() => selectPayment(pm.method)}
                          style={{
                            flex: 1, minWidth: 100, padding: '15px 10px',
                            border: `2px solid ${paymentMethod === pm.method ? '#ec4899' : '#e2e8f0'}`,
                            borderRadius: 12, background: paymentMethod === pm.method
                              ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(244, 63, 94, 0.1) 100%)'
                              : 'white', cursor: 'pointer', textAlign: 'center',
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#ec4899';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = paymentMethod === pm.method ? '#ec4899' : '#e2e8f0';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <i className={`fas ${pm.icon}`} style={{ fontSize: '1.8rem', marginBottom: 8, display: 'block', color: pm.color }}></i>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: paymentMethod === pm.method ? '#ec4899' : '#64748b' }}>{pm.method}</span>
                        </div>
                      ))}
                    </div>
                    {paymentMethod === 'UPI' && (
                      <div style={{ textAlign: 'center', marginTop: 20, padding: 20, background: 'white', borderRadius: 15, border: '2px dashed #22c55e', animation: 'fadeInUp 0.5s ease' }}>
                        <div className="scan-animation" style={{ position: 'relative' }}>
                          <div style={{ width: 180, height: 180, margin: '0 auto 15px', borderRadius: 10, overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.1)' }}>
                            <img src="/images/pay/qr.png" alt="Payment QR" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/images/pay/QR.jpeg';
                              e.target.onerror = () => { e.target.style.display = 'none'; };
                            }} />
                          </div>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e', marginBottom: 10 }}>Amount: ₹{totalPrice.toLocaleString()}</div>
                        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Scan QR code to pay via any UPI app</p>
                      </div>
                    )}
                  </div>
                  <button onClick={placeOrder}
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
                      color: 'white', border: 'none', width: '100%', padding: 15,
                      borderRadius: 12, fontSize: '1.1rem', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.3s ease', marginTop: 15
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-3px)';
                      e.target.style.boxShadow = '0 10px 30px rgba(236, 72, 153, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-lock" style={{ marginRight: 10 }}></i>
                    Pay ₹{totalPrice.toLocaleString()} & Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Processing Overlay */}
      {showProcessing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
        }}>
          <div style={{ textAlign: 'center', color: 'white' }}>
            <div style={{
              width: 80, height: 80, border: '5px solid rgba(255,255,255,0.3)',
              borderTopColor: '#22c55e', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 30px'
            }}></div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: 10, animation: 'pulse 1.5s infinite' }}>Processing Payment...</div>
            <div style={{ color: 'rgba(255,255,255,0.7)' }}>Please wait while we confirm your payment</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #be185d 0%, #ec4899 100%)',
        color: 'white', padding: 50, textAlign: 'center', position: 'relative', marginTop: 50
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}></div>
        <img src="/images/temple/icon-symbol.webp" alt="Temple" style={{
          width: 60, height: 60, marginBottom: 20, borderRadius: '50%',
          transition: 'transform 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'rotate(360deg) scale(1.1)'}
        onMouseLeave={(e) => e.target.style.transform = 'rotate(0deg) scale(1)'}
        />
        <p style={{ color: '#ffd700', fontWeight: 700, fontSize: '1.3rem', marginBottom: 15 }}>ॐ नमः शिवाय</p>
        <p style={{ margin: 0 }}>© 2024 Shri Trimbakeshwar Temple. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes scanLine {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Restaurant;
