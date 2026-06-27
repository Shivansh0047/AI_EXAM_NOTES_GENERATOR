import Stripe from "stripe";
import UserModel from "../models/user.model.js"

// Initialize Stripe using secret key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Credit plans
// amount (INR) : credits awarded
const CREDIT_MAP = {
    100: 50,
    200: 120,
    500: 300,
};

export const createCreditsOrder = async (req, res) => {
    try {
        // Get authenticated user's id
        const userId = req.userId;

        // Amount selected by user from frontend
        const { amount } = req.body;

        // Validate selected plan
        if (!CREDIT_MAP[amount]) {
            return res.status(400).json({
                message: "Invalid credit plan",
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({

            // One-time payment
            mode: "payment",

            // Accepted payment methods
            payment_method_types: ["card"],

            // Redirect after payment success
            success_url: `${process.env.CLIENT_URL}/payment-success`,

            // Redirect after payment failure/cancel
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,

            // Product information
            line_items: [
                {
                    price_data: {
                        currency: "inr",

                        product_data: {
                            name: `${CREDIT_MAP[amount]} Credits`,
                        },

                        // Stripe expects amount in paise
                        unit_amount: amount * 100,
                    },

                    quantity: 1,
                },
            ],

            // Extra information stored with payment, will be used to check unsing webhook
            metadata: {
                userId,
                credits: CREDIT_MAP[amount],
            },
        });

        // Send checkout URL to frontend, at this urlwe will nagivigate the window of forntend. Afterpayment is done.
        res.status(200).json({
            url: session.url,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Stripe error",
        });
    }
};


// Stripe sends events to this endpoint whenever something happens, such as:Payment completed,Subscription created,Refund issued
// Here we are only interested in: checkout.session.completed. This event is triggered when a user successfully completes payment.
export const stripeWebhook = async (req, res) => {

    // Stripe includes a signature header to verify that the request actually came from Stripe.
    const sig = req.headers["stripe-signature"];
    let event;

    try {

        /*
        Verify the webhook payload using Stripe's secret.
        
        req.body                  -> Raw request body
        sig                       -> Stripe signature header
        STRIPE_WEBHOOK_SECRET     -> Webhook signing secret

        If verification fails, Stripe may be spoofed.
        */
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET // We will receiver a scrent after we have deployed and added endpoint
        );

    } catch (error) {

        console.log(
            "❌ Webhook signature error:",
            error.message
        );

        return res.status(400).send("Webhook Error");
    }

    // Handle successful checkout

    if (event.type === "checkout.session.completed") {

        // Checkout session object sent by Stripe
        const session = event.data.object;

        // Extract form metedata
        const userId = session.metadata.userId;

        // Convert credits from string -> number
        const creditsToAdd = Number(
            session.metadata.credits
        );

        if (!userId || !creditsToAdd) {
            return res.status(400).json({
                message: "Invalid metadata"
            });
        }

        // Update the user: $inc  -> Add credits to existing credits, $set  -> Mark credit availability as true
        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                $inc: {
                    credits: creditsToAdd
                },

                $set: {
                    isCreditAvailable: true
                }
            },
            {
                new: true // return updated document
            }
        );

        console.log(
            `✅ Added ${creditsToAdd} credits to user ${userId}`
        );

        console.log("Updated User:", user);
    }

    // Tell Stripe we received the event successfully. If Stripe doesn't receive a 2xx response,it will retry the webhook multiple times.

    res.json({
        received: true
    });
};
