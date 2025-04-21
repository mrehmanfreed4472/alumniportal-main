import React from 'react';

// Shared Tailwind CSS classes
const primaryButtonClasses = 'mt-6 bg-blue-600 text-primary-foreground hover:bg-primary/80 py-2 px-4 rounded-lg';

const SupportAlmaMater = () => {
  return (
    <div className="bg-gradient-to-br from-[#A51C30] to-[#C24C5E] p-8 text-center">
      <h1 className="text-3xl font-bold text-white">Support Your Alma Mater</h1>
      <p className="mt-4 text-lg text-white">Your donation helps shape the future of our university and its students.</p>
      <button className={primaryButtonClasses}>
        Donate Now ❤
      </button>
    </div>
  );
};

export default SupportAlmaMater;