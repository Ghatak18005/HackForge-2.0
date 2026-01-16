/*
  IMPORTANT: Solving File Access Issues
  This route handles downloading files for shop owners. There are two main ways to ensure the shop owner
  has the correct permissions to download a file that was uploaded by a different user.

  SOLUTION 1: (Implemented) Use a Service Role Key
  This code is configured to use a Supabase Service Role Key, which bypasses all RLS policies.
  This is the most direct way to grant the server full access to storage.

  To make this work, you MUST create an environment variable named `SUPABASE_SERVICE_KEY` in your
  `.env.local` file and set it to your project's service_role key from the Supabase dashboard
  (Settings > API).

  SUPABASE_SERVICE_KEY=your_service_role_key_goes_here

  -----------------------------------------------------------------------------------------------

  SOLUTION 2: (Alternative) Use Row Level Security (RLS)
  If you prefer not to use a service key, you can create a policy in your Supabase database.
  This policy would grant a shop owner permission to read files associated with their shop.
  If you implement the RLS policy below, you can revert the Supabase client in this file
  to use the standard `createServerSupabaseClient()` for all operations.

  -- SQL for RLS Policy --
  -- This policy allows users with the 'shopkeeper' role to download files (`SELECT`)
  -- from the 'documents' bucket if the file's associated shop ID matches their own.

  CREATE POLICY "Shop owners can read documents from their shop"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    (
      -- Get the shop_id associated with the file being accessed
      SELECT shop_id
      FROM public.uploads
      WHERE storage_path = name
    ) IN (
      -- Get the list of shop_ids owned by the currently authenticated user
      SELECT id
      FROM public.shops
      WHERE owner_id = auth.uid()
    )
  );
*/

import { createClient as createServerSupabaseClient } from '@/utils/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize a separate Supabase client with the service role key for privileged access
// This requires the SUPABASE_SERVICE_KEY environment variable to be set.
const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const supabaseUserClient = await createServerSupabaseClient()
    const { uploadId, intent } = await request.json() // intent can be 'view' or 'download'

    console.log(`Download request for uploadId: ${uploadId}, intent: ${intent}`)

    // 1. Authenticate the user (e.g., the shop owner)
    const {
      data: { user },
    } = await supabaseUserClient.auth.getUser()

    if (!user) {
      console.log('No authenticated user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch upload details using the user client
    const { data: upload, error: uploadError } = await supabaseUserClient
      .from('uploads')
      .select('*')
      .eq('id', uploadId)
      .single()

    console.log('Upload data:', upload)
    console.log('Upload error:', uploadError)

    if (uploadError || !upload) {
      console.log('Upload not found')
      return NextResponse.json(
        { error: 'Upload not found or access denied' },
        { status: 404 }
      )
    }
    
    // (Optional but recommended) Verify the authenticated user (shopkeeper) is authorized to access this file
    // This logic depends on your database schema, e.g., checking if upload.shop_id belongs to the user.

    // 3. Use the service role client for storage operations to bypass RLS
    const storagePath = upload.storage_path || upload.file_path || upload.path
    console.log('Storage path to use:', storagePath)
    console.log('All upload fields:', JSON.stringify(upload, null, 2))

    if (!storagePath) {
      console.log('No storage path found in upload record')
      return NextResponse.json(
        { error: 'File not stored properly' },
        { status: 400 }
      )
    }

    try {
      // Determine the download option based on the intent
      const isViewIntent = intent === 'view'
      
      // Try to generate signed URL for download using the service client
      const { data, error } = await supabaseService.storage
        .from('documents')
        .createSignedUrl(storagePath, 3600, {
          download: isViewIntent ? false : true, // false for inline, true for attachment
        })

      console.log('Signed URL result:', { data, error })

      if (error) {
        console.log('Signed URL error details:', error)
        // If signed URL fails, it's a hard error now, don't fallback to direct download 
        // as it complicates the inline/attachment logic.
        throw error
      }

      return NextResponse.json({
        success: true,
        url: data.signedUrl,
        fileName: upload.file_name,
      })
    } catch (storageError) {
      console.error('Storage operation failed:', storageError)
      return NextResponse.json(
        { error: 'Failed to process file from storage', details: String(storageError) },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error generating download link:', error)
    return NextResponse.json(
      { error: 'Failed to generate download link', details: String(error) },
      { status: 500 }
    )
  }
}
