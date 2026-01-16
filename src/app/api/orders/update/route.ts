import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { transporter, mailOptions } from '@/utils/nodemailer'

// Initialize a separate Supabase client with the service role key for privileged access
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { uploadId, status, shopId } = await request.json()

    if (!uploadId) {
      return NextResponse.json({ error: 'Upload ID is required' }, { status: 400 })
    }

    let updatePayload: { status?: string; updated_at: string; pickup_otp?: string, shop_id?: string } = {
      updated_at: new Date().toISOString(),
    }

    if (status) {
      updatePayload.status = status
    }

    if (shopId) {
      updatePayload.shop_id = shopId
    }

    // If the status is being set to 'completed', generate and add an OTP
    if (status === 'completed') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      updatePayload.pickup_otp = otp

      // Get the user's email
      const { data: uploadData, error: uploadError } = await supabaseService
        .from('uploads')
        .select('user_id')
        .eq('id', uploadId)
        .single()

      if (uploadError || !uploadData) {
        console.error('Error fetching upload data:', uploadError)
        return NextResponse.json({ error: 'Failed to find upload' }, { status: 500 })
      }

      const { data: userData, error: userError } = await supabaseService.auth.admin.getUserById(uploadData.user_id)

      if (userError || !userData) {
        console.error('Error fetching user data:', userError)
        return NextResponse.json({ error: 'Failed to find user' }, { status: 500 })
      }

      // Send the email
      try {
        await transporter.sendMail({
          ...mailOptions,
          to: userData.user.email,
          subject: 'Your Print Order is Ready for Pickup!',
          text: `Your order is ready for pickup. Please provide the following OTP to the shopkeeper: ${otp}`,
          html: `<h1>Your Print Order is Ready for Pickup!</h1><p>Your order is ready for pickup. Please provide the following OTP to the shopkeeper: <strong>${otp}</strong></p>`,
        })
        console.log(`OTP email sent to ${userData.user.email} for upload ${uploadId}`)
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError)
        // We can choose to either return an error or just log it and proceed
      }
    }

    const { data, error } = await supabaseService
      .from('uploads')
      .update(updatePayload)
      .eq('id', uploadId)
      .select()
      .single()

    if (error) {
      console.error('Supabase error updating status:', error)
      return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
    }

    return NextResponse.json({ success: true, updatedOrder: data })
  } catch (error) {
    console.error('Error updating order status:', error)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}