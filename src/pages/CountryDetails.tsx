import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { countryAPI } from "../api/country";
import { useAuth } from "../context/AuthContext";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
type Country = {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  cca3: string;
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area: number;
  languages?: {
    [key: string]: string;
  };
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  borders?: string[];
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png: string;
    svg: string;
  };
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
};

const CapitalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const RegionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PopulationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const AreaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    />
  </svg>
);

const LanguageIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const BorderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

const MapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
    />
  </svg>
);

const CoatOfArmsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const BackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-2"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export default function CountryDetail() {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(true);
  const [borderCountries, setBorderCountries] = useState<
    { name: string; code: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if country is in favorites when component mounts
    const checkFavorite = async () => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setIsFavorite(userData?.favoriteCountries?.includes(code) || false);
      } catch (error) {
        console.error("Error checking favorites:", error);
      }
    };

    checkFavorite();
  }, [code, user]);

  const toggleFavorite = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      let favoriteCountries = userData?.favoriteCountries || [];

      if (isFavorite) {
        favoriteCountries = favoriteCountries.filter((c: string) => c !== code);
      } else {
        favoriteCountries = [...favoriteCountries, code];
      }

      await updateDoc(userRef, {
        favoriteCountries: favoriteCountries,
      });

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  useEffect(() => {
    const fetchCountry = async () => {
      if (!code) {
        setError("No country code provided");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching country with code: ${code}`);
        const countryData = await countryAPI.getCountryByCode(code);
        console.log("Country data received:", countryData);

        if (!countryData || !countryData.name) {
          throw new Error("Invalid country data received");
        }

        setCountry(countryData);

        if (countryData.borders && countryData.borders.length > 0) {
          console.log("Fetching border countries:", countryData.borders);
          const bordersData = await countryAPI.getCountriesByCodes(
            countryData.borders
          );
          console.log("Border countries data:", bordersData);

          if (Array.isArray(bordersData)) {
            setBorderCountries(
              bordersData.map((c: any) => ({
                name: c.name.common,
                code: c.cca3,
              }))
            );
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching country:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchCountry();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse flex items-center text-xl">
          <svg
            className="animate-spin h-8 w-8 mr-3 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading country data...
        </div>
      </div>
    );
  }

  if (error || !country) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col bg-gray-50 dark:bg-gray-900">
        <div className="text-red-600 text-6xl mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
          Country not found
        </p>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <Link
          to="/countries"
          className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <BackIcon /> Back to all countries
        </Link>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/countries"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline transition-colors"
          >
            <BackIcon /> Back to all countries
          </Link>

          {/* Add Favorite Button */}
          <button
            onClick={toggleFavorite}
            className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
              isFavorite
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                isFavorite
                  ? "text-gray-900"
                  : "text-gray-600 dark:text-gray-300"
              }`}
              viewBox="0 0 20 20"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-2">
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg
                className="w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M0,0 L100,0 L100,100 Z" fill="currentColor" />
              </svg>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {country.name.common}
                </h1>
                <h2 className="text-xl opacity-90 mt-1">
                  {country.name.official}
                </h2>
                <div className="mt-3 flex items-center">
                  <span className="text-sm bg-white/20 px-2 py-1 rounded-full font-medium">
                    {country.cca2} / {country.cca3}
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                {country.flags && (
                  <div className="relative">
                    <img
                      src={country.flags.svg || country.flags.png}
                      alt={
                        country.flags.alt || `Flag of ${country.name.common}`
                      }
                      width={160}
                      height={100}
                      className="border-2 border-white rounded-md shadow-lg"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-700 text-xs text-white px-2 py-1 rounded-full shadow">
                      Flag
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Two Columns */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Essential Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Key Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm divide-y divide-gray-200 dark:divide-gray-700">
                <div className="flex items-center py-3">
                  <CapitalIcon />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Capital
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {country.capital?.[0] || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-3">
                  <RegionIcon />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Region
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {country.region}{" "}
                      {country.subregion && `(${country.subregion})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-3">
                  <PopulationIcon />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Population
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(country.population)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-3">
                  <AreaIcon />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Area
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(country.area)} km²
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-3">
                  <LanguageIcon />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Languages
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {country.languages
                        ? Object.values(country.languages).join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center py-3">
                  <CurrencyIcon />
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Currencies
                    </span>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {country.currencies
                        ? Object.entries(country.currencies)
                            .map(
                              ([code, currency]) =>
                                `${currency.name} (${currency.symbol || code})`
                            )
                            .join(", ")
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Maps links */}
                <div className="pt-3">
                  {country.maps?.googleMaps && (
                    <a
                      href={country.maps.googleMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors mt-2"
                    >
                      <MapIcon />
                      View on Google Maps
                    </a>
                  )}

                  {country.maps?.openStreetMaps && (
                    <a
                      href={country.maps.openStreetMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors mt-2 ml-2"
                    >
                      <MapIcon />
                      View on OpenStreetMap
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Coat of Arms */}
              {country.coatOfArms &&
                (country.coatOfArms.png || country.coatOfArms.svg) && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 flex items-center">
                      <CoatOfArmsIcon />
                      Coat of Arms
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm flex justify-center items-center">
                      <img
                        src={country.coatOfArms.svg || country.coatOfArms.png}
                        alt={`Coat of arms of ${country.name.common}`}
                        width={150}
                        height={150}
                        className="object-contain max-h-48"
                      />
                    </div>
                  </div>
                )}

              {/* Border Countries */}
              {borderCountries.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 flex items-center">
                    <BorderIcon />
                    Border Countries
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm">
                    <div className="flex flex-wrap gap-2">
                      {borderCountries.map((border) => (
                        <Link
                          key={border.code}
                          to={`/countries/${border.code}`}
                          className="px-3 py-2 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1 text-blue-600 dark:text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 5l7 7-7 7M5 5l7 7-7 7"
                            />
                          </svg>
                          {border.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Country Code Card */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white border-b pb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  Country Codes
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded shadow-sm">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ISO Alpha-2
                    </span>
                    <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                      {country.cca2}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-gray-800 rounded shadow-sm">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ISO Alpha-3
                    </span>
                    <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                      {country.cca3}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-850 p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            Data provided by the{" "}
            <a
              href="https://restcountries.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              REST Countries API
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
