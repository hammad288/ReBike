import React, { useState, useEffect } from 'react';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';
import { HiOutlineTrash } from 'react-icons/hi';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cart, setCart } = useCart();
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientToken, setClientToken] = useState('');
  const [instance, setInstance] = useState(null);

  const navigate = useNavigate();


  // 💰 Total price
  const totalPrice = () => {
    let total = 0;
    cart?.forEach(item => {
      total += Number(item.price) || 0;
    });
    return total.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
    });
  };

  // 🗑 Remove item
  const removeCartItem = (pid) => {
    const newCart = cart.filter(item => item._id !== pid);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Item removed');
  };

  // 🔑 GET TOKEN
  const getToken = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/braintree/token`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );


      if (data?.clientToken) {
        setClientToken(data.clientToken);
      }
    } catch (err) {
      console.log("TOKEN ERROR:", err);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      getToken();
    }
  }, [auth?.token]);


  // 💳 PAYMENT
  const handlePayment = async () => {
    try {
      if (!instance) {
        return toast.error("Payment UI not loaded ❌");
      }

      setLoading(true);

      const { nonce } = await instance.requestPaymentMethod();

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/braintree/payment`,
        {
          nonce,
          bikeIds: cart.map(item => item._id),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
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
        console.error("PAYMENT ERROR:", error);
        toast.error(error?.response?.data?.error || 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='container my-5'>
      <h3>Cart</h3>

      {cart?.map(p => (
        <div key={p._id} className='card my-3 p-3'>
          <h5>{p.brand} {p.model}</h5>
          <p>₹ {p.price}</p>
          <button onClick={() => removeCartItem(p._id)}>
            <HiOutlineTrash />
          </button>
        </div>
      ))}

      <h4>Total: {totalPrice()}</h4>

      {!auth?.token ? (
        <button onClick={() => navigate('/login')}>
          Login to Checkout
        </button>
      ) : (
        <>
          {clientToken ? (
            <DropIn
              options={{
                authorization: clientToken,
              }}
              onInstance={(inst) => setInstance(inst)}
              onError={(err) => console.log("DROPIN ERROR:", err)}
            />
          ) : (
            <p>Loading Payment Gateway...</p>
          )}

          <button
            className='btn btn-success mt-3'
            onClick={handlePayment}
            disabled={loading || !instance || !clientToken}
          >
            {loading ? 'Processing...' : 'Pay Now 💳'}
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;