import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { merchantId, email, firstName, lastName, dateOfBirth } = body;

    // Validate required fields
    if (!merchantId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: merchantId, email' },
        { status: 400 }
      );
    }

    // Create Stripe Identity verification session
    const session = await stripe.identity.verificationSessions.create({
      type: 'document',
      options: {
        document: {
          // Require live capture (camera only, not uploaded images)
          require_live_capture: true,
          // Require selfie to match photo on ID
          require_matching_selfie: true,
          // Allow driver's licenses, passports, and ID cards
          allowed_types: ['driving_license', 'passport', 'id_card'],
        },
      },
      // Store merchant data for reference
      metadata: {
        merchant_id: merchantId,
        email: email,
        first_name: firstName || '',
        last_name: lastName || '',
        date_of_birth: dateOfBirth || '',
        source: 'onboarding_step_2',
        created_at: new Date().toISOString(),
      },
      // Return URL after verification completes
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/verify?step=2&session_id={VERIFICATION_SESSION_ID}`,
    });

    console.log('Created Stripe Identity session:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      clientSecret: session.client_secret,
      status: session.status,
    });
  } catch (error) {
    console.error('Error creating Stripe Identity session:', error);

    return NextResponse.json(
      {
        error: 'Failed to create verification session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
