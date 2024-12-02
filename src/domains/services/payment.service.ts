import Stripe from "stripe";
import config from "../../configs";
import { AppError } from "../../libraries/error-handling/AppError";
const stripe = new Stripe(config.STRIPE_SECRET_KEY); // Your test secret key

export async function createPayment({
  amount,
  email,
  metadata = {},
}: {
  amount: number;
  email: string;
  metadata: {};
}) {
  try {
    // 1. Create or retrieve customer
    const customer = await stripe.customers.create({
      email: email,
    });

    // 2. Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: "bdt",
      customer: customer.id,

      payment_method_types: ["card"],
      metadata: {
        ...metadata,
        customer_email: email,
      },
    });
    // console.log(paymentIntent);
    // 3. Return client secret (this is what you'll need on frontend)
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer.id,
    };
  } catch (error) {
    console.error(error);
    throw new AppError(
      "Payment Error",
      "Failed to execute payment transaction",
      500
    );
  }
}
