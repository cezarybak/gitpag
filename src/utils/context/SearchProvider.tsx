import { ReactNode, useState } from "react";
import SearchContext from "./SearchContext";

const SearchDataProvider = ({ children }: { children: ReactNode }) => {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchDataProvider;
