"use client";
import { Menu, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useEffect, useRef, useState } from "react";
import { navLinks } from "@/src/utils/NavLinks";
import Link from "next/link";
import { gsap } from "gsap";

export default function MobileNavBar() {
  // State to toggle the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Refs for the menu and links
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle the menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Animation setup
  useEffect(() => {
    if (!menuRef.current) return;

    const menuHeight = menuRef.current.scrollHeight; // Get the full height of the menu

    if (isMenuOpen) {
      // Open animation
      gsap.fromTo(
        menuRef.current,
        { height: 0, opacity: 0 },
        { height: menuHeight, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    } else {
      // Close animation
      gsap.to(menuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          if (menuRef.current) {
            menuRef.current.style.height = ""; // Reset height for next open
          }
        },
      });
    }
  }, [isMenuOpen]);

  // Return the mobile nav bar
  return (
    <>
      <div className="xl:hidden">
        <Button
          type="button"
          size={"icon"}
          className="inline-flex items-center justify-center p-2 rounded-md text-neutral-900 focus:outline-none"
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          {isMenuOpen ? (
            <X className="block h-6 w-6" />
          ) : (
            <Menu className="block h-6 w-6" />
          )}
        </Button>
      </div>
      {/* Mobile menu, show/hide based on menu state */}
      <div
        ref={menuRef}
        className="xl:hidden fixed left-0 right-0 top-16 bg-neutral-900 z-50 overflow-hidden"
        style={{ height: 0, opacity: 0 }} // Initial closed state
      >
        <div className="flex flex-col">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="px-4 py-4 hover:text-primary transition duration-300 ease-in-out"
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex space-x-4 p-4">
            <Button
              size={"lg"}
              className="bg-transparent border-2 border-primary font-semibold shadow-md hover:bg-transparent hover:shadow-primary transition-shadow duration-300 ease-in-out"
            >
              SignIn
            </Button>
            <Button
              size={"lg"}
              className="text-neutral-900 font-semibold shadow-md hover:shadow-primary transition-shadow duration-300 ease-in-out"
            >
              SignUp
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
