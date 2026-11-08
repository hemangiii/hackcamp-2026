export interface SchoolRecord {
  id: number;
  name: string;
  emailDomain: string;
}

export interface SchoolRepository {
  mustFind(id: number): SchoolRecord;
  list(): SchoolRecord[];
}
