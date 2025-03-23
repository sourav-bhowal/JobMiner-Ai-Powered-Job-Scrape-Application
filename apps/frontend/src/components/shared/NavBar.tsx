import Link from "next/link";
import { navLinks } from "@/src/utils/NavLinks";
import { Button } from "@workspace/ui/components/button";
import MobileNavBar from "./MobileNavBar";

// NavBar component
export default function NavBar() {
  return (
    <nav className="bg-neutral-900 text-white w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold border-b-3 border-primary">
                JobNest
                <span className="text-primary">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:block">
            <div className="flex items-center">
              <div className="ml-10 flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-primary border-b-2 border-transparent hover:border-primary
                  transition duration-300 ease-in-out"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="ml-10 flex items-center space-x-4">
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

          {/* Mobile Navigation */}
          <MobileNavBar />
        </div>
      </div>
    </nav>
  );
}
