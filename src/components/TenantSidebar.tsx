import SearchInput from "../components/SearchInput";
import RangeDropDown from "../components/RangeDropDown";
import { useState } from "react";

type PriceRange = { 
    label: string; 
    min: number | null; 
    max: number | null 
};

const TenantSidebar = () => {
  const [searchInput, setSearchInput] = useState('');
  const [rangeDropDown, setRangeDropDown] = useState<PriceRange>({ 
    label: "Any Price",
    min: null,
    max: null,
  });

  return (                                
    <div className="tenant_sidebar">
      <h4>Filter Results</h4>

      <SearchInput
        placeholder=""
        label="LOCATION"
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      <RangeDropDown
        label="PRICE RANGE"
        value={rangeDropDown}
        onChange={(range) => setRangeDropDown(range)} 
      />
    </div>
  );
};

export default TenantSidebar;