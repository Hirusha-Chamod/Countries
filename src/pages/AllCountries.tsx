import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { countryAPI } from "../api/country";

type Country = {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  capital?: string[];
  region: string;
  population: number;
  cca3: string;
};

export default function CountriesPage() {
  const [, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "population" | "region">(
    "name"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const regions = [
    "Africa",
    "Americas",
    "Asia",
    "Europe",
    "Oceania",
    "Antarctic",
  ];

  const fetchCountries = async () => {
    setLoading(true);
    try {
      let data;

      if (regionFilter && !searchQuery) {
        data = await countryAPI.getCountriesByRegion(regionFilter);
      } else if (searchQuery && !regionFilter) {
        data = await countryAPI.searchCountries(searchQuery);
      } else {
        data = await countryAPI.getAllCountries();
      }

      const sortedCountries = data.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );

      setCountries(sortedCountries);

      if (searchQuery && regionFilter) {
        const filtered = sortedCountries.filter(
          (country: { region: string }) => country.region === regionFilter
        );
        setFilteredCountries(filtered);
      } else {
        setFilteredCountries(sortedCountries);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountries([]);
      setFilteredCountries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [searchQuery, regionFilter]);

  useEffect(() => {
    const query = searchParams.get("search");
    const region = searchParams.get("region");

    if (query) setSearchQuery(query);
    if (region) setRegionFilter(region);
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (regionFilter) params.set("region", regionFilter);

    setSearchParams(params);
  }, [searchQuery, regionFilter, setSearchParams]);

  // Sort countries based on selected criteria
  const sortedCountries = [...filteredCountries].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.name.common.localeCompare(b.name.common)
        : b.name.common.localeCompare(a.name.common);
    } else if (sortBy === "population") {
      return sortOrder === "asc"
        ? a.population - b.population
        : b.population - a.population;
    } else {
      return sortOrder === "asc"
        ? a.region.localeCompare(b.region)
        : b.region.localeCompare(a.region);
    }
  });

  // Toggle sort order
  const handleSort = (criteria: "name" | "population" | "region") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section with Background */}
        <div className="relative mb-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0,0 L100,0 L100,100 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="relative z-10 px-8 py-12 text-white">
            <h1 className="text-4xl font-bold mb-2">Explore Countries</h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Discover detailed information about countries around the world,
              their cultures, capitals, and more.
            </p>

            {/* Back to Homepage Button */}
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium bg-white text-blue-700 rounded-md hover:bg-blue-50 transition-all shadow-sm hover:shadow focus:ring-4 focus:ring-blue-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to HomePage
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Input */}
            <div className="relative">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Search Countries
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search for a country..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Region Filter Dropdown */}
            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Filter by Region
              </label>
              <select
                id="region"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* View Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Options
              </label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                    aria-label="Grid view"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                    aria-label="List view"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSort("name")}
                    className={`px-3 py-1 text-xs rounded-md ${
                      sortBy === "name"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Name{" "}
                    {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSort("population")}
                    className={`px-3 py-1 text-xs rounded-md ${
                      sortBy === "population"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Population{" "}
                    {sortBy === "population" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                  <button
                    onClick={() => handleSort("region")}
                    className={`px-3 py-1 text-xs rounded-md ${
                      sortBy === "region"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    Region{" "}
                    {sortBy === "region" && (sortOrder === "asc" ? "↑" : "↓")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Stats */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600 dark:text-gray-400 font-medium">
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
              {sortedCountries.length}
            </span>{" "}
            {sortedCountries.length === 1 ? "country" : "countries"} found
          </div>

          {/* Clear Filters Button - Only show when filters are active */}
          {(searchQuery || regionFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setRegionFilter("");
              }}
              className="inline-flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear filters
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading countries...
            </p>
          </div>
        )}

        {/* Countries Grid View */}
        {!loading && viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedCountries.map((country) => (
              <Link
                to={`/countries/${country.cca3}`}
                key={country.cca3}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Flag Image with Overlay */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={country.flags.png || country.flags.svg}
                    alt={country.flags.alt || `Flag of ${country.name.common}`}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <span className="text-white font-bold px-4 py-2 text-lg">
                      {country.name.common}
                    </span>
                  </div>
                </div>

                {/* Country Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {country.name.common}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-24 text-gray-500 dark:text-gray-400 text-sm">
                        Capital:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium text-sm">
                        {country.capital?.[0] || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-24 text-gray-500 dark:text-gray-400 text-sm">
                        Region:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium text-sm">
                        {country.region}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-24 text-gray-500 dark:text-gray-400 text-sm">
                        Population:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium text-sm">
                        {new Intl.NumberFormat().format(country.population)}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline">
                      View details
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Countries List View */}
        {!loading && viewMode === "list" && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Flag
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Capital
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Region
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Population
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedCountries.map((country) => (
                    <tr
                      key={country.cca3}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-8 w-12 overflow-hidden rounded-sm">
                          <img
                            src={country.flags.png || country.flags.svg}
                            alt={
                              country.flags.alt ||
                              `Flag of ${country.name.common}`
                            }
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {country.name.common}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {country.name.official}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {country.capital?.[0] || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {country.region}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {new Intl.NumberFormat().format(country.population)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/countries/${country.cca3}`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && sortedCountries.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-gray-600 dark:text-gray-300 text-xl font-medium mb-4">
              No countries found matching your criteria
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setRegionFilter("");
              }}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
