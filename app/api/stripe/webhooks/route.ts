import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// Disable body parsing for webhooks (Stripe requires raw body)
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature header');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Received Stripe webhook event:', event.type, 'ID:', event.id);

    // Handle verification session events
    switch (event.type) {
      case 'identity.verification_session.verified':
        await handleVerificationVerified(event);
        break;

      case 'identity.verification_session.requires_input':
        await handleVerificationRequiresInput(event);
        break;

      case 'identity.verification_session.processing':
        await handleVerificationProcessing(event);
        break;

      case 'identity.verification_session.canceled':
        await handleVerificationCanceled(event);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      {
        error: 'Webhook processing failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle successful verification
async function handleVerificationVerified(event: Stripe.Event) {
  const session = event.data.object as Stripe.Identity.VerificationSession;

  console.log('✅ Verification verified:', session.id);
  console.log('Merchant ID:', session.metadata.merchant_id);
  console.log('Email:', session.metadata.email);

  // TODO: Update merchant record in database with verification status
  // Example:
  // await db.merchants.update({
  //   where: { id: session.metadata.merchant_id },
  //   data: {
  //     identityVerificationStatus: 'verified',
  //     identityVerificationSessionId: session.id,
  //     identityVerifiedAt: new Date(),
  //   }
  // });

  if (session.verified_outputs) {
    console.log('Verified data available:', {
      name: `${session.verified_outputs.first_name} ${session.verified_outputs.last_name}`,
      address: session.verified_outputs.address,
      dob: session.verified_outputs.dob,
    });
  }
}

// Handle verification requiring additional input
async function handleVerificationRequiresInput(event: Stripe.Event) {
  const session = event.data.object as Stripe.Identity.VerificationSession;

  console.log('⚠️  Verification requires input:', session.id);
  console.log('Last error:', session.last_error);

  // TODO: Notify merchant that additional action is needed
  // or fallback to manual address entry
}

// Handle verification in processing state
async function handleVerificationProcessing(event: Stripe.Event) {
  const session = event.data.object as Stripe.Identity.VerificationSession;

  console.log('⏳ Verification processing:', session.id);

  // No action needed - just logging
}

// Handle verification canceled
async function handleVerificationCanceled(event: Stripe.Event) {
  const session = event.data.object as Stripe.Identity.VerificationSession;

  console.log('❌ Verification canceled:', session.id);
  console.log('Merchant ID:', session.metadata.merchant_id);

  // TODO: Update merchant record to show verification was canceled
  // May want to allow them to retry or fallback to manual entry
}
