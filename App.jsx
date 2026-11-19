import React, { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  FileCode2,
  Database,
  Server,
  ChevronRight,
  Lock,
  Sparkles,
  Info,
  Copy,
  Check,
  Package,
  CreditCard
} from 'lucide-react';

/**
 * ============================================================================
 * ASRI ONLINE STORE — ARCHITECTURE & CONFIGURATION
 * ============================================================================
 * Business Name: Asri Collection
 * Store Name: Asri Online Store
 * Location: Makassar, Indonesia
 * Email: asricollection82@gmail.com | Phone: 082156764434
 * Service Hours: Monday–Saturday, 09:00–17:00
 *
 * SECURITY ARCHITECTURE:
 * - No Midtrans Server Key is ever present or requested in the frontend.
 * - All Snap tokens are generated exclusively on the backend via Supabase Edge Functions.
 */
// Safe environment variable resolver compatible with ES2015+ bundlers (avoids import.meta warnings)
const getPublicEnv = (key, fallback = '') => {
  try {
    if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
      return window.__ENV__[key];
    }
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (_) {
    // Ignore restricted environment access
  }
  return fallback;
};

// Public environment configuration (replace with your project's public values)
const PUBLIC_CONFIG = {
  SUPABASE_URL: getPublicEnv('VITE_SUPABASE_URL', 'https://your-project-ref.supabase.co'),
  SUPABASE_ANON_KEY: getPublicEnv('VITE_SUPABASE_ANON_KEY', ''),
  MIDTRANS_CLIENT_KEY: getPublicEnv('VITE_MIDTRANS_CLIENT_KEY', 'SB-Mid-client-DEMO_PUBLIC_KEY'),
  MIDTRANS_SNAP_SCRIPT_URL: 'https://app.sandbox.midtrans.com/snap/snap.js',
  SAMPLE_SHIPPING_FEE_IDR: 25000 // Explicitly marked as sample flat rate (Makassar / Domestic)
};

// Demo / Sample Product Catalog (Clearly identified as demo catalog data until replaced by Supabase DB products)
const SAMPLE_CATALOG_PRODUCTS = [
  {
    id: 'prod-asri-001',
    sku: 'ASR-PKN-001',
    name: 'Kemeja Tenun Sutra Makassar Kontemporer',
    category: 'Pakaian',
    price: 385000,
    stock: 14,
    isDemo: true,
    shortDesc: 'Kemeja lengan panjang berbahan katun-sutra ringan dengan aksen motif tenun Sulawesi Selatan.',
    description:
      'Kemeja koleksi Asri Collection yang memadukan potongan modern rapi dengan sentuhan motif tenun khas Makassar. Nyaman dikenakan untuk acara formal maupun kasual sehari-hari. Jahitan halus dengan kancing tersembunyi dan bahan breathable.',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80'
    ],
    specs: ['Material: Katun Sutra Kombinasi', 'Cutting: Regular Modern Fit', 'Perawatan: Cuci lembut / Dry clean']
  },
  {
    id: 'prod-asri-002',
    sku: 'ASR-PKN-002',
    name: 'Blus Linen Minimalis Nusantara Sand',
    category: 'Pakaian',
    price: 275000,
    stock: 22,
    isDemo: true,
    shortDesc: 'Blus wanita berbahan linen premium warna pasir alami dengan kerah mandarin.',
    description:
      'Dirancang untuk iklim tropis Indonesia, blus linen ini menawarkan sirkulasi udara optimal serta siluet jatuh yang elegan. Mudah dipadukan dengan rok lilit maupun celana kulot.',
    images: [
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=900&q=80'
    ],
    specs: ['Material: 100% Natural Linen', 'Warna: Warm Sand', 'Ukuran: S, M, L, XL']
  },
  {
    id: 'prod-asri-003',
    sku: 'ASR-PKN-003',
    name: 'Outerwear Tunik Katun Organik Olive',
    category: 'Pakaian',
    price: 340000,
    stock: 9,
    isDemo: true,
    shortDesc: 'Outerwear panjang berpotongan rileks dengan saku samping fungsional.',
    description:
      'Outerwear serbaguna dari Asri Collection dengan tekstur tenun katun organik lembut. Memberikan tampilan berlapis yang anggun tanpa terasa gerah.',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'
    ],
    specs: ['Material: Katun Organik Tenun', 'Warna: Olive Earth', 'Detail: Saku tersembunyi di sisi kiri & kanan']
  },
  {
    id: 'prod-asri-004',
    sku: 'ASR-SPT-001',
    name: 'Sepatu Loafer Kulit Sintetis Klasik Espresso',
    category: 'Sepatu',
    price: 465000,
    stock: 11,
    isDemo: true,
    shortDesc: 'Loafer bergaya klasik dengan bantalan insole empuk dan sol karet anti-slip.',
    description:
      'Sepatu loafer dengan siluet ramping warna cokelat espresso. Dilengkapi insole busa memori ergonomis yang mendukung kenyamanan berjalan sepanjang hari di kantor maupun acara semi-formal.',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&q=80'
    ],
    specs: ['Upper: Microfiber Leather Halus', 'Outsole: Thermoplastic Rubber Anti-Slip', 'Ukuran Tersedia: 38 – 43']
  },
  {
    id: 'prod-asri-005',
    sku: 'ASR-SPT-002',
    name: 'Sandal Selop Anyaman Kulit Artisan Tan',
    category: 'Sepatu',
    price: 295000,
    stock: 18,
    isDemo: true,
    shortDesc: 'Sandal selop kasual dengan detail anyaman tangan dan alas kaki empuk.',
    description:
      'Sandal selop harian dengan detail anyaman rapi yang memadukan estetika kerajinan lokal dan kenyamanan modern. Ringan, fleksibel, dan cocok untuk aktivitas santai.',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=80'
    ],
    specs: ['Upper: Vegan Woven Leather', 'Insole: Cushioned Suede Finish', 'Ukuran Tersedia: 36 – 41']
  },
  {
    id: 'prod-asri-006',
    sku: 'ASR-TAS-001',
    name: 'Tas Bahu Structured Canvas & Kulit Terracotta',
    category: 'Tas',
    price: 420000,
    stock: 7,
    isDemo: true,
    shortDesc: 'Tas bahu berstruktur kokoh dengan kompartemen laptop 13 inci dan penutup magnetik.',
    description:
      'Tas bahu harian dari Asri Collection menggunakan kanvas tebal tahan percikan air yang dipadukan aksen trim kulit sintetis premium. Dilengkapi kantong ritsleting internal untuk barang berharga.',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=900&q=80'
    ],
    specs: ['Dimensi: 34 cm x 26 cm x 12 cm', 'Material: Heavyweight Water-Repellent Canvas', 'Kompartemen: Slot Laptop 13"']
  },
  {
    id: 'prod-asri-007',
    sku: 'ASR-TAS-002',
    name: 'Tas Selempang Mini Crossbody Caramel',
    category: 'Tas',
    price: 315000,
    stock: 15,
    isDemo: true,
    shortDesc: 'Tas selempang ringkas dengan tali panjang yang dapat disesuaikan dan hardware kuningan.',
    description:
      'Pilihan tepat untuk mobilitas praktis. Meski berukuran ringkas, tas crossbody ini mampu memuat dompet panjang, ponsel, kunci, dan perlengkapan esensial harian dengan rapi.',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80'
    ],
    specs: ['Dimensi: 22 cm x 16 cm x 8 cm', 'Tali: Adjustable Crossbody Strap', 'Penutup: Ritsleting & Flap Magnet']
  }
];

// Format currency strictly in Indonesian Rupiah (IDR)
const formatIDR = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount || 0);
};

// Generate consistent merchant order reference
const generateOrderReference = () => {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate()
  ).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `ASRI-${ymd}-${rand}`;
};

