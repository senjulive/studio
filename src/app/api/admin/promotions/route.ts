'use server';

import {createAdminClient} from '@/lib/supabase/admin';
import {NextResponse} from 'next/server';
import {logModeratorAction} from '@/lib/moderator';

// POST - Create a new promotion
export async function POST(request: Request) {
  try {
    const {title, description, status, image_url} = await request.json();

    if (!title || !description || !status) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    const supabaseAdmin = createAdminClient();

    const {data, error} = await supabaseAdmin
      .from('promotions')
      .insert({title, description, status, image_url})
      .select()
      .single();

    if (error) throw error;

    await logModeratorAction(`Created promotion: ${title}`);
    return NextResponse.json({success: true, data});
  } catch (error: any) {
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}

// PUT - Update an existing promotion
export async function PUT(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {error: 'Promotion ID is required'},
        {status: 400}
      );
    }

    const {title, description, status, image_url} = await request.json();
    if (!title || !description || !status) {
      return NextResponse.json(
        {error: 'Missing required fields'},
        {status: 400}
      );
    }

    const supabaseAdmin = createAdminClient();

    const {data, error} = await supabaseAdmin
      .from('promotions')
      .update({title, description, status, image_url})
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await logModeratorAction(`Updated promotion: ${title}`);
    return NextResponse.json({success: true, data});
  } catch (error: any) {
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}

// DELETE - Delete a promotion
export async function DELETE(request: Request) {
  try {
    const {promotionId} = await request.json();

    if (!promotionId) {
      return NextResponse.json(
        {error: 'Promotion ID is required'},
        {status: 400}
      );
    }

    const supabaseAdmin = createAdminClient();

    const {data: promoToDelete, error: fetchError} = await supabaseAdmin
      .from('promotions')
      .select('title')
      .eq('id', promotionId)
      .single();

    if (fetchError) throw fetchError;

    const {error} = await supabaseAdmin
      .from('promotions')
      .delete()
      .eq('id', promotionId);

    if (error) throw error;

    await logModeratorAction(`Deleted promotion: ${promoToDelete.title}`);
    return NextResponse.json({success: true});
  } catch (error: any) {
    return NextResponse.json(
      {error: error.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
