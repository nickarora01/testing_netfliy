import { useEffect } from "react";

function useOutsideSidesheet(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (event.type === "keyup" && event.key === "Escape") {
          callback();
        }
        if (event.type === "mousedown") {
          callback();
        }
      }
    }

    document.addEventListener("keyup", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keyup", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideSidesheet;
