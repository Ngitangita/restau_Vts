// import { useState, useEffect, useCallback } from 'react';

// type UseFetchReturnType<T> = {
//   data: T | null;
//   isLoading: boolean;
//   isError: boolean;
//   error: string | null;
// };

// const useFetch = <T>(urlOrFunction: string | (() => string)): UseFetchReturnType<T> => {
//   const [data, setData] = useState<T | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isError, setIsError] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(() => {
//     setIsLoading(true);
//     setIsError(false);
//     setError(null);

//     const url = typeof urlOrFunction === 'function' ? urlOrFunction() : urlOrFunction;

//     fetch(url)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((result: T) => {
//         setData(result);
//       })
//       .catch((err: Error) => {
//         setIsError(true);
//         setError(err.message);
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [urlOrFunction]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   return { data, isLoading, isError, error };
// };

// export default useFetch;
