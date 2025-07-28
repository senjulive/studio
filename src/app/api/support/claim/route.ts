
import { NextResponse } from 'next/server';

// This is a mock in-memory store for ticket claims
let ticketClaims: Record<string, any> = {};

export async function GET() {
    return NextResponse.json(ticketClaims);
}

export async function POST(req: Request) {
    const { supportUserId, action } = await req.json();
    // In a real app, we'd get the moderator's info from the session
    const moderator = { id: 'mod-user-id', username: 'SuperMod' };

    if (action === 'claim') {
        if (!ticketClaims[supportUserId]) {
            ticketClaims[supportUserId] = {
                user_id: supportUserId,
                handler_id: moderator.id,
                handler: { username: moderator.username }
            };
        }
    } else if (action === 'unclaim') {
        if (ticketClaims[supportUserId] && ticketClaims[supportUserId].handler_id === moderator.id) {
            delete ticketClaims[supportUserId];
        }
    }

    return NextResponse.json(ticketClaims[supportUserId] || null);
}
