// /app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ message: 'Amount is required' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to Alma Mater',
              description: 'Thank you for your generous support!',
              images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8zcLUZ48pL3JmGpQA8oGQFWaWfKbfIvVPzQ&s'],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      billing_address_collection: 'auto',
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get('origin')}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ message: 'Error creating checkout session' }, { status: 500 });
  }
}