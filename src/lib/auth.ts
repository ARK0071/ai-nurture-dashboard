
// This is a simplified auth library for demo purposes
// In a real application, you would use a proper auth provider

export type UserRole = 'caregiver' | 'nurse' | 'family';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

let currentUser: User | null = null;

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Mock login logic - would be replaced with actual auth
    if (email === 'nurse@example.com' && password === 'password') {
      currentUser = {
        id: '1',
        name: 'Jane Smith',
        email: 'nurse@example.com',
        role: 'nurse'
      };
      resolve(currentUser);
    } else if (email === 'family@example.com' && password === 'password') {
      currentUser = {
        id: '2',
        name: 'John Wilson',
        email: 'family@example.com',
        role: 'family'
      };
      resolve(currentUser);
    } else {
      reject(new Error('Invalid credentials'));
    }
  });
};

export const logout = (): void => {
  currentUser = null;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

export const hasRole = (roles: UserRole[]): boolean => {
  if (!currentUser) return false;
  return roles.includes(currentUser.role);
};
