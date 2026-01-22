import { useEffect } from "react";

export function useTitle(title) {
  useEffect(() => {
    document.title = "Conciliaciones - " + title;

    return () => {
      document.title = "Conciliaciones";
    };
  }, [title]);
}