import React, { useState } from 'react';

// Shared Tailwind CSS classes
const primaryButtonClasses = 'mt-6 bg-blue-600 text-white hover:bg-blue-700 py-2 px-4 rounded-lg';
const inputClasses = 'mt-4 p-2 border rounded-lg text-center w-full max-w-xs';

const SupportAlmaMater = () => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Predefined donation amounts
  const donationOptions = [25, 50, 100, 250, 500];
  
  // Function to handle the donation button click
  const handleDonateClick = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convert to cents for Stripe
      const amountInCents = Math.floor(parseFloat(amount) * 100);
      
      // Call to your serverless function to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInCents,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-red-800 to-red-500 p-8 text-center">
      <h1 className="text-3xl font-bold text-white">Support Your Alma Mater</h1>
      <p className="mt-4 text-lg text-white">Your donation helps shape the future of our university and its students.</p>
      
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {donationOptions.map((option) => (
          <button 
            key={option}
            className={`px-4 py-2 rounded-lg ${amount === option.toString() 
              ? 'bg-white text-red-600 font-bold' 
              : 'bg-red-700 text-white hover:bg-red-600'}`}
            onClick={() => setAmount(option.toString())}
          >
            ${option}
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <label htmlFor="customAmount" className="text-white">Custom Amount ($)</label>
        <input
          id="customAmount"
          type="number"
          className={inputClasses}
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          step="0.01"
        />
      </div>
      
      <button 
        className={`${primaryButtonClasses} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={handleDonateClick}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Donate Now ❤'}
      </button>
    </div>
  );
};

export default SupportAlmaMater;