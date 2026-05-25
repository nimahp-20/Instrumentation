import type { ComponentType, SVGProps } from 'react';
import {
  IconBox,
  IconHeart,
  IconLocation,
  IconLock,
  IconLogout,
  IconReturn,
  IconUser,
  IconWallet,
} from './ProfileIcons';

export type ProfileSection =
  | 'account'
  | 'orders'
  | 'returns'
  | 'favorites'
  | 'wallet'
  | 'addresses'
  | 'password';

export interface ProfileMenuItem {
  id: ProfileSection | 'logout';
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  { id: 'orders', label: 'سفارش‌های من', icon: IconBox },
  { id: 'returns', label: 'درخواست تعویض و مرجوع', icon: IconReturn },
  { id: 'favorites', label: 'لیست علاقه‌مندی‌ها', icon: IconHeart },
  { id: 'wallet', label: 'تراکنش‌های کیف پول', icon: IconWallet },
  { id: 'addresses', label: 'لیست آدرس‌ها', icon: IconLocation },
  { id: 'password', label: 'عملیات رمز عبور', icon: IconLock },
  { id: 'account', label: 'اطلاعات حساب کاربری', icon: IconUser },
];

export const PROFILE_LOGOUT_ITEM: ProfileMenuItem = {
  id: 'logout',
  label: 'خروج',
  icon: IconLogout,
};

export const PROFILE_SECTION_TITLES: Record<ProfileSection, string> = {
  account: 'اطلاعات حساب کاربری',
  orders: 'سفارش‌های من',
  returns: 'درخواست تعویض و مرجوع',
  favorites: 'لیست علاقه‌مندی‌ها',
  wallet: 'تراکنش‌های کیف پول',
  addresses: 'لیست آدرس‌ها',
  password: 'عملیات رمز عبور',
};
