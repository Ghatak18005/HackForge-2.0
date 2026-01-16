import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize a separate Supabase client with the service role key for privileged access
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { uploadId, otp } = await request.json()

    if (!uploadId || !otp) {
      return NextResponse.json({ error: 'Upload ID and OTP are required' }, { status: 400 })
    }

    // Fetch the order from the database
    const { data: upload, error: fetchError } = await supabaseService
      .from('uploads')
      .select('pickup_otp, status')
      .eq('id', uploadId)
      .single()

    if (fetchError || !upload) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Check if the order is in the correct status
    if (upload.status !== 'completed') {
      return NextResponse.json({ error: 'Order is not ready for pickup' }, { status: 400 })
    }

    // Check if the OTP matches
    if (upload.pickup_otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    // Update the order status to 'done'
    const { data, error: updateError } = await supabaseService
      .from('uploads')
      .update({ status: 'done', pickup_otp: null }) // Clear the OTP after successful verification
      .eq('id', uploadId)
      .select()
      .single()

    if (updateError) {
      console.error('Supabase error updating status:', updateError)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    return NextResponse.json({ success: true, updatedOrder: data })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 })
  }
}