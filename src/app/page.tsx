import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n-config';
 
// This page only renders for the root `/` URL
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
