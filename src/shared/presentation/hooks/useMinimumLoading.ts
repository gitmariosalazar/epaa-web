import { useState, useEffect } from 'react';

export const useMinimumLoading = (
  isLoading: boolean,
  minTime: number = 5000
) => {
  const [minimumDone, setMinimumDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumDone(true);
    }, minTime);

    return () => clearTimeout(timer);
  }, [minTime]);

  return isLoading || !minimumDone;
};
