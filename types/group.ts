import { User } from "./user";

export interface Group {
  id: string;
  name: string;
  members: User[];
}

export interface CreateGroupPayload {
  name: string;
  members: string[];
};