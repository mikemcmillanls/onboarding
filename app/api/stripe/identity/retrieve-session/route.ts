import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      );
    }

    // Retrieve the verification session from Stripe
    const session = await stripe.identity.verificationSessions.retrieve(sessionId);

    console.log('Retrieved Stripe Identity session:', sessionId, 'Status:', session.status);

    // Extract verified data if available
    let verifiedData = null;
    if (session.status === 'verified' && session.verified_outputs) {
      const outputs = session.verified_outputs;

      verifiedData = {
        // Address data from ID
        address: outputs.address ? {
          line1: outputs.address.line1 || '',
          line2: outputs.address.line2 || '',
          city: outputs.address.city || '',
          state: outputs.address.state || '',
          postal_code: outputs.address.postal_code || '',
          country: outputs.address.country || 'US',
        } : null,
        // Personal data from ID
        first_name: outputs.first_name || '',
        last_name: outputs.last_name || '',
        date_of_birth: outputs.dob ? {
          day: outputs.dob.day,
          month: outputs.dob.month,
          year: outputs.dob.year,
        } : null,
        // ID number (may contain SSN or driver's license number)
        id_number: outputs.id_number || '',
      };
    }

    return NextResponse.json({
      sessionId: session.id,
      status: session.status,
      verifiedData,
      lastError: session.last_error ? {
        code: session.last_error.code,
        reason: session.last_error.reason,
      } : null,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error('Error retrieving Stripe Identity session:', error);

    return NextResponse.json(
      {
        error: 'Failed to retrieve verification session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
