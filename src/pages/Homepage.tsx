import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

type Country = {
  name: {
    common: string;
  };
  flags: {
    svg?: string;
    png?: string;
  };
  capital?: string[];
  region: string;
  population: number;
  cca3: string;
};

export default function HomePage() {
  const [featuredCountries, setFeaturedCountries] = useState<Country[]>([]);
  const [favoriteCountries, setFavoriteCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch  countries for the featured section
  useEffect(() => {
    const fetchFeaturedCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        if (!response.ok) throw new Error("Failed to fetch countries");

        const data = await response.json();

        const randomCountries = data
          .sort(() => 0.5 - Math.random())
          .slice(0, 6);

        setFeaturedCountries(randomCountries);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchFeaturedCountries();
  }, []);

  useEffect(() => {
    const fetchFavoriteCountries = async () => {
      if (!user) {
        setFavoriteCountries([]);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.favoriteCountries?.length) {
          const favoritesResponse = await fetch(
            `https://restcountries.com/v3.1/alpha?codes=${userData.favoriteCountries.join(
              ","
            )}`
          );
          if (!favoritesResponse.ok)
            throw new Error("Failed to fetch favorite countries");

          const favoritesData = await favoritesResponse.json();
          setFavoriteCountries(favoritesData);
        }
      } catch (error) {
        console.error("Error fetching favorite countries:", error);
      }
    };

    fetchFavoriteCountries();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-80"
            style={{ backgroundImage: "url('src/assets/bg-home.jpg')" }}
          ></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Discover Our World
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mb-10">
              Explore detailed information about countries, cultures, languages,
              and more from all around the globe
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              {[
                { value: "200+", label: "Countries" },
                { value: "7", label: "Continents" },
                { value: "6,500+", label: "Languages" },
                { value: "8 Billion+", label: "People" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Favorite Countries Section  */}
        {user && favoriteCountries.length > 0 && (
          <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Your Favorite Countries
                </h2>
                <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  Quick access to your bookmarked countries
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteCountries.map((country) => (
                  <Link
                    to={`/countries/${country.cca3}`}
                    key={country.cca3}
                    className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 relative">
                      <div className="absolute inset-0">
                        <img
                          src={
                            country.flags.svg ||
                            country.flags.png ||
                            "/fallback-image.png"
                          }
                          alt={`Flag of ${country.name.common}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                        {country.name.common}
                      </h3>
                      <div className="mt-2 text-gray-600 dark:text-gray-300">
                        <p>
                          <strong>Capital:</strong>{" "}
                          {country.capital?.[0] || "N/A"}
                        </p>
                        <p>
                          <strong>Region:</strong> {country.region}
                        </p>
                        <p>
                          <strong>Population:</strong>{" "}
                          {country.population.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Countries Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Featured Countries
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                Explore some interesting countries from around the world
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="loader">Loading...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCountries.map((country) => (
                  <Link
                    to={`/countries/${country.cca3}`}
                    key={country.cca3}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="h-40 relative">
                      <div className="absolute inset-0">
                        <img
                          src={
                            country.flags.svg ||
                            country.flags.png ||
                            "/fallback-image.png"
                          }
                          alt={`Flag of ${country.name.common}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                        {country.name.common}
                      </h3>
                      <div className="mt-2 text-gray-600 dark:text-gray-300">
                        <p>
                          <strong>Capital:</strong>{" "}
                          {country.capital?.[0] || "N/A"}
                        </p>
                        <p>
                          <strong>Region:</strong> {country.region}
                        </p>
                        <p>
                          <strong>Population:</strong>{" "}
                          {country.population.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                to="/countries"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                View All Countries
              </Link>
            </div>
          </div>
        </section>

        {/* Regions Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Explore by Region
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                Discover countries from different parts of the world
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                "Africa",
                "Americas",
                "Asia",
                "Europe",
                "Oceania",
                "Antarctic",
              ].map((region) => (
                <Link
                  to={`/countries?region=${region}`}
                  key={region}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center"
                >
                  <div className="text-3xl mb-2">
                    {region === "Africa" && "🌍"}
                    {region === "Americas" && "🌎"}
                    {region === "Asia" && "🌏"}
                    {region === "Europe" && "🏰"}
                    {region === "Oceania" && "🏝️"}
                    {region === "Antarctic" && "❄️"}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {region}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Features
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                Explore what makes our country explorer unique
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🔍",
                  title: "Advanced Search",
                  description:
                    "Find countries by name, capital, region, language, and more with our powerful search tools",
                },
                {
                  icon: "📊",
                  title: "Detailed Statistics",
                  description:
                    "Access comprehensive data including population, area, languages, currencies, and borders",
                },
                {
                  icon: "🌐",
                  title: "Language Filters",
                  description:
                    "Discover countries by the languages they speak with easy filtering options",
                },
                {
                  icon: "💰",
                  title: "Currency Information",
                  description:
                    "Learn about different currencies used around the world",
                },
                {
                  icon: "🏙️",
                  title: "Capital Cities",
                  description:
                    "Explore capital cities and their information at a glance",
                },
                {
                  icon: "🔄",
                  title: "Real-time Updates",
                  description:
                    "Get the latest country data with our regularly updated API integration",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
