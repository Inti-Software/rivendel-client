import { useState, useEffect } from "react";

export default function useFormGrid(request, recordsPerPage) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await request({ currentPage });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedData = await response.json();

        const totalRecords = fetchedData.totalRecords;
        setTotalPages(Math.ceil(totalRecords / recordsPerPage));

        setData(fetchedData.data);
        setError(null);
      } catch (error) {
        setError(error.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  return { loading, data, error, currentPage, totalPages, setData, setCurrentPage };
}
