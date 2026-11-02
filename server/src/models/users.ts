import db from '../db/index.js';

export interface User {
  id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  age: number;
  nationality: string;
  hobbies: string[];
}

export interface Filters {
  search?: string;
  nationalities: string[];
  hobbies: string[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface FilterCounts {
  value: string;
  count: number;
}

export interface FindUsersResult {
  items: User[];
  total: number;
  hobbies: FilterCounts[];
  nationalities: FilterCounts[];
}

export function findUsers(
  filters: Filters,
  limit: number,
  offset: number
): FindUsersResult {
  const {
    search = '',
    nationalities = [],
    hobbies = [],
    sortField = 'first_name',
    sortDirection = 'asc',
  } = filters;

  const whereConditions: string[] = [];
  const params: any[] = [];

  if (search) {
    whereConditions.push(
      `(u.first_name LIKE ? OR u.last_name LIKE ?)`
    );
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern);
  }

  if (nationalities.length > 0) {
    const placeholders = nationalities.map(() => '?').join(',');
    whereConditions.push(`u.nationality IN (${placeholders})`);
    params.push(...nationalities);
  }

  if (hobbies.length > 0) {
    const hobbyPlaceholders = hobbies.map(() => '?').join(',');
    whereConditions.push(
      `u.id IN (
        SELECT user_id FROM user_hobbies uh
        JOIN hobbies h ON uh.hobby_id = h.id
        WHERE h.name IN (${hobbyPlaceholders})
        GROUP BY user_id
        HAVING COUNT(DISTINCT h.id) = ${hobbies.length}
      )`
    );
    params.push(...hobbies);
  }

  const whereClause = whereConditions.length > 0
    ? ` WHERE ${whereConditions.join(' AND ')}`
    : '';

  const countStmt = db.prepare(
    `SELECT COUNT(*) as count FROM users u${whereClause}`
  );
  const { count: total } = countStmt.get(...params) as { count: number };

  const validSortFields = ['first_name', 'last_name', 'age', 'nationality'];
  const safeSortField = validSortFields.includes(sortField) ? sortField : 'first_name';
  const safeDirection = sortDirection === 'desc' ? 'DESC' : 'ASC';

  const usersStmt = db.prepare(
    `SELECT u.id, u.avatar, u.first_name, u.last_name, u.age, u.nationality
     FROM users u
     ${whereClause}
     ORDER BY u.${safeSortField} ${safeDirection}, u.id ASC
     LIMIT ? OFFSET ?`
  );

  const users = usersStmt.all(...params, limit, offset) as Array<Omit<User, 'hobbies'>>;

  const userIds = users.map(u => u.id);
  const userHobbiesMap = new Map<number, string[]>();

  if (userIds.length > 0) {
    const placeholders = userIds.map(() => '?').join(',');
    const hobbiesStmt = db.prepare(
      `SELECT uh.user_id, h.name
       FROM user_hobbies uh
       JOIN hobbies h ON uh.hobby_id = h.id
       WHERE uh.user_id IN (${placeholders})`
    );

    const hobbiesResult = hobbiesStmt.all(...userIds) as Array<{
      user_id: number;
      name: string;
    }>;

    for (const row of hobbiesResult) {
      if (!userHobbiesMap.has(row.user_id)) {
        userHobbiesMap.set(row.user_id, []);
      }
      userHobbiesMap.get(row.user_id)!.push(row.name);
    }
  }

  const items: User[] = users.map(u => ({
    ...u,
    hobbies: userHobbiesMap.get(u.id) || [],
  }));

  const topHobbiesParams = [...params];
  const topHobbiesStmt = db.prepare(
    `SELECT h.name as value, COUNT(*) as count
     FROM hobbies h
     JOIN user_hobbies uh ON h.id = uh.hobby_id
     JOIN users u ON uh.user_id = u.id
     ${whereClause}
     GROUP BY h.id, h.name
     ORDER BY count DESC
     LIMIT 20`
  );
  const hobbiesCounts = topHobbiesStmt.all(...topHobbiesParams) as FilterCounts[];

  const topNationalitiesParams = [...params];
  const topNationalitiesStmt = db.prepare(
    `SELECT DISTINCT u.nationality as value, COUNT(*) as count
     FROM users u
     ${whereClause}
     GROUP BY u.nationality
     ORDER BY count DESC
     LIMIT 20`
  );
  const nationalitiesCounts = topNationalitiesStmt.all(...topNationalitiesParams) as FilterCounts[];

  return {
    items,
    total,
    hobbies: hobbiesCounts,
    nationalities: nationalitiesCounts,
  };
}
