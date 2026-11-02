export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface FilterCounts {
  value: string;
  count: number;
}

export interface UsersResponse {
  items: User[];
  total: number;
  hobbies: FilterCounts[];
  nationalities: FilterCounts[];
  page: number;
  limit: number;
  hasMore: boolean;
}

export const MAX_SEARCH_LENGTH = 50;
export const MAX_FILTER_VALUES = 20;

export interface FilterState {
  search: string;
  selectedHobbies: string[];
  selectedNationalities: string[];
  sortField: 'first_name' | 'last_name' | 'age' | 'nationality';
  sortDirection: 'asc' | 'desc';
}

export type UsersError = 'invalid_filters' | 'connection' | 'service';
