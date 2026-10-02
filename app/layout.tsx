import type { Metadata } from 'next';
import { Inter, Geist } from 'next/font/google';
import { AppProviders } from '@/app/providers';
import { Toaster } from '@/shared/ui/sonner';
import './globals.css';
import { cn } from "@/shared/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Info Map — Справочник организаций',
  description: 'SPA для управления организациями, зданиями и видами деятельности',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="ru" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
      <AppProviders>{children}</AppProviders>
      <Toaster richColors position="top-right" />
      </body>
      </html>
  );
}