/**
 * ============================================================================
 * SUPABASE SQL SCHEMA & EDGE FUNCTIONS REFERENCE CODE (FOR DEPLOYMENT)
 * ============================================================================
 */
const SUPABASE_SQL_SCHEMA = `-- ============================================================================
-- ASRI ONLINE STORE — SUPABASE POSTGRESQL SCHEMA
-- ============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Pakaian', 'Sepatu', 'Tas')),
  price_idr INTEGER NOT NULL CHECK (price_idr >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  short_description TEXT,
  description TEXT,
  image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_demo BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_reference TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  subtotal_idr INTEGER NOT NULL CHECK (subtotal_idr >= 0),
  shipping_fee_idr INTEGER NOT NULL DEFAULT 25000 CHECK (shipping_fee_idr >= 0),
  grand_total_idr INTEGER NOT NULL CHECK (grand_total_idr >= 0),
  order_status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT'
    CHECK (order_status IN ('PENDING_PAYMENT', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED')),
  snap_token TEXT,
  snap_redirect_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  unit_price_idr INTEGER NOT NULL CHECK (unit_price_idr >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal_idr INTEGER NOT NULL CHECK (subtotal_idr >= 0)
);

-- 4. PAYMENT TRANSACTIONS TABLE (AUTHORITATIVE MIDTRANS AUDIT LOG)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_reference TEXT NOT NULL,
  midtrans_transaction_id TEXT UNIQUE,
  payment_type TEXT,
  transaction_status TEXT NOT NULL,
  fraud_status TEXT,
  status_code TEXT,
  gross_amount_idr INTEGER NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT false,
  raw_notification JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Public read access to active products only
CREATE POLICY "Public can read active products"
  ON public.products FOR SELECT
  USING (is_active = true);
`;

const EDGE_FN_CREATE_SNAP = `// supabase/functions/create-midtrans-transaction/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY");
    const MIDTRANS_IS_PRODUCTION = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!MIDTRANS_SERVER_KEY) {
      throw new Error("Server configuration missing: MIDTRANS_SERVER_KEY is not set in Supabase Secrets.");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const body = await req.json();
    const { order_reference, customer, items, finish_redirect_url } = body;

    if (!order_reference || !customer || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid order payload." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Validate product prices strictly on the backend (never trust frontend amounts)
    const productIds = items.map((i: any) => i.product_id);
    const { data: dbProducts, error: prodErr } = await supabase
      .from("products")
      .select("id, name, price_idr, stock, is_active")
      .in("id", productIds);

    if (prodErr || !dbProducts || dbProducts.length !== items.length) {
      return new Response(JSON.stringify({ error: "One or more products are unavailable." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let validatedSubtotal = 0;
    const itemDetails = [];

    for (const item of items) {
      const dbProd = dbProducts.find((p) => p.id === item.product_id);
      if (!dbProd || !dbProd.is_active || dbProd.stock < item.quantity) {
        return new Response(JSON.stringify({ error: \`Insufficient stock for \${item.product_id}\` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const lineTotal = dbProd.price_idr * item.quantity;
      validatedSubtotal += lineTotal;
      itemDetails.push({
        id: dbProd.id,
        price: dbProd.price_idr,
        quantity: item.quantity,
        name: dbProd.name.slice(0, 50),
      });
    }

    const SAMPLE_SHIPPING_FEE = 25000;
    const validatedGrandTotal = validatedSubtotal + SAMPLE_SHIPPING_FEE;

    itemDetails.push({
      id: "SHIPPING-SAMPLE",
      price: SAMPLE_SHIPPING_FEE,
      quantity: 1,
      name: "Biaya Pengiriman (Sample Flat Rate)",
    });

    // 2. Prevent duplicate order creation (idempotency check)
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("*")
      .eq("order_reference", order_reference)
      .maybeSingle();

    if (existingOrder?.snap_token) {
      return new Response(
        JSON.stringify({
          order_reference: existingOrder.order_reference,
          snap_token: existingOrder.snap_token,
          redirect_url: existingOrder.snap_redirect_url,
          grand_total_idr: existingOrder.grand_total_idr,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Call Official Midtrans Snap API
    const snapApiUrl = MIDTRANS_IS_PRODUCTION
      ? "https://app.midtrans.com/snap/v1/transactions"
      : "https://app.sandbox.midtrans.com/snap/v1/transactions";

    const authHeader = "Basic " + btoa(\`\${MIDTRANS_SERVER_KEY}:\`);
    const snapPayload = {
      transaction_details: {
        order_id: order_reference,
        gross_amount: validatedGrandTotal,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        shipping_address: {
          first_name: customer.name,
          phone: customer.phone,
          address: customer.address,
          country_code: "IDN",
        },
      },
      callbacks: finish_redirect_url ? { finish: finish_redirect_url } : undefined,
    };

    const midtransRes = await fetch(snapApiUrl, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify(snapPayload),
    });

    const midtransData = await midtransRes.json();
    if (!midtransRes.ok || !midtransData.token) {
      return new Response(
        JSON.stringify({ error: "Midtrans Snap creation failed", details: midtransData }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Persist validated order & Snap token in PostgreSQL
    const { data: insertedOrder, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_reference,
        customer_name: customer.name,
        customer_email: customer.email,
        customer_phone: customer.phone,
        shipping_address: customer.address,
        subtotal_idr: validatedSubtotal,
        shipping_fee_idr: SAMPLE_SHIPPING_FEE,
        grand_total_idr: validatedGrandTotal,
        order_status: "PENDING_PAYMENT",
        snap_token: midtransData.token,
        snap_redirect_url: midtransData.redirect_url,
      })
      .select()
      .single();

    if (orderErr) throw orderErr;

    await supabase.from("order_items").insert(
      itemDetails
        .filter((i) => i.id !== "SHIPPING-SAMPLE")
        .map((i) => ({
          order_id: insertedOrder.id,
          product_id: i.id,
          product_name: i.name,
          unit_price_idr: i.price,
          quantity: i.quantity,
          subtotal_idr: i.price * i.quantity,
        }))
    );

    return new Response(
      JSON.stringify({
        order_reference,
        snap_token: midtransData.token,
        redirect_url: midtransData.redirect_url,
        grand_total_idr: validatedGrandTotal,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
`;

const EDGE_FN_WEBHOOK = `// supabase/functions/midtrans-notification/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

async function sha512Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  try {
    const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY")!;
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const notification = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
    } = notification;

    // 1. Verify SHA-512 Signature Key per Official Midtrans Webhook Docs
    const expectedSignature = await sha512Hex(
      \`\${order_id}\${status_code}\${gross_amount}\${MIDTRANS_SERVER_KEY}\`
    );

    if (expectedSignature !== signature_key) {
      return new Response(JSON.stringify({ error: "Invalid signature key" }), { status: 403 });
    }

    // 2. Fetch existing order
    const { data: order } = await supabase
      .from("orders")
      .select("id, order_reference, order_status")
      .eq("order_reference", order_id)
      .single();

    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 });
    }

    // 3. Map Midtrans transaction_status + fraud_status to authoritative order status
    let mappedOrderStatus = "PENDING_PAYMENT";
    if (transaction_status === "capture") {
      mappedOrderStatus = fraud_status === "accept" ? "PAID" : "PENDING_PAYMENT";
    } else if (transaction_status === "settlement") {
      mappedOrderStatus = "PAID";
    } else if (["cancel", "deny"].includes(transaction_status)) {
      mappedOrderStatus = "FAILED";
    } else if (transaction_status === "expire") {
      mappedOrderStatus = "EXPIRED";
    } else if (transaction_status === "pending") {
      mappedOrderStatus = "PENDING_PAYMENT";
    }

    // 4. Upsert payment transaction log (idempotent for repeated notifications)
    await supabase.from("payment_transactions").upsert(
      {
        order_id: order.id,
        order_reference: order_id,
        midtrans_transaction_id: transaction_id,
        payment_type,
        transaction_status,
        fraud_status: fraud_status || null,
        status_code,
        gross_amount_idr: Math.round(Number(gross_amount)),
        signature_verified: true,
        raw_notification: notification,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "midtrans_transaction_id" }
    );

    // 5. Update order status
    await supabase
      .from("orders")
      .update({ order_status: mappedOrderStatus, updated_at: new Date().toISOString() })
      .eq("id", order.id);

    return new Response(JSON.stringify({ received: true, order_status: mappedOrderStatus }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
`;

