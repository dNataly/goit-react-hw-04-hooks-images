import { useState, useEffect } from "react";
import "./App.css";
import LoaderComponent from "./components/Loader/Loader.js";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import Button from "./components/Button/Button";
import Searchbar from "./components/Searchbar/Searchbar";
import { gotService, images_per_page } from "./services/gotService.js";

const Status = {
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
  LOADING: "loading",
};

export default function App() {
    const [query, setQuery] = useState('');
    const [images, setImages] = useState([]);
    const [page, setPage] = useState(1);
    const [isMoreAvailable, setIsMoreAvailable] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        if (status === Status.NEED_LOADING) {
            setStatus(Status.PENDING);

      gotService(query, page)
        .then((results) => {
          const resultsCount = results.hits.length;
          if (resultsCount === 0) {
              setError(new Error(`No search results for ${query}`));
              setStatus(Status.REJECTED);
              return;
          }

            setImages(prev => [...images, ...results.hits]);
            setIsMoreAvailable(checkAvailability(resultsCount));
            setStatus(Status.RESOLVED);
          })
        .then(() => {
          if (page !== 1) {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: "smooth",
            });
          }
        })
        .catch((error) => {
            setError(error);
            setStatus(Status.REJECTED);
        });
    }
  }, [images, page, query, status]);

  const handleSearchSubmit = (query) => {
      setImages([]);
      setQuery(query);
      setPage(1);
      setStatus(Status.NEED_LOADING);
  };

  const handleLoadMore = () => {
      setPage(prev => prev + 1);
      setStatus(Status.NEED_LOADING);
  };

  const checkAvailability = (itemsLength) => {
    return !(itemsLength < images_per_page);
  };

    return (
      <div className="App">
        <Searchbar onSubmit={handleSearchSubmit} />
        {status === Status.REJECTED && <div className="error"> {error.message}</div>}
        <ImageGallery items={images} />
        {status === Status.PENDING && <LoaderComponent />}
        {status === Status.RESOLVED && isMoreAvailable && <Button onClick={handleLoadMore}>Load more</Button>}
      </div>
    );
  }

