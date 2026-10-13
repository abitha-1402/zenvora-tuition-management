export const STORAGE_KEYS = {
  STUDENTS: 'zenvora_students_v1',
  TEACHERS: 'zenvora_teachers_v1',
  COURSES: 'zenvora_courses_v1',
  BATCHES: 'zenvora_batches_v1',
  ATTENDANCE: 'zenvora_attendance_v1',
  FEES: 'zenvora_fees_v1',
  TIMETABLE: 'zenvora_timetable_v1',
  ANNOUNCEMENTS: 'zenvora_announcements_v1',
  AUTH: 'zenvora_current_user_v1'
} as const;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Failed to read ${key} from localStorage, using fallback:`, err);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write ${key} to localStorage:`, err);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error(`Failed to remove ${key} from localStorage:`, err);
  }
}

export function clearAllZenvoraStorage(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