const EDGE_FN_GET_STATUS = `// supabase/functions/get-order-status/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const MIDTRANS_SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY");
    const MIDTRANS_IS_PRODUCTION = Deno.env.get("MIDTRANS_IS_PRODUCTION") === "true";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { order_reference } = await req.json();

    if (!order_reference) {
      return new Response(JSON.stringify({ error: "order_reference is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("*, order_items(*), payment_transactions(*)")
      .eq("order_reference", order_reference)
      .single();

    if (error || !order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional: Active status check to Midtrans Status API if still pending
    if (order.order_status === "PENDING_PAYMENT" && MIDTRANS_SERVER_KEY) {
      const statusBaseUrl = MIDTRANS_IS_PRODUCTION
        ? "https://api.midtrans.com/v2"
        : "https://api.sandbox.midtrans.com/v2";
      const statusRes = await fetch(\`\${statusBaseUrl}/\${order_reference}/status\`, {
        headers: {
          Accept: "application/json",
          Authorization: "Basic " + btoa(\`\${MIDTRANS_SERVER_KEY}:\`),
        },
      });
      if (statusRes.ok) {
        const mStatus = await statusRes.json();
        if (mStatus.transaction_status === "settlement" || mStatus.transaction_status === "capture") {
          await supabase
            .from("orders")
            .update({ order_status: "PAID", updated_at: new Date().toISOString() })
            .eq("id", order.id);
          order.order_status = "PAID";
        }
      }
    }

    return new Response(
      JSON.stringify({
        order_reference: order.order_reference,
        order_status: order.order_status,
        grand_total_idr: order.grand_total_idr,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        items: order.order_items,
        latest_transaction: order.payment_transactions?.[0] || null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
`;

/**
 * ============================================================================
 * MAIN APPLICATION COMPONENT
 * ============================================================================
 */
