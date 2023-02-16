import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthStateService } from 'src/app/auth/auth.state.service';
import {
  MENU_CATEGORIES_USER,
  MENU_CATEGORIES_ADMIN,
  MENU_CATEGORIES_GUEST,
} from './menu-category.data';

export type MenuCategory = {
  categoryName: string;
  href?: string;
};

export type SideMenuState = {
  menuCategories: MenuCategory[];
  shoppingCartVisible: boolean;
};

const defaultSideMenuData = {
  menuCategories: [],
  shoppingCartVisible: false,
};

@Injectable({
  providedIn: 'root',
})
export class HeaderNavService {
  private authStateService = inject(AuthStateService);

  private setupState$$ = new BehaviorSubject<SideMenuState>(
    defaultSideMenuData
  );

  get setupState$() {
    return this.setupState$$.asObservable();
  }

  get setupStateValue() {
    return this.setupState$$.value;
  }

  private patchState(stateSlice: Partial<SideMenuState>) {
    this.setupState$$.next({
      ...this.setupStateValue,
      ...stateSlice,
    });
  }

  constructor() {
    this.authStateService.auth$.subscribe((user) => {
      if (user.role === 'user') {
        this.patchState({
          menuCategories: MENU_CATEGORIES_USER,
          shoppingCartVisible: true,
        });
      } else if (user.role === 'admin') {
        this.patchState({ menuCategories: MENU_CATEGORIES_ADMIN });
      } else if (user.role === 'guest') {
        this.patchState({
          menuCategories: MENU_CATEGORIES_GUEST,
          shoppingCartVisible: true,
        });
      }
    });
  }
}
