import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kgwehgvokxhlgvkhygsx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ticket ID' }, { status: 400 });
    }

    if (!supabaseServiceKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create a Supabase client with the service role key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select(`
        id, 
        user_name,
        events (
          event_name,
          event_date,
          time_slot,
          price,
          image_url
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Ticket not found or invalid ID' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
