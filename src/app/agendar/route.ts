import { config } from '@/lib/config';
import { redirect } from 'next/navigation';

export async function GET() {
  redirect(config.whatsappLinkInstagram);
}
