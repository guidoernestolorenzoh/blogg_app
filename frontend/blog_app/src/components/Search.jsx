import { Magnifier, Xmark } from "@gravity-ui/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = ({
  className,
  placeholder = "Search...",
  inputClassName,
  iconPosition,
  theme,
}) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const query = search.trim();
    if (!query) return;
    const timer = setTimeout(()=> {
      navigate(`/search?q=${encodeURIComponent(query)}`, {
        replace: true
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [search, navigate])
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const baseInput =
    "rounded-full pr-10 h-10 focus:outline-none w-full pl-8 p-2 cursor-pointer";

  const themeInput =
    theme === "dark"
      ? "bg-zinc-900 text-white border border-zinc-700 placeholder:text-gray-400 hover:bg-zinc-800"
      : "";

  return (
    <form
      onSubmit={handleSubmit}
      className={`hidden sm:flex flex-1 max-w-lg h-10 text-xs sm:text-sm rounded-full ${className ?? ""}`}
    >
      <div className="relative flex items-center w-full">
        <div className="flex w-full">
          <Magnifier
            className={`absolute ${iconPosition} -translate-y-1/2 size-4 ${
              theme === "dark" ? "text-gray-500" : "text-zinc-400"
            }`}
          />
          <input
            type="text"
            value={search}
            placeholder={placeholder}
            onChange={(e) => setSearch(e.target.value)}
            className={`${baseInput} ${inputClassName ?? themeInput}`}
          />
        </div>
        {search && (
        <button
          type="button"
          onClick={() => {setSearch("")
            navigate("/")
          }
          }
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
        >
          <Xmark
            size="lg"
            className={`size-5 cursor-pointer ${
              theme === "dark" ? "text-gray-400" : "text-zinc-500"
            }`}
          />
        </button>
        )}
      </div>
    </form>
  );
};

export default Search;
