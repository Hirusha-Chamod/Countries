// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Homepage";
import RegisterPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CountryDetails from "./pages/CountryDetails";
import AllCountries from "./pages/AllCountries";

export default function App() {
  return (
    <div className="app">
      <Routes>
        {/* Routes that do not need Header and Footer */}
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/countries/:code" element={<CountryDetails />} />
        <Route path="/countries" element={<AllCountries />} />{" "}
        {/* Example login route */}
        {/* Routes that require Header and Footer */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          }
        />
        {/* You can add other routes here in the same way */}
      </Routes>
    </div>
  );
}
