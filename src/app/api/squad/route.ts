
import { NextResponse } from 'next/server';
// Since we removed Supabase, we can no longer get the current user from cookies this way.
// The app will function in a mock state. We'll return a mock squad.

export type SquadMember = {
    id: string;
    username: string | null;
    team: SquadMember[];
};

const mockSquad: SquadMember[] = [
    {
        id: 'mock-member-1',
        username: 'SquadMemberOne',
        team: [
            { id: 'mock-sub-member-1', username: 'SubMemberOne', team: [] }
        ]
    },
    {
        id: 'mock-member-2',
        username: 'SquadMemberTwo',
        team: []
    }
]

export async function GET(request: Request) {
    // Return mock data because there is no database to query.
    return NextResponse.json(mockSquad);
}
