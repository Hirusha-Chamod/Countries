
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
              ExploreWorld
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Powered by REST Countries API
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Navigation
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/countries"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Countries
                  </Link>
                </li>
                <li>
                  <Link
                    to="/regions"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Regions
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://restcountries.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    REST Countries API
                  </a>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} ExploreWorld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
