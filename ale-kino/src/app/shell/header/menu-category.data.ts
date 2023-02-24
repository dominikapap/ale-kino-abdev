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
    href: '/user-profile/ticket-list'
  },
  {
    categoryName: 'chcę obejrzeć',
    href: '/user-profile/watchlist'
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
