import { MenuCategory } from "./header-nav.service";

export const MENU_CATEGORIES_GUEST: MenuCategory[] = [
  {
    categoryName: 'zaloguj',
    href: '/login'
  },
];

export const MENU_CATEGORIES_USER: MenuCategory[] = [
  {
    categoryName: 'moje bilety',
  },
  {
    categoryName: 'chcę obejrzeć',
  },
  {
    categoryName: 'ustawienia',
  },
  {
    categoryName: 'wyloguj',
  },
];

export const MENU_CATEGORIES_ADMIN: MenuCategory[] = [
  {
    categoryName: 'dashboard',
    href: 'dashboard',
  },
  {
    categoryName: 'wyloguj',
    href: 'auth',
  },
];
