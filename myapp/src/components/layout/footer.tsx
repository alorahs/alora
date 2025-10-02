import { Img } from "react-image";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex-shrink-0 inline-block">
              <Img
                src="/alora-logo.png"
                alt="Alora"
                width={120}
                height={40}
                className="h-8 w-auto mb-4 brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 text-sm sm:text-base max-w-md">
              Connecting you with the best home service professionals in your
              area.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-white transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a href="/press" className="hover:text-white transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1 lg:col-start-2">
            <h4 className="font-semibold text-base sm:text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/cookie"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center text-gray-400">
          <p className="text-sm sm:text-base">
            &copy; 2024 Alora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
