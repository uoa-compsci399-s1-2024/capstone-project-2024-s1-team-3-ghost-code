import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminClinicianSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Function to fetch search results from backend API
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      // Make HTTP request to backend API with search query
      axios.get(`/api/search?query=${searchQuery}`)
        .then(response => {
          setSearchResults(response.data);
        })
        .catch(error => {
          console.error("Error fetching search results:", error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="flex flex-col grow pt-5 pb-20 mt-7 w-full text-black rounded-3xl bg-slate-300 leading-[135%] max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5 self-end mr-16 text-3xl text-center max-md:mr-2.5">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search..."
          className="rounded-md px-3 py-1 border border-gray-400"
        />
      </div>
      {/* Render search results */}
      {searchResults.map(result => (
        <div key={result.id} className="flex gap-5 px-8 py-8 mt-5 max-w-full bg-white rounded-3xl w-[870px] max-md:flex-wrap max-md:px-5">
          <div className="flex-auto text-3xl">{result.name}</div>
          <div className="flex-auto self-start text-2xl">{result.email}</div>
        </div>
      ))}
    </div>
  );
}

export default AdminClinicianSearch;
