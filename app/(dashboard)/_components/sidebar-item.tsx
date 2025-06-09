'use client'
import React from 'react'
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (pathname === "/" && href === '/') || pathname === href || pathname?.startsWith(`${href}/`)
  const onClick = () => router.push(href)

  return (
    <button 
    onClick={onClick}
    type="button"
    className={cn(
      "group flex items-center gap-x-2 text-muted-foreground text-sm font-[500] pl-6 transition-all hover:text-foreground hover:bg-accent/50",
      isActive && "bg-accent text-primary hover:bg-accent hover:text-primary",
    )}
  >
    <div className="flex items-center gap-x-2 py-4">
      <Icon
        size={22}
        className={cn(
          "text-muted-foreground transition-colors",
          isActive && "text-primary",
          "group-hover:text-foreground",
        )}
      />
      {label}
    </div>
    <div
      className={cn(
        "ml-auto opacity-0 w-0.5 h-full transition-all",
        !isActive && "bg-transparent group-hover:bg-muted-foreground",
        isActive && "bg-primary",
        "group-hover:opacity-100",
        isActive && "opacity-100",
      )}
    />
    </button>
  )
}