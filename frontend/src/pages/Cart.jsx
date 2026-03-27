import React, { useState, useEffect } from 'react';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import { HiOutlineTrash } from 'react-icons/hi';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { PiCurrencyInrFill } from 'react-icons/pi';
import { toast } from 'react-toastify';
import '../styles/cart.css';

const Cart = () => {
  // useCart returns [cart, setCart] array
  const [cart, setCart] = useCart();
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState(null);
  const navigate = useNavigate();

  // ── Total Price ──
  const totalPrice = () => {
    let total = 0;
    cart?.forEach(item => {
      total += Number(item.price) || 0;
    });
    return total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  // ── Remove Item ──
  const removeCartItem = (pid) => {
    const newCart = cart.filter(item => item._id !== pid);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.info('Item removed from cart');
  };

  // ── Get Braintree Token ──
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/braintree/token`,
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      if (data?.clientToken) setClientToken(data.clientToken);
    } catch (err) {
      console.log('TOKEN ERROR:', err);
    }
  };

  useEffect(() => {
    if (auth?.token) getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.token]);

  // ── Handle Payment ──
  const handlePayment = async () => {
    try {
      if (!instance) return toast.error('Payment UI not loaded ❌');
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/braintree/payment`,
        { nonce, bikeIds: cart.map(item => item._id) },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      if (data.success) {
        localStorage.removeItem('cart');
        setCart([]);
        toast.success('Payment Successful ✅');
        navigate('/order-confirmation');
      } else {
        toast.error(data.error || 'Payment Failed');
      }
    } catch (error) {
      if (error?.name === 'DropinError') {
        toast.warning('Please complete your payment details 💳');
      } else {
        toast.error(error?.response?.data?.error || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Empty Cart View ──
  if (!cart?.length) {
    return (
      <div className="cart-empty-wrapper">
        <div className="cart-empty-box">
          <div className="cart-empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any bikes yet.</p>
          <button className="cart-browse-btn" onClick={() => navigate('/bikes')}>
            Browse Bikes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      {/* ── Header ── */}
      <div className="cart-header">
        <h2>
          <AiOutlineShoppingCart size={28} style={{ marginRight: 8 }} />
          Your Cart
          <span className="cart-count-badge">{cart.length} item{cart.length > 1 ? 's' : ''}</span>
        </h2>
      </div>

      <div className="cart-layout">

        {/* ── Left: Cart Items ── */}
        <div className="cart-items-section">
          {cart.map(p => (
            <div key={p._id} className="cart-item-card">
              {/* Bike Image */}
              <div className="cart-item-img">
                {p.images && p.images[0]
                  ? <img src={p.images[0]} alt={p.model} />
                  : <span className="cart-no-img">🏍️</span>
                }
              </div>

              {/* Bike Info */}
              <div className="cart-item-info">
                <h5>{p.brand} {p.model}</h5>
                <div className="cart-item-meta">
                  {p.year && <span>Year: <strong>{p.year}</strong></span>}
                  {p.condition && <span>Condition: <strong>{p.condition}</strong></span>}
                  {p.kmDriven && <span>KM: <strong>{p.kmDriven?.toLocaleString()}</strong></span>}
                  {p.location && <span>📍 {p.location}</span>}
                </div>
                <div className="cart-item-price">
                  <PiCurrencyInrFill size={18} />
                  {Number(p.price)?.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Remove Button */}
              <button className="cart-remove-btn" onClick={() => removeCartItem(p._id)} title="Remove">
                <HiOutlineTrash size={20} />
              </button>
            </div>
          ))}
        </div>

        {/* ── Right: Order Summary + Payment ── */}
        <div className="cart-summary-section">

          {/* Order Summary */}
          <div className="cart-summary-card">
            <h4 className="cart-summary-title">Order Summary</h4>
            <div className="cart-summary-rows">
              {cart.map(p => (
                <div key={p._id} className="cart-summary-row">
                  <span>{p.brand} {p.model}</span>
                  <span><PiCurrencyInrFill /> {Number(p.price)?.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="cart-summary-divider" />
            <div className="cart-summary-total">
              <span>Total</span>
              <span className="cart-total-amount">{totalPrice()}</span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="cart-payment-card">
            <h4 className="cart-payment-title">💳 Payment</h4>

            {!auth?.token ? (
              <div className="cart-login-prompt">
                <p>Please login to proceed with payment.</p>
                <button className="cart-login-btn" onClick={() => navigate('/login')}>
                  Login to Checkout
                </button>
              </div>
            ) : (
              <>
                {clientToken ? (
                  <DropIn
                    options={{ authorization: clientToken }}
                    onInstance={(inst) => setInstance(inst)}
                    onError={(err) => console.log('DROPIN ERROR:', err)}
                  />
                ) : (
                  <div className="cart-gateway-loading">
                    <div className="cart-spinner" />
                    <p>Loading Payment Gateway...</p>
                  </div>
                )}

                <button
                  className="cart-pay-btn"
                  onClick={handlePayment}
                  disabled={loading || !instance || !clientToken}
                >
                  {loading ? (
                    <><span className="cart-spinner-sm" /> Processing...</>
                  ) : (
                    '🔒 Pay Now ' + totalPrice()
                  )}
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;