import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { RxCross2 } from 'react-icons/rx';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const validateEmail = async (email, stripe) => {
  const updateResult = await stripe.updateEmail(email);
  const isValid = updateResult.type !== "error";
  return { isValid, message: !isValid ? updateResult.error.message : null };
};

const EmailInput = ({ email, setEmail, error, setError }) => {
  const stripe = useStripe();

  const handleBlur = async () => {
    if (!email) return;
    const { isValid, message } = await validateEmail(email, stripe);
    if (!isValid) setError(message);
  };

  const handleChange = (e) => {
    setError(null);
    setEmail(e.target.value);
  };

  return (
    <>
      <label>
        Email
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="you@example.com"
        />
      </label>
      {error && <div id="email-errors">{error}</div>}
    </>
  );
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { isValid, message } = await validateEmail(email, stripe);
    if (!isValid) {
      setEmailError(message);
      setMessage(message);
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Optionally specify a return_url
        // return_url: 'https://your-website.com/order/complete',
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Payment processing...");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <EmailInput
        email={email}
        setEmail={setEmail}
        error={emailError}
        setError={setEmailError}
      />
      <h4>Payment</h4>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe} id="submit">
        {isLoading ? "Processing..." : "Pay now"}
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

const StripeCheckoutModal = ({ isOpen, onClose }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/create-checkout-session', { method: 'POST' })
        .then((response) => response.json())
        .then((json) => setClientSecret(json.checkoutSessionClientSecret));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative p-6">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <RxCross2 />
        </button>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        ) : (
          <div className="text-center">Loading payment form…</div>
        )}
      </div>
    </div>
  );
};

StripeCheckoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StripeCheckoutModal; 