export default function App() {
  // Navigation & Stage State (Stages 1..8 + Backend Docs modal/drawer)
  const [activePage, setActivePage] = useState('CATALOG'); // 'CATALOG' | 'DETAIL' | 'CART' | 'CHECKOUT' | 'SNAP_GATEWAY' | 'POST_PAYMENT' | 'ARCHITECTURE_DOCS'
  const [selectedProductId, setSelectedProductId] = useState(SAMPLE_CATALOG_PRODUCTS[0].id);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [detailQty, setDetailQty] = useState(1);

  // Catalog Filters
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Shopping Cart State
  const [cart, setCart] = useState([
    { productId: 'prod-asri-001', quantity: 1 } // Pre-seeded with 1 item so users can immediately inspect cart or add more
  ]);

  // Checkout Form State
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Order & Midtrans Snap State
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [snapScriptReady, setSnapScriptReady] = useState(false);
  const [snapScriptError, setSnapScriptError] = useState(false);
  const [snapPopupTriggered, setSnapPopupTriggered] = useState(false);

  // Post-Payment State (Stage 8: A. PAID | B. PENDING | C. FAILED)
  const [postPaymentState, setPostPaymentState] = useState({
    outcome: 'PENDING', // 'PAID' | 'PENDING' | 'FAILED'
    authoritativeStatus: 'PENDING_PAYMENT',
    transactionId: null,
    paymentType: null,
    statusMessage: '',
    isVerifying: false,
    verificationSource: 'Backend Status Endpoint'
  });

  // Toast notification banner (replaces browser alert)
  const [toastMessage, setToastMessage] = useState(null);

  // Backend Docs tab state
  const [activeDocTab, setActiveDocTab] = useState('schema');
  const [copiedKey, setCopiedKey] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Load Official Midtrans Snap.js Sandbox Script
  useEffect(() => {
    const existingScript = document.getElementById('midtrans-snap-script');
    if (existingScript) {
      if (window.snap) setSnapScriptReady(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'midtrans-snap-script';
    script.src = PUBLIC_CONFIG.MIDTRANS_SNAP_SCRIPT_URL;
    script.setAttribute('data-client-key', PUBLIC_CONFIG.MIDTRANS_CLIENT_KEY);
    script.async = true;
    script.onload = () => setSnapScriptReady(true);
    script.onerror = () => setSnapScriptError(true);
    document.body.appendChild(script);
  }, []);

  // Handle Midtrans Return URL query params if redirected back from Snap Redirect URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const returnedOrderId = params.get('order_id');
    const returnedStatus = params.get('transaction_status');

    if (returnedOrderId) {
      // Never mark as paid purely from URL parameters; call backend verification
      verifyOrderStatusFromBackend(returnedOrderId, returnedStatus);
    }
  }, []);

  // Derived Catalog Products
  const filteredProducts = useMemo(() => {
    return SAMPLE_CATALOG_PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.shortDesc.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedProduct = useMemo(() => {
    return (
      SAMPLE_CATALOG_PRODUCTS.find((p) => p.id === selectedProductId) ||
      SAMPLE_CATALOG_PRODUCTS[0]
    );
  }, [selectedProductId]);

  // Derived Cart Items & Totals
  const enrichedCart = useMemo(() => {
    return cart
      .map((item) => {
        const product = SAMPLE_CATALOG_PRODUCTS.find((p) => p.id === item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          subtotal: product.price * item.quantity
        };
      })
      .filter(Boolean);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return enrichedCart.reduce((acc, item) => acc + item.quantity, 0);
  }, [enrichedCart]);

  const cartSubtotal = useMemo(() => {
    return enrichedCart.reduce((acc, item) => acc + item.subtotal, 0);
  }, [enrichedCart]);

  const grandTotal = useMemo(() => {
    return cartSubtotal > 0 ? cartSubtotal + PUBLIC_CONFIG.SAMPLE_SHIPPING_FEE_IDR : 0;
  }, [cartSubtotal]);

  // Cart Actions
  const handleAddToCart = (productId, qty = 1) => {
    const product = SAMPLE_CATALOG_PRODUCTS.find((p) => p.id === productId);
    if (!product || product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        const nextQty = Math.min(product.stock, existing.quantity + qty);
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: nextQty } : i));
      }
      return [...prev, { productId, quantity: Math.min(product.stock, qty) }];
    });
    showToast(`"${product.name}" ditambahkan ke keranjang belanja.`, 'success');
  };

  const handleUpdateCartQty = (productId, delta) => {
    const product = SAMPLE_CATALOG_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId !== productId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          return { ...item, quantity: Math.min(product.stock, nextQty) };
        })
        .filter(Boolean)
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Produk dihapus dari keranjang.', 'info');
  };

  // Navigation Handlers
  const openProductDetail = (productId) => {
    setSelectedProductId(productId);
    setSelectedImageIdx(0);
    setDetailQty(1);
    setActivePage('DETAIL');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate Checkout Form
  const validateCheckoutForm = () => {
    const errors = {};
    if (!customerForm.name.trim() || customerForm.name.trim().length < 3) {
      errors.name = 'Nama lengkap wajib diisi (minimal 3 karakter).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerForm.email.trim())) {
      errors.email = 'Masukkan alamat email yang valid.';
    }
    const phoneDigits = customerForm.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9 || phoneDigits.length > 15) {
      errors.phone = 'Nomor telepon wajib diisi (9–15 digit angka, contoh: 082156764434).';
    }
    if (!customerForm.address.trim() || customerForm.address.trim().length < 12) {
      errors.address = 'Alamat pengiriman lengkap wajib diisi (jalan, kecamatan, kota, kode pos).';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * STAGE 4 -> STAGE 5:
   * Create Order via Supabase Edge Function (`create-midtrans-transaction`)
   * and receive official Midtrans Snap Token & Redirect URL.
   */
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (enrichedCart.length === 0) return;
    if (!validateCheckoutForm()) return;

    setIsCreatingOrder(true);
    setCheckoutError(null);

    // Prevent duplicate order reference if customer already created an order for the same cart
    const orderRef = currentOrder?.order_reference || generateOrderReference();

    const orderPayload = {
      order_reference: orderRef,
      customer: {
        name: customerForm.name.trim(),
        email: customerForm.email.trim(),
        phone: customerForm.phone.trim(),
        address: customerForm.address.trim()
      },
      items: enrichedCart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        unit_price_idr: item.product.price,
        quantity: item.quantity,
        subtotal_idr: item.subtotal
      })),
      subtotal_idr: cartSubtotal,
      shipping_fee_idr: PUBLIC_CONFIG.SAMPLE_SHIPPING_FEE_IDR,
      grand_total_idr: grandTotal,
      finish_redirect_url: window.location.origin + window.location.pathname
    };

    try {
      const isConfiguredSupabase =
        PUBLIC_CONFIG.SUPABASE_URL &&
        !PUBLIC_CONFIG.SUPABASE_URL.includes('your-project-ref') &&
        PUBLIC_CONFIG.SUPABASE_ANON_KEY;

      if (isConfiguredSupabase) {
        // Real Supabase Edge Function call
        const response = await fetch(
          `${PUBLIC_CONFIG.SUPABASE_URL}/functions/v1/create-midtrans-transaction`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${PUBLIC_CONFIG.SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify(orderPayload)
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Gagal membuat transaksi Midtrans Snap di server.');
        }

        const createdOrderRecord = {
          ...orderPayload,
          snap_token: data.snap_token,
          redirect_url: data.redirect_url,
          grand_total_idr: data.grand_total_idr || grandTotal,
          backendMode: 'SUPABASE_EDGE_LIVE'
        };

        setCurrentOrder(createdOrderRecord);
        navigateTo('SNAP_GATEWAY');
        triggerOfficialMidtransSnap(data.snap_token, createdOrderRecord);
      } else {
        // Explicit Architecture State when Supabase secrets/URL are not yet bound in this preview environment:
        // Never fabricate fake Midtrans VA numbers, QR codes, or fake Snap tokens.
        const pendingBackendOrder = {
          ...orderPayload,
          snap_token: null,
          redirect_url: null,
          backendMode: 'AWAITING_SUPABASE_EDGE_CONFIG'
        };
        setCurrentOrder(pendingBackendOrder);
        navigateTo('SNAP_GATEWAY');
      }
    } catch (err) {
      setCheckoutError(err.message || 'Terjadi kesalahan saat menghubungi server pembayaran.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  /**
   * OFFICIAL MIDTRANS SNAP.JS INVOCATION
   * Opens the real Midtrans Sandbox Snap Popup (Stages 5, 6, 7)
   * and routes callbacks to Stage 8 backend status verification.
   */
  const triggerOfficialMidtransSnap = (snapToken, orderRecord) => {
    if (!snapToken) return;
    if (window.snap && typeof window.snap.pay === 'function') {
      setSnapPopupTriggered(true);
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          setSnapPopupTriggered(false);
          // Do not assume paid solely from client callback; verify with backend
          verifyOrderStatusFromBackend(orderRecord.order_reference, result?.transaction_status, result);
        },
        onPending: function (result) {
          setSnapPopupTriggered(false);
          verifyOrderStatusFromBackend(orderRecord.order_reference, 'pending', result);
        },
        onError: function (result) {
          setSnapPopupTriggered(false);
          setPostPaymentState({
            outcome: 'FAILED',
            authoritativeStatus: 'FAILED',
            transactionId: result?.transaction_id || null,
            paymentType: result?.payment_type || null,
            statusMessage: result?.status_message || 'Pembayaran gagal diproses oleh Midtrans.',
            isVerifying: false,
            verificationSource: 'Midtrans Snap Error Callback'
          });
          navigateTo('POST_PAYMENT');
        },
        onClose: function () {
          setSnapPopupTriggered(false);
          showToast(
            'Jendela pembayaran Midtrans ditutup sebelum selesai. Anda dapat membuka kembali Snap Checkout.',
            'info'
          );
        }
      });
    } else {
      showToast(
        'Script Midtrans Snap.js belum termuat sepenuhnya. Gunakan tautan Redirect URL resmi Midtrans.',
        'error'
      );
    }
  };

  /**
   * STAGE 8 — AUTHORITATIVE BACKEND STATUS VERIFICATION
   * Calls `get-order-status` Supabase Edge Function so payment status is never
   * trusted solely from browser URL redirection.
   */
  const verifyOrderStatusFromBackend = async (
    orderReference,
    hintStatus = null,
    snapCallbackPayload = null
  ) => {
    setPostPaymentState((prev) => ({
      ...prev,
      isVerifying: true
    }));
    navigateTo('POST_PAYMENT');

    const isConfiguredSupabase =
      PUBLIC_CONFIG.SUPABASE_URL &&
      !PUBLIC_CONFIG.SUPABASE_URL.includes('your-project-ref') &&
      PUBLIC_CONFIG.SUPABASE_ANON_KEY;

    if (isConfiguredSupabase) {
      try {
        const res = await fetch(`${PUBLIC_CONFIG.SUPABASE_URL}/functions/v1/get-order-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${PUBLIC_CONFIG.SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({ order_reference: orderReference })
        });
        const data = await res.json();

        if (res.ok && data) {
          const authStatus = data.order_status || 'PENDING_PAYMENT';
          let outcome = 'PENDING';
          if (authStatus === 'PAID') outcome = 'PAID';
          else if (['FAILED', 'EXPIRED', 'CANCELLED'].includes(authStatus)) outcome = 'FAILED';

          if (outcome === 'PAID') {
            setCart([]);
          }

          setPostPaymentState({
            outcome,
            authoritativeStatus: authStatus,
            transactionId:
              data.latest_transaction?.midtrans_transaction_id ||
              snapCallbackPayload?.transaction_id ||
              null,
            paymentType:
              data.latest_transaction?.payment_type ||
              snapCallbackPayload?.payment_type ||
              null,
            statusMessage:
              outcome === 'PAID'
                ? 'Pembayaran telah terverifikasi secara resmi oleh webhook/API Midtrans.'
                : outcome === 'FAILED'
                ? 'Transaksi gagal, dibatalkan, atau kedaluwarsa.'
                : 'Menunggu konfirmasi settlement pembayaran dari Midtrans.',
            isVerifying: false,
            verificationSource: 'Supabase Edge Function (get-order-status)'
          });
          return;
        }
      } catch (err) {
        // Fall through to explicit unverified pending state
      }
    }

    // When backend Edge Function is not yet connected in preview, NEVER fake PAID status.
    // Always display UNFINISHED / PENDING awaiting authoritative webhook/backend verification.
    const mappedFallbackOutcome =
      hintStatus === 'deny' || hintStatus === 'cancel' || hintStatus === 'expire'
        ? 'FAILED'
        : 'PENDING';

    setPostPaymentState({
      outcome: mappedFallbackOutcome,
      authoritativeStatus:
        mappedFallbackOutcome === 'FAILED' ? 'FAILED' : 'PENDING_VERIFICATION',
      transactionId: snapCallbackPayload?.transaction_id || null,
      paymentType: snapCallbackPayload?.payment_type || null,
      statusMessage:
        mappedFallbackOutcome === 'FAILED'
          ? 'Transaksi dibatalkan atau gagal.'
          : 'Status pembayaran belum dapat diverifikasi sebagai LUNAS karena Supabase Edge Function (get-order-status & midtrans-notification) belum terhubung ke project aktif.',
      isVerifying: false,
      verificationSource: 'Strict Zero-Trust Guard (Backend Required)'
    });
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Current Stage Indicator Helper
  const getCurrentStageNumber = () => {
    switch (activePage) {
      case 'CATALOG':
        return 1;
      case 'DETAIL':
        return 2;
      case 'CART':
        return 3;
      case 'CHECKOUT':
        return 4;
      case 'SNAP_GATEWAY':
        return 5;
      case 'POST_PAYMENT':
        return 8;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-stone-900 font-sans selection:bg-emerald-900 selection:text-white">
      {/* =====================================================================
          TOP ANNOUNCEMENT & STORE METADATA BAR
      ====================================================================== */}
      <div className="bg-stone-900 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Makassar, Indonesia
            </span>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Layanan: Senin–Sabtu, 09:00–17:00 WITA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Midtrans Snap Official Gateway
            </span>
            <button
              onClick={() => navigateTo('ARCHITECTURE_DOCS')}
              className="text-amber-300 hover:text-amber-200 underline underline-offset-2 font-medium transition"
            >
              Supabase & Midtrans Docs
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          PRIMARY STOREFRONT NAVIGATION HEADER
      ====================================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setSelectedCategory('Semua');
              navigateTo('CATALOG');
            }}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-serif text-xl font-bold tracking-wider shadow-sm group-hover:bg-emerald-950 transition">
              AC
            </div>
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-stone-900 leading-none">
                Asri Online Store
              </div>
              <div className="text-[11px] uppercase tracking-widest text-stone-500 mt-0.5">
                by Asri Collection
              </div>
            </div>
          </button>

          {/* Category Quick Nav (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {['Semua', 'Pakaian', 'Sepatu', 'Tas'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  navigateTo('CATALOG');
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  activePage === 'CATALOG' && selectedCategory === cat
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat === 'Semua' ? 'Semua Koleksi' : cat}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Transaction Stage Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs text-stone-600">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Tahap {getCurrentStageNumber()} / 8</span>
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => navigateTo('CART')}
              aria-label="Keranjang Belanja"
              className="relative inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-400 text-stone-950 text-xs font-bold">
                {cartItemCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 flex items-center gap-3 animate-fade-in">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <p className="text-sm leading-snug">{toastMessage.msg}</p>
        </div>
      )}

      {/* =====================================================================
          TRANSACTION JOURNEY STEPPER BAR (STAGES 1 - 8)
      ====================================================================== */}
      {activePage !== 'ARCHITECTURE_DOCS' && (
        <div className="bg-white border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[680px] text-xs">
              {[
                { step: 1, label: '1. Katalog', page: 'CATALOG' },
                { step: 2, label: '2. Detail Produk', page: 'DETAIL' },
                { step: 3, label: '3. Keranjang', page: 'CART' },
                { step: 4, label: '4. Checkout', page: 'CHECKOUT' },
                { step: 5, label: '5–7. Midtrans Snap', page: 'SNAP_GATEWAY' },
                { step: 8, label: '8. Status Pembayaran', page: 'POST_PAYMENT' }
              ].map((item, index, arr) => {
                const currentNum = getCurrentStageNumber();
                const isActive =
                  (item.step === 5 && currentNum >= 5 && currentNum <= 7) ||
                  currentNum === item.step;
                const isCompleted = currentNum > item.step;

                return (
                  <React.Fragment key={item.step}>
                    <button
                      onClick={() => {
                        if (item.page === 'CATALOG' || item.page === 'DETAIL' || item.page === 'CART') {
                          navigateTo(item.page);
                        } else if (item.page === 'CHECKOUT' && enrichedCart.length > 0) {
                          navigateTo('CHECKOUT');
                        } else if (item.page === 'SNAP_GATEWAY' && currentOrder) {
                          navigateTo('SNAP_GATEWAY');
                        } else if (item.page === 'POST_PAYMENT' && currentOrder) {
                          navigateTo('POST_PAYMENT');
                        }
                      }}
                      className={`flex items-center gap-2 py-1 px-2.5 rounded-lg font-medium transition ${
                        isActive
                          ? 'bg-emerald-950 text-white'
                          : isCompleted
                          ? 'text-emerald-800 hover:bg-emerald-50'
                          : 'text-stone-400'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                          isActive
                            ? 'bg-amber-400 text-stone-950'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {isCompleted ? '✓' : item.step}
                      </span>
                      <span>{item.label}</span>
                    </button>
                    {index < arr.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MAIN CONTENT AREA — ROUTED BY TRANSACTION STAGE
      ====================================================================== */}
      <main className="flex-1">
        {/* -------------------------------------------------------------------
            PAGE 1 — PRODUCT CATALOG
        -------------------------------------------------------------------- */}
        {activePage === 'CATALOG' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Editorial Storefront Hero Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-stone-900 text-white p-6 sm:p-10 lg:p-12 mb-8 shadow-sm">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-medium mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Koleksi Fashion Resmi • Makassar, Indonesia</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                  Keanggunan Fashion Nusantara untuk Keseharian Anda
                </h1>
                <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed">
                  Temukan kurasi Pakaian, Sepatu, dan Tas pilihan dari{' '}
                  <strong className="text-white">Asri Collection</strong>. Transaksi aman dan
                  transparan menggunakan gerbang pembayaran resmi Midtrans Snap.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-stone-300">
                  <span className="px-3 py-1.5 rounded-lg bg-white/10">
                    Mata Uang: <strong>IDR (Rupiah)</strong>
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    Catatan: Katalog awal berisi produk sampel/demo untuk verifikasi toko
                  </span>
                </div>
              </div>
              <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/3 opacity-25 pointer-events-none">
                <img
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80"
                  alt="Asri Collection Fashion"
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* Search & Category Filter Controls */}
            <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['Semua', 'Pakaian', 'Sepatu', 'Tas'].map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition border ${
                      selectedCategory === category
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {category === 'Semua' ? 'Semua Kategori' : category}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pakaian, sepatu, atau tas..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/15 focus:border-stone-900 transition"
                />
              </div>
            </section>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
                <p className="text-stone-600 font-medium">
                  Tidak ada produk yang cocok dengan pencarian Anda.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-stone-900 text-white text-sm font-medium"
                >
                  Reset Filter Katalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-stone-300 transition duration-200"
                  >
                    <div>
                      {/* Product Image */}
                      <div
                        onClick={() => openProductDetail(product.id)}
                        className="relative aspect-[4/5] bg-stone-100 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-semibold shadow-xs">
                            {product.category}
                          </span>
                          {product.isDemo && (
                            <span className="px-2 py-1 rounded-lg bg-stone-900/85 text-amber-300 text-[11px] font-medium">
                              Sample Katalog
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium shadow-xs ${
                              product.stock > 0
                                ? 'bg-emerald-950/90 text-emerald-200'
                                : 'bg-rose-900 text-white'
                            }`}
                          >
                            {product.stock > 0 ? `Stok: ${product.stock}` : 'Habis'}
                          </span>
                        </div>
                      </div>

                      {/* Product Meta */}
                      <div className="p-4">
                        <div className="text-[11px] font-mono text-stone-400 mb-1">
                          {product.sku}
                        </div>
                        <h2
                          onClick={() => openProductDetail(product.id)}
                          className="font-semibold text-stone-900 text-base leading-snug line-clamp-2 cursor-pointer group-hover:text-emerald-900 transition"
                        >
                          {product.name}
                        </h2>
                        <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                          {product.shortDesc}
                        </p>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="px-4 pb-4 pt-2 border-t border-stone-100">
                      <div className="text-lg font-bold text-stone-900 mb-3">
                        {formatIDR(product.price)}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => openProductDetail(product.id)}
                          className="px-3 py-2.5 rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-100 text-xs font-semibold transition"
                        >
                          Detail Produk
                        </button>
                        <button
                          onClick={() => handleAddToCart(product.id, 1)}
                          disabled={product.stock <= 0}
                          className="px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-emerald-950 disabled:bg-stone-300 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>+ Keranjang</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            PAGE 2 — PRODUCT DETAIL
        -------------------------------------------------------------------- */}
        {activePage === 'DETAIL' && selectedProduct && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => navigateTo('CATALOG')}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog Produk</span>
            </button>

            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 lg:p-10 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Image Gallery */}
                <div>
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 mb-4">
                    <img
                      src={selectedProduct.images[selectedImageIdx] || selectedProduct.images[0]}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {selectedProduct.images.length > 1 && (
                    <div className="flex items-center gap-3">
                      {selectedProduct.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIdx(idx)}
                          className={`w-20 h-24 rounded-xl overflow-hidden border-2 transition ${
                            selectedImageIdx === idx
                              ? 'border-stone-900 ring-2 ring-stone-900/20'
                              : 'border-stone-200 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Information & Quantity Selector */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-semibold">
                        Kategori: {selectedProduct.category}
                      </span>
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                        Tersedia ({selectedProduct.stock} unit)
                      </span>
                      {selectedProduct.isDemo && (
                        <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-medium">
                          Produk Sampel / Demo
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-mono text-stone-400 mb-1">
                      SKU: {selectedProduct.sku}
                    </div>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                      {selectedProduct.name}
                    </h1>

                    <div className="mt-4 text-3xl font-bold text-stone-900">
                      {formatIDR(selectedProduct.price)}
                    </div>

                    <p className="mt-5 text-sm sm:text-base text-stone-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>

                    {/* Specifications */}
                    <div className="mt-6 pt-6 border-t border-stone-200">
                      <h3 className="text-xs uppercase tracking-wider font-bold text-stone-500 mb-3">
                        Spesifikasi Produk
                      </h3>
                      <ul className="space-y-2">
                        {selectedProduct.specs.map((spec, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Purchase Controls */}
                  <div className="mt-8 pt-6 border-t border-stone-200">
                    <div className="flex flex-wrap items-center gap-4 mb-5">
                      <span className="text-sm font-semibold text-stone-700">Jumlah:</span>
                      <div className="inline-flex items-center border border-stone-300 rounded-xl bg-stone-50">
                        <button
                          type="button"
                          onClick={() => setDetailQty((q) => Math.max(1, q - 1))}
                          className="p-3 text-stone-700 hover:text-stone-900"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-5 font-bold text-stone-900">{detailQty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setDetailQty((q) => Math.min(selectedProduct.stock, q + 1))
                          }
                          className="p-3 text-stone-700 hover:text-stone-900"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-xs text-stone-500">
                        Subtotal: <strong>{formatIDR(selectedProduct.price * detailQty)}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(selectedProduct.id, detailQty)}
                        className="px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-emerald-950 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span>Tambah ke Keranjang</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleAddToCart(selectedProduct.id, detailQty);
                          navigateTo('CART');
                        }}
                        className="px-6 py-3.5 rounded-xl border-2 border-stone-900 text-stone-900 hover:bg-stone-100 font-semibold text-sm transition"
                      >
                        Beli & Lihat Keranjang
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            PAGE 3 — SHOPPING CART
        -------------------------------------------------------------------- */}
        {activePage === 'CART' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Keranjang Belanja
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Periksa kembali produk dan jumlah pesanan Anda sebelum melanjutkan ke checkout.
                </p>
              </div>
              <button
                onClick={() => navigateTo('CATALOG')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-sm font-medium text-stone-800 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Lanjut Belanja</span>
              </button>
            </div>

            {enrichedCart.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-stone-900">Keranjang Belanja Kosong</h2>
                <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
                  Anda belum menambahkan produk ke keranjang. Silakan jelajahi katalog Asri Online
                  Store terlebih dahulu.
                </p>
                <button
                  onClick={() => navigateTo('CATALOG')}
                  className="mt-6 px-6 py-3 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-emerald-950 transition"
                >
                  Jelajahi Katalog Produk
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-4">
                  {enrichedCart.map(({ product, quantity, subtotal }) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-24 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                        />
                        <div>
                          <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {product.category}
                          </span>
                          <h3 className="font-semibold text-stone-900 text-base mt-1">
                            {product.name}
                          </h3>
                          <div className="text-sm text-stone-500 mt-0.5">
                            Harga satuan: {formatIDR(product.price)}
                          </div>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                        {/* Quantity Adjuster */}
                        <div className="inline-flex items-center border border-stone-300 rounded-xl bg-stone-50">
                          <button
                            onClick={() => handleUpdateCartQty(product.id, -1)}
                            className="p-2 text-stone-700 hover:text-stone-900"
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3.5 text-sm font-bold">{quantity}</span>
                          <button
                            onClick={() => handleUpdateCartQty(product.id, 1)}
                            className="p-2 text-stone-700 hover:text-stone-900"
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="text-right min-w-[115px]">
                          <div className="font-bold text-stone-900">{formatIDR(subtotal)}</div>
                          <button
                            onClick={() => handleRemoveFromCart(product.id)}
                            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 mt-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary Box */}
                <div className="bg-white rounded-2xl border border-stone-200 p-6 h-fit shadow-xs">
                  <h2 className="font-bold text-lg text-stone-900 mb-4">Ringkasan Keranjang</h2>
                  <div className="space-y-3 text-sm pb-4 border-b border-stone-200">
                    <div className="flex justify-between text-stone-600">
                      <span>Total Produk ({cartItemCount} item)</span>
                      <span className="font-semibold text-stone-900">
                        {formatIDR(cartSubtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-600">
                      <span>Estimasi Pengiriman (Sample)</span>
                      <span className="font-medium text-stone-900">
                        {formatIDR(PUBLIC_CONFIG.SAMPLE_SHIPPING_FEE_IDR)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="font-bold text-stone-900">Total Sementara</span>
                    <span className="text-xl font-bold text-emerald-950">
                      {formatIDR(grandTotal)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentOrder(null); // Reset stale draft order if cart changed
                      navigateTo('CHECKOUT');
                    }}
                    className="w-full py-3.5 px-5 rounded-xl bg-stone-900 hover:bg-emerald-950 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Lanjut ke Checkout</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            PAGE 4 — CHECKOUT
        -------------------------------------------------------------------- */}
        {activePage === 'CHECKOUT' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => navigateTo('CART')}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Keranjang</span>
            </button>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Checkout Pesanan
            </h1>
            <p className="text-sm text-stone-500 mb-8">
              Lengkapi informasi pengiriman Anda. Total tagihan akan divalidasi oleh backend
              sebelum membuat sesi pembayaran Midtrans Snap.
            </p>

            {checkoutError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Gagal Memproses Checkout</div>
                  <p className="mt-0.5">{checkoutError}</p>
                </div>
              </div>
            )}

            <form
              onSubmit={handleCheckoutSubmit}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Customer Shipping Details */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-5">
                <h2 className="font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
                  Informasi Pelanggan & Pengiriman
                </h2>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Nama Lengkap Pelanggan *
                  </label>
                  <input
                    type="text"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    placeholder="Contoh: Siti Rahmawati"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-stone-300 focus:ring-stone-900/15 focus:border-stone-900'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                      Alamat Email *
                    </label>
                    <input
                      type="email"
                      value={customerForm.email}
                      onChange={(e) =>
                        setCustomerForm({ ...customerForm, email: e.target.value })
                      }
                      placeholder="pelanggan@email.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.email
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-stone-300 focus:ring-stone-900/15 focus:border-stone-900'
                      }`}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                      Nomor Telepon / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      value={customerForm.phone}
                      onChange={(e) =>
                        setCustomerForm({ ...customerForm, phone: e.target.value })
                      }
                      placeholder="0821xxxxxxxx"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                        formErrors.phone
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-stone-300 focus:ring-stone-900/15 focus:border-stone-900'
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-800 mb-1.5">
                    Alamat Pengiriman Lengkap *
                  </label>
                  <textarea
                    rows={3}
                    value={customerForm.address}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, address: e.target.value })
                    }
                    placeholder="Nama jalan, nomor rumah, kelurahan, kecamatan, kota, provinsi, kode pos"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                      formErrors.address
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-stone-300 focus:ring-stone-900/15 focus:border-stone-900'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-xs text-rose-600 mt-1">{formErrors.address}</p>
                  )}
                </div>

                {/* Payment Gateway Disclosure */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-stone-900">
                    <CreditCard className="w-4 h-4 text-emerald-800" />
                    <span>Metode Pembayaran: Midtrans Snap Official Checkout</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    Pilihan kanal pembayaran (Virtual Account Bank, QRIS, E-Wallet, atau Kartu)
                    akan ditampilkan secara langsung pada antarmuka resmi{' '}
                    <strong>Midtrans Snap</strong> sesuai konfigurasi aktif akun merchant Asri
                    Collection.
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 h-fit shadow-xs">
                <h2 className="font-bold text-lg text-stone-900 mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 pb-4 border-b border-stone-200 max-h-60 overflow-y-auto">
                  {enrichedCart.map(({ product, quantity, subtotal }) => (
                    <div key={product.id} className="flex justify-between gap-3 text-sm">
                      <div className="text-stone-700">
                        <span className="font-semibold text-stone-900">{quantity}x</span>{' '}
                        {product.name}
                      </div>
                      <div className="font-semibold text-stone-900 shrink-0">
                        {formatIDR(subtotal)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2.5 py-4 border-b border-stone-200 text-sm">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal Produk</span>
                    <span className="font-medium text-stone-900">{formatIDR(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>
                      Ongkos Kirim{' '}
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        Sample Flat Rate
                      </span>
                    </span>
                    <span className="font-medium text-stone-900">
                      {formatIDR(PUBLIC_CONFIG.SAMPLE_SHIPPING_FEE_IDR)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="font-bold text-stone-900">Total Tagihan (IDR)</span>
                  <span className="text-xl font-bold text-emerald-950">
                    {formatIDR(grandTotal)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingOrder || enrichedCart.length === 0}
                  className="w-full py-3.5 px-5 rounded-xl bg-emerald-950 hover:bg-emerald-900 disabled:bg-stone-400 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>
                    {isCreatingOrder
                      ? 'Membuat Transaksi Midtrans...'
                      : 'Lanjutkan ke Pembayaran'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------------
            STAGES 5, 6, 7 — OFFICIAL MIDTRANS SNAP PAYMENT GATEWAY LAUNCHER
        -------------------------------------------------------------------- */}
        {activePage === 'SNAP_GATEWAY' && currentOrder && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Tahap 5–7 • Midtrans Snap Integration
                  </span>
                  <h1 className="font-serif text-2xl font-bold text-stone-900 mt-1">
                    Pembayaran Resmi Midtrans Snap
                  </h1>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-stone-100 text-xs font-mono font-bold text-stone-800">
                  Order ID: {currentOrder.order_reference}
                </div>
              </div>

              {/* Order & Customer Verification Summary */}
              <div className="my-6 p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Pelanggan</span>
                  <span className="font-semibold text-stone-900">
                    {currentOrder.customer.name} ({currentOrder.customer.email})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Pembayaran Tervalidasi</span>
                  <span className="font-bold text-lg text-emerald-950">
                    {formatIDR(currentOrder.grand_total_idr)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Lingkungan Midtrans</span>
                  <span className="font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-xs">
                    Midtrans Sandbox (snap.sandbox.midtrans.com)
                  </span>
                </div>
              </div>

              {/* Case A: Live Supabase Edge Function returned an authentic Snap Token */}
              {currentOrder.snap_token ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm">
                    <div className="font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Token Transaksi Midtrans Snap Berhasil Dibuat oleh Backend</span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-emerald-900">
                      Silakan pilih metode pembayaran dan ikuti instruksi pembayaran langsung pada
                      jendela resmi <strong>Midtrans Snap</strong>. Aplikasi ini tidak membuat
                      nomor Virtual Account atau QRIS tiruan.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        triggerOfficialMidtransSnap(currentOrder.snap_token, currentOrder)
                      }
                      className="flex-1 py-3.5 px-5 rounded-xl bg-stone-900 hover:bg-emerald-950 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
                    >
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>
                        {snapPopupTriggered
                          ? 'Jendela Midtrans Snap Aktif...'
                          : 'Buka Antarmuka Midtrans Snap'}
                      </span>
                    </button>

                    {currentOrder.redirect_url && (
                      <a
                        href={currentOrder.redirect_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3.5 px-5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-sm transition flex items-center justify-center gap-2"
                      >
                        <span>Buka Redirect URL Midtrans</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Sudah menyelesaikan pembayaran di jendela Midtrans?
                    </span>
                    <button
                      onClick={() => verifyOrderStatusFromBackend(currentOrder.order_reference)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:underline"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Cek Status Pembayaran dari Backend</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Case B: Supabase Edge Function not yet connected to live credentials */
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm">
                    <div className="font-bold flex items-center gap-2 text-base">
                      <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
                      <span>Menunggu Koneksi Backend Supabase Edge Function</span>
                    </div>
                    <p className="mt-2 leading-relaxed text-amber-900">
                      Sesuai aturan keamanan arsitektur, frontend tidak diperbolehkan menyimpan{' '}
                      <code>MIDTRANS_SERVER_KEY</code> ataupun membuat Snap Token palsu/tiruan.
                      Pesanan <strong>{currentOrder.order_reference}</strong> telah divalidasi di
                      frontend dan siap dikirim ke Supabase Edge Function{' '}
                      <code>create-midtrans-transaction</code> segera setelah environment{' '}
                      <code>VITE_SUPABASE_URL</code> &amp; <code>VITE_SUPABASE_ANON_KEY</code>{' '}
                      dikonfigurasi.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => navigateTo('ARCHITECTURE_DOCS')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition"
                    >
                      <FileCode2 className="w-4 h-4 text-amber-400" />
                      <span>Lihat Kode SQL &amp; Supabase Edge Functions</span>
                    </button>

                    <button
                      onClick={() => verifyOrderStatusFromBackend(currentOrder.order_reference)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition"
                    >
                      <span>Lanjut ke Halaman Status Transaksi (Tahap 8)</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            PAGE 8 — POST-PAYMENT RESULT PAGE (PAID / PENDING / FAILED)
        -------------------------------------------------------------------- */}
        {activePage === 'POST_PAYMENT' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm">
              {postPaymentState.isVerifying ? (
                <div className="py-12 text-center">
                  <RefreshCw className="w-10 h-10 text-emerald-800 animate-spin mx-auto mb-4" />
                  <h2 className="font-serif text-xl font-bold text-stone-900">
                    Memverifikasi Status Pembayaran dari Backend...
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Mengambil status otoritatif dari Supabase Edge Function (get-order-status).
                  </p>
                </div>
              ) : (
                <>
                  {/* Status Header Banner (A. PAID | B. PENDING | C. FAILED) */}
                  {postPaymentState.outcome === 'PAID' && (
                    <div className="text-center pb-6 border-b border-stone-200">
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                        Pembayaran Berhasil (PAID)
                      </span>
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-3">
                        Terima Kasih atas Pesanan Anda!
                      </h1>
                      <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
                        {postPaymentState.statusMessage}
                      </p>
                    </div>
                  )}

                  {postPaymentState.outcome === 'PENDING' && (
                    <div className="text-center pb-6 border-b border-stone-200">
                      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-9 h-9" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                        Menunggu Pembayaran / Verifikasi (PENDING)
                      </span>
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-3">
                        Transaksi Belum Selesai
                      </h1>
                      <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
                        {postPaymentState.statusMessage}
                      </p>
                    </div>
                  )}

                  {postPaymentState.outcome === 'FAILED' && (
                    <div className="text-center pb-6 border-b border-stone-200">
                      <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-9 h-9" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wider">
                        Pembayaran Gagal / Dibatalkan (FAILED)
                      </span>
                      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-3">
                        Transaksi Tidak Dapat Diselesaikan
                      </h1>
                      <p className="text-sm text-stone-600 mt-2 max-w-lg mx-auto">
                        {postPaymentState.statusMessage}
                      </p>
                    </div>
                  )}

                  {/* Transaction & Order Metadata */}
                  <div className="my-6 p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Referensi Pesanan</span>
                      <span className="font-mono font-bold text-stone-900">
                        {currentOrder?.order_reference || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Status Otoritatif Backend</span>
                      <span className="font-bold text-stone-900">
                        {postPaymentState.authoritativeStatus}
                      </span>
                    </div>
                    {postPaymentState.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">ID Transaksi Midtrans</span>
                        <span className="font-mono text-stone-800">
                          {postPaymentState.transactionId}
                        </span>
                      </div>
                    )}
                    {postPaymentState.paymentType && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">Kanal Pembayaran</span>
                        <span className="uppercase font-medium text-stone-800">
                          {postPaymentState.paymentType}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-stone-500">Sumber Verifikasi</span>
                      <span className="text-xs font-medium text-stone-700">
                        {postPaymentState.verificationSource}
                      </span>
                    </div>
                    {currentOrder && (
                      <div className="flex justify-between pt-2 border-t border-stone-200">
                        <span className="font-bold text-stone-900">Total Transaksi</span>
                        <span className="font-bold text-lg text-emerald-950">
                          {formatIDR(currentOrder.grand_total_idr)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Purchased Items List */}
                  {currentOrder?.items && (
                    <div className="mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                        Rincian Produk Pesanan
                      </h3>
                      <div className="space-y-2 border border-stone-200 rounded-xl p-4">
                        {currentOrder.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-stone-700">
                              {item.quantity}x {item.product_name}
                            </span>
                            <span className="font-semibold text-stone-900">
                              {formatIDR(item.subtotal_idr)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    {currentOrder?.order_reference && postPaymentState.outcome === 'PENDING' && (
                      <button
                        onClick={() => verifyOrderStatusFromBackend(currentOrder.order_reference)}
                        className="px-5 py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white text-sm font-semibold transition inline-flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Periksa Ulang Status Pembayaran</span>
                      </button>
                    )}

                    {postPaymentState.outcome === 'FAILED' && currentOrder && (
                      <button
                        onClick={() => navigateTo('SNAP_GATEWAY')}
                        className="px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition"
                      >
                        Coba Bayar Ulang
                      </button>
                    )}

                    <button
                      onClick={() => navigateTo('CATALOG')}
                      className="px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-900 text-sm font-semibold transition"
                    >
                      Kembali ke Toko
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            SUPABASE SCHEMA, EDGE FUNCTIONS & VALIDATION REPORT VIEW
        -------------------------------------------------------------------- */}
        {activePage === 'ARCHITECTURE_DOCS' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button
              onClick={() => navigateTo('CATALOG')}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Etalase Toko</span>
            </button>

            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    Backend & Payment Architecture Deliverables
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                    Supabase PostgreSQL, Edge Functions & Midtrans Snap
                  </h1>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 my-6">
                {[
                  { id: 'schema', label: '1. PostgreSQL Schema' },
                  { id: 'create_snap', label: '2. create-midtrans-transaction' },
                  { id: 'webhook', label: '3. midtrans-notification' },
                  { id: 'get_status', label: '4. get-order-status' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDocTab(tab.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                      activeDocTab === tab.id
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {tab.id === 'schema' && <Database className="w-4 h-4" />}
                    {tab.id === 'create_snap' && <Server className="w-4 h-4" />}
                    {tab.id === 'webhook' && <ShieldCheck className="w-4 h-4" />}
                    {tab.id === 'get_status' && <Package className="w-4 h-4" />}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Code Viewer */}
              <div className="relative rounded-2xl bg-stone-950 text-stone-100 p-4 sm:p-6 overflow-x-auto">
                <button
                  onClick={() =>
                    copyToClipboard(
                      activeDocTab === 'schema'
                        ? SUPABASE_SQL_SCHEMA
                        : activeDocTab === 'create_snap'
                        ? EDGE_FN_CREATE_SNAP
                        : activeDocTab === 'webhook'
                        ? EDGE_FN_WEBHOOK
                        : EDGE_FN_GET_STATUS,
                      activeDocTab
                    )
                  }
                  className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 transition"
                >
                  {copiedKey === activeDocTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>

                <pre className="text-xs font-mono leading-relaxed pt-6">
                  <code>
                    {activeDocTab === 'schema'
                      ? SUPABASE_SQL_SCHEMA
                      : activeDocTab === 'create_snap'
                      ? EDGE_FN_CREATE_SNAP
                      : activeDocTab === 'webhook'
                      ? EDGE_FN_WEBHOOK
                      : EDGE_FN_GET_STATUS}
                  </code>
                </pre>
              </div>

              {/* Required Secrets Checklist */}
              <div className="mt-6 p-5 rounded-2xl bg-stone-50 border border-stone-200">
                <h3 className="font-bold text-sm text-stone-900 mb-2">
                  Konfigurasi Environment & Secrets Wajib (Non-Hardcoded)
                </h3>
                <ul className="space-y-1.5 text-xs text-stone-700 font-mono">
                  <li>• Supabase Secret: MIDTRANS_SERVER_KEY = SB-Mid-server-xxxxxxxx</li>
                  <li>• Supabase Secret: MIDTRANS_IS_PRODUCTION = false</li>
                  <li>• Frontend Env: VITE_SUPABASE_URL = https://[project-ref].supabase.co</li>
                  <li>• Frontend Env: VITE_SUPABASE_ANON_KEY = eyJ...</li>
                  <li>• Frontend Env: VITE_MIDTRANS_CLIENT_KEY = SB-Mid-client-xxxxxxxx</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =====================================================================
          STOREFRONT FOOTER — VERIFIED BUSINESS INFORMATION
      ====================================================================== */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Business Identity */}
            <div>
              <div className="font-serif text-xl font-bold text-white">Asri Online Store</div>
              <div className="text-xs uppercase tracking-widest text-amber-400 mt-1">
                Asri Collection
              </div>
              <p className="mt-3 text-sm text-stone-400 leading-relaxed">
                Toko fashion online resmi yang menyediakan koleksi Pakaian, Sepatu, dan Tas
                berkualitas dari Makassar, Indonesia.
              </p>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                Kategori Produk
              </h3>
              <ul className="space-y-2 text-sm">
                {['Pakaian', 'Sepatu', 'Tas'].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat);
                        navigateTo('CATALOG');
                      }}
                      className="text-stone-400 hover:text-white transition"
                    >
                      Koleksi {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Verified Contact Details */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                Kontak & Layanan Pelanggan
              </h3>
              <ul className="space-y-2.5 text-sm text-stone-400">
                <li className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Makassar, Indonesia</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <a
                    href="mailto:asricollection82@gmail.com"
                    className="hover:text-white transition"
                  >
                    asricollection82@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>082156764434</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Senin–Sabtu, 09:00–17:00</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <div>
              © {new Date().getFullYear()} Asri Collection — Asri Online Store. Seluruh hak cipta
              dilindungi.
            </div>
            <div>Pembayaran diproses secara resmi melalui Midtrans Snap (IDR).</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
