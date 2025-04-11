import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [populationFilter, setPopulationFilter] = useState('');

  useEffect(() => {
    fetch('https://restcountries.com/v2/all')
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching countries:', err);
        setLoading(false);
      });
  }, []);

  const filterByPopulation = (country) => {
    if (!populationFilter) return true;
    if (populationFilter === 'small') return country.population < 1000000;
    if (populationFilter === 'medium') return country.population >= 1000000 && country.population <= 50000000;
    if (populationFilter === 'large') return country.population > 50000000;
    return true;
  };

const filteredCountries = countries.filter((country) => {
  return (
    (!searchTerm || country.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedRegion || selectedRegion === '' || country.region === selectedRegion) &&
    (!populationFilter || filterByPopulation(country))
  );
});

  const isActiveSearch = searchTerm || selectedRegion || populationFilter;

  return (
    <div className="App">
      <header className="fixed-header">
        <h1>Country Explorer</h1>
      </header>

      <main className="main-content">
        <div className={`search-wrapper ${isActiveSearch ? 'search-top' : 'search-center'}`}>
          <div>
            <label htmlFor="search" className="search-label">SEARCH FOR ANY COUNTRY</label>
            <p className="credit-text"></p>
          </div>
          <input
            id="search"
            type="text"
            placeholder="Country name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="filter-wrapper">
            <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>

            <select value={populationFilter} onChange={(e) => setPopulationFilter(e.target.value)}>
              <option value="">All Populations</option>
              <option value="small">&lt; 1M</option>
              <option value="medium">1M - 50M</option>
              <option value="large">&gt; 50M</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="results-container">
  {!loading && !error && filteredCountries.map((country) => (
    <div key={country.name} className="country-card">
      <div className="country-flag-container">
        {country.flag && (
          <img
            src={country.flag}
            alt={`${country.name} flag`}
            className="country-flag"
          />
        )}
      </div>
      <div className="country-info">
        <h3>{country.name}</h3>
        <p><strong>Capital:</strong> {country.capital || 'N/A'}</p>
        <p><strong>Region:</strong> {country.region || 'N/A'}</p>
        <p><strong>Subregion:</strong> {country.subregion || 'N/A'}</p>
        <p><strong>Population:</strong> {country.population.toLocaleString() || 'N/A'}</p>
        <p><strong>Area:</strong> {country.area ? `${country.area.toLocaleString()} km²` : 'N/A'}</p>
        {country.latlng && (
          <p><strong>Coordinates:</strong> {`Lat: ${country.latlng[0]}, Lng: ${country.latlng[1]}`}</p>
        )}
        {country.borders && country.borders.length > 0 && (
          <p><strong>Borders:</strong> {country.borders.join(', ')}</p>
        )}
        {country.timezones && (
          <p><strong>Timezones:</strong> {country.timezones.join(', ')}</p>
        )}
        {country.currencies && country.currencies.length > 0 && (
          <p><strong>Currency:</strong> {`${country.currencies[0].name} (${country.currencies[0].code})`}</p>
        )}
        {country.languages && country.languages.length > 0 && (
          <p><strong>Languages:</strong> {country.languages.map((lang) => lang.name).join(', ')}</p>
        )}
      </div>
    </div>
  ))}

  {!loading && !error && filteredCountries.length === 0 && (
    <p className="no-result">No country found.</p>
  )}
</div>
      </main>

      <footer className="fixed-footer">
        <p>&copy; 2025 Country Explorer by RICO JAY GWAPO, All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;