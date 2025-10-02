import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-border py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-first grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Logo and description - spans full width on mobile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex-shrink-0 inline-block">
              <div className="rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg h-8 w-8 mb-4">
                <img
                  src="/alora-logo.png"
                  alt="Alora"
                  className="h-full w-full object-contain"
                />
              </div>
            </Link>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md">
              Connecting you with the best home service professionals in your
              area.
            </p>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4 text-muted-foreground">
              Company
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>
                <a
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-foreground transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/press"
                  className="hover:text-foreground transition-colors"
                >
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4 text-muted-foreground">
              Support
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>
                <a
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          {/* Legal links - positioned correctly on larger screens */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 lg:col-start-4">
            <h4 className="font-semibold text-base sm:text-lg mb-4 text-muted-foreground">
              Legal
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm sm:text-base">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie"
                  className="hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-border mt-8 sm:mt-10 pt-6 sm:pt-8 text-center text-muted-foreground">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Alora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
