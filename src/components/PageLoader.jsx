
import React, { useEffect, useState } from "react";
import "../styles/Loader.css";
import Loader from "./Loader";

const PageLoader = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoaded = () => {
            setTimeout(() => setLoading(false), 1000);
        };

        const images = document.querySelectorAll("img");
        let loadedCount = 0;

        if (images.length === 0) {
            handleLoaded();
            return;
        }

        images.forEach((img) => {
            if (img.complete) {
                loadedCount++;
            } else {
                img.addEventListener("load", () => {
                    loadedCount++;
                    if (loadedCount === images.length) handleLoaded();
                });
                img.addEventListener("error", () => {
                    loadedCount++;
                    if (loadedCount === images.length) handleLoaded();
                });
            }
        });


        const timer = setTimeout(() => handleLoaded(), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading && <Loader />}
            <div className={loading ? "page-content blurred" : "page-content"}>
                {children}
            </div>
        </>
    );
};

export default PageLoader;

/*import React, { useEffect, useState } from "react";
import "../styles/Loader.css";
import Loader from "./Loader";

const PageLoader = ({ children, delay = 500 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadedCount = 0;
    const images = Array.from(document.querySelectorAll("img"));
    const total = images.length;

    const handleLoaded = () => {
      // small delay for smoother transition
      setTimeout(() => setLoading(false), delay);
    };

    if (total === 0) {
      handleLoaded();
      return;
    }

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === total) handleLoaded();
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad);
        img.addEventListener("error", handleImageLoad);
      }
    });

    // fallback — if some images hang or never load
    const timeout = setTimeout(handleLoaded, 4000);

    // cleanup listeners
    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
        img.removeEventListener("error", handleImageLoad);
      });
      clearTimeout(timeout);
    };
  }, [delay]);

  return (
    <>
      {loading && <Loader />}
      <div className={`page-content ${loading ? "blurred" : ""}`}>
        {children}
      </div>
    </>
  );
};

export default PageLoader;
*/