'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// --- SIGNUP ACTION ---
export async function signup(prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const full_name = formData.get('full_name') as string;
  const phone = formData.get('phone') as string;
  const role = formData.get('role') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        phone,
        role,
      },
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }
  
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// --- LOGIN ACTION ---
export async function login(prevState: unknown, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user role
  const { data: { user } } = await supabase.auth.getUser()
  const userRole = user?.user_metadata?.role

  // If shopkeeper, check if they have a shop setup
  if (userRole === 'shopkeeper') {
    const { data: shop } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user?.id)
      .single()

    if (!shop) {
      // Redirect to shop setup if no shop exists
      revalidatePath('/', 'layout')
      redirect('/shop/setup')
    }

    // Shop exists, go to shop dashboard
    revalidatePath('/', 'layout')
    redirect('/shop/dashboard')
  }

  // For students, check if they have completed their profile
  if (userRole === 'student' || userRole === null) {
    const { data: userProfile } = await supabase
      .from('users')
      .select('phone')
      .eq('id', user?.id)
      .single()

    if (!userProfile?.phone) {
      // Redirect to user setup if phone not filled
      revalidatePath('/', 'layout')
      redirect('/user/setup')
    }
  }

  // For students with completed profile, go to dashboard
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

// --- LOGOUT ACTION ---
export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

// --- GOOGLE OAUTH ACTION ---
export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  
  if (error) {
    return { error: error.message }
  }
  
  if (data.url) {
    redirect(data.url)
  }
}

// --- SHOP SETUP ACTION ---
export async function setupShop(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const bw_price = parseFloat(formData.get('bw_price') as string)
  const color_price = parseFloat(formData.get('color_price') as string)
  const spiral_price = parseFloat(formData.get('spiral_price') as string)
  const lamination_price = parseFloat(formData.get('lamination_price') as string)

  if (!name || !location || !bw_price || !color_price || !spiral_price || !lamination_price) {
    return { error: 'All fields are required', success: false }
  }

  const { error } = await supabase.from('shops').insert({
    owner_id: user.id,
    name,
    location,
    bw_price,
    color_price,
    spiral_price,
    lamination_price,
  })

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/shop/dashboard')
}

// --- USER PROFILE SETUP ACTION ---
export async function setupUserProfile(prevState: unknown, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Unauthorized', success: false }
  }

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string

  if (!full_name || !phone) {
    return { error: 'All fields are required', success: false }
  }

  const { error } = await supabase
    .from('users')
    .update({
      full_name,
      phone,
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}