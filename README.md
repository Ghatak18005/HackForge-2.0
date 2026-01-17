# PrintIt

## Overview

PrintIt is a full-stack web platform designed to facilitate document printing services by connecting university students with local print shops. The platform streamlines the workflow by allowing students to upload files, configure print specifications, execute secure online payments, and collect documents using a secure OTP verification mechanism. This solution addresses inefficiencies such as long wait times and cash handling issues.

## Features

### For Students

* **Automated File Analysis:** Utilizes client-side processing to automatically detect page counts for PDF and Word documents upon upload.
* **Real-time Cost Estimation:** Provides instant bill calculation based on configuration parameters such as page count, copies, color mode, and binding preferences.
* **Shop Locator:** Allows users to browse local print shops, view real-time operating status, and compare pricing models.
* **Secure Payment Gateway:** Integrated with PayU to ensure secure and seamless transactions.
* **Secure Handover:** Implements a unique 6-digit OTP system to verify identity during document collection.

### For Shopkeepers

* **Real-time Order Dashboard:** Leverages WebSocket connections to receive and display print orders instantly without manual refreshing.
* **Order Lifecycle Management:** Tools to track and update order status (Pending → Printing → Completed → Delivered).
* **Revenue Monitoring:** Dashboards to track daily earnings and print volume metrics.
* **Operational Controls:** Capabilities to toggle shop visibility and modify pricing structures dynamically.

## Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Database & Authentication:** Supabase (PostgreSQL with Row Level Security)
* **Storage:** Supabase Storage
* **Payment Processor:** PayU India
* **File Processing:** pdfjs-dist (PDF parsing), jszip (DOCX parsing)
* **Icons:** Lucide React

## System Architecture

The application adheres to a client-server-database architecture:

1. **Client-Side:** Handles resource-intensive tasks such as file parsing and page counting locally to minimize server load and latency.
2. **Server-Side (Next.js API):** Manages sensitive operations including payment hash generation and secure order status updates.
3. **Database (Supabase):** Acts as the centralized store for user profiles, order data, and shop configurations, utilizing Realtime subscriptions to push updates to shopkeepers.

## Getting Started

### Prerequisites

* Node.js 18 or higher
* A Supabase account
* A PayU Merchant account (or test environment credentials)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/printit.git
cd printit
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure Environment Variables:

Create a `.env.local` file in the root directory and populate it with the following keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayU Configuration (Test/Production)
PAYU_KEY=your_merchant_key
PAYU_SALT=your_merchant_salt
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Database Setup

Navigate to the Supabase SQL Editor and execute the following queries to initialize the database schema:

```sql
-- 1. Create Profiles Table (Linked to Auth)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role text check (role in ('student', 'shopkeeper')),
  email text
);

-- 2. Create Shops Table
create table public.shops (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.users(id),
  name text not null,
  location text,
  is_open boolean default true,
  bw_price numeric default 2,
  color_price numeric default 10,
  spiral_price numeric default 30,
  lamination_price numeric default 40
);

-- 3. Create Uploads/Orders Table
create table public.uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  shop_id uuid references public.shops(id),
  file_name text,
  storage_path text,
  file_size integer,
  status text default 'pending_payment',
  total_pages integer default 1,
  total_price numeric default 0,
  pickup_otp varchar(6),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Enable Realtime subscriptions for Shopkeepers
alter publication supabase_realtime add table public.uploads;
```

### Storage Setup

1. Navigate to the Storage section in the Supabase Dashboard.
2. Create a new public bucket named `documents`.
3. Configure storage policies to allow authenticated users to upload and read files.

### Running the Application

Start the development server:

```bash
npm run dev
```

Access the application by navigating to `http://localhost:3000` in your web browser.

## Project Structure

```
/src
  /app
    /auth           # Authentication routes (Login/Signup)
    /dashboard      # Role-based dashboards
    /upload         # File upload logic
    /print-settings # Print configuration interface
    /payment        # Payment summary and gateway integration
    /api            # Backend API routes (PayU, Orders)
  /components       # Reusable UI components
  /utils            # Supabase client configuration and helper functions
```

## Security

* **Row Level Security (RLS):** Database policies are strictly enforced to ensure students can only access their own orders and shopkeepers can only access orders assigned to their shop ID.
* **Secure Checkout:** Price calculations are re-validated on the payment page using database values to prevent client-side tampering via URL parameters.
* **OTP Verification:** Physical document handover is secured via a server-generated 6-digit OTP that is only revealed upon successful payment.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request for any feature enhancements or bug fixes.

## License

This project is licensed under the MIT License.
