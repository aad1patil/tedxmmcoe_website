export type Role =
    | 'Faculty'
    | 'Licensee / Head'
    | 'Co-Head'
    | 'Curation Team'
    | 'Design Team'
    | 'Outreach Team'
    | 'Production Team'
    | 'Logistics Team'
    | 'Speaker'
    | 'Attendee';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    teamRole?: 'Head' | 'Co-Head' | 'Member';
}

export interface Speaker {
    id: string;
    name: string;
    bio: string;
    image: string;
    topic?: string;
}
