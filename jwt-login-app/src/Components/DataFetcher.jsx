// src/Components/DataFetcher.js
import React, { useState, useEffect } from 'react';
import TokenWrapper from '../api/TokenWrapper';

const DataFetcher = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = sessionStorage.getItem('accessToken');
      try {
        const response = await fetch('http://localhost:8080/protected-data', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

const WrappedComponent = () => (
  <TokenWrapper>
    <DataFetcher />
  </TokenWrapper>
);

export default WrappedComponent;