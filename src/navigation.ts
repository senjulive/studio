import {
  createLocalizedPathnamesNavigation
} from 'next-intl/navigation';
import {locales} from './i18n-config';

export const localePrefix = 'always'; // Default

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same path, use the
  // special `/` key.
  '/': '/',
  '/dashboard': '/dashboard',
} satisfies Record<string, any>;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales, localePrefix, pathnames});
