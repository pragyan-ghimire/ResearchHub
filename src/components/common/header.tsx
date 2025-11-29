"use client";

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookCheck, LogIn, LogOut, Upload, UserPlus, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { href: '/bookmarks', label: 'Bookmarks', icon: BookCheck },
  { href: '/upload', label: 'Upload', icon: Upload },
];

export default function Header() {
  
  const {status, data: session} = useSession();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="ml-10 hidden items-center space-x-6 text-sm font-medium md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          {status === "authenticated" && <UserMenu username={session?.user?.name} email={session?.user?.email} image = {session?.user?.image} />}
          {status === "unauthenticated" && 
          <>
            <Link href="/api/auth/signin">
              <span>Login</span>
            </Link>
            <Link href="/signup">
              <span>Sign Up</span>
            </Link>
          </>
          }
          
        </div>
      </div>
    </header>
  );
}

function UserMenu({username, email, image}: {username?: string | null; email?: string | null; image?: string| null}) {
  const avatarSrc =
    image && image.trim() !== "" ? image : "/placeholder-user.png"
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarSrc} alt="User avatar" />
            <AvatarFallback>
              {username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{username}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>  
              <Link href="/api/auth/signout">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
