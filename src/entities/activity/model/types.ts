export interface Activity {
  id: number;
  name: string;
  parent_id: number | null;
  children?: Activity[];
}