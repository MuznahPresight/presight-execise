import type { User } from '../types';
import { getHobbyIcon } from '../utils/hobbyIcons';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const displayedHobbies = user.hobbies.slice(0, 2);
  const remainingHobbies = user.hobbies.length - displayedHobbies.length;

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-3 mb-3">
        <img
          src={user.avatar}
          alt={`${user.first_name} ${user.last_name}`}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect fill="%23e5e7eb" width="40" height="40"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-size="20" font-weight="bold"%3E%3F%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {user.first_name} {user.last_name}
          </h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
            <span>{user.nationality}</span>
            <span>{user.age} years</span>
          </div>
        </div>
      </div>

      <div className="mt-auto flex h-8 items-center gap-2 overflow-hidden">
        {displayedHobbies.map(hobby => (
          <span
            key={hobby}
            className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-sm text-blue-700"
            title={hobby}
          >
            <span>{getHobbyIcon(hobby)}</span>
            <span className="text-xs">{hobby}</span>
          </span>
        ))}
        {remainingHobbies > 0 && (
          <span className="inline-flex flex-none items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
            +{remainingHobbies}
          </span>
        )}
      </div>
    </div>
  );
}
