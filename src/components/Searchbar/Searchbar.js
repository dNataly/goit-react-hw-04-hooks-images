import { useState } from "react";
import s from "./Searchbar.module.css";
import { BsSearch } from "react-icons/bs";
import "react-toastify/dist/ReactToastify.css";

export default function Searchbar ({onSubmit}) {
  const [query, setQuery] = useState('');

  const handleSearchFormSubmit = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const res = query.trim();

    if (res) {
      onSubmit(res);
    }
    setQuery('');
  };

  return (
      <header className={s.Searchbar}>
        <form className={s.SearchForm} onSubmit={handleSubmit}>
          <button type="submit" className={s.SearchFormButton}>
            <span className={s.SearchFormButtonLabel}>
              <BsSearch />
            </span>
          </button>

          <input className={s.SearchFormInput} type="text" autoComplete="off" autoFocus placeholder="Search images and photos" onChange={handleSearchFormSubmit} />
        </form>
      </header>
    );
  }
