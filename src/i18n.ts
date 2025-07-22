import {getRequestConfig} from 'next-intl/server';
import type {LocalePrefix} from 'next-intl/routing';

export const locales = ['en', 'es', 'fr', 'zh', 'ru'];
 
export const localePrefix: LocalePrefix = 'always';
 
export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`../messages/${locale}.json`)).default
}));
