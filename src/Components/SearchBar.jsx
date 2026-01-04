import React from "react";
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

   const submitHandle = (e)=>{
     e.preventDefault();
     onSearch(search);
   }
  return (
    <div className="w-full p-4 pb-20 text-center">
    <form onSubmit={submitHandle}>
      <input
        type="text"
        placeholder="Search here"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border border-gray-400 rounded-xl outline-0 focus:bg-gray-400 focus:text-black"
      />
      </form>
    </div>
  );
}

export default SearchBar;
