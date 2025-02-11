export interface Group {
  id: string;
  name: string;
  members: string[];
}

export type CreateGroupPayload = Omit<Group, 'id'>;