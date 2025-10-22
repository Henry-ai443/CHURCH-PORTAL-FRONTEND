
import { useState, useEffect } from 'react';

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://church-portal-backend.onrender.com/api/current-user/', {
          credentials: 'include', // send cookies if using session auth
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

export default useCurrentUser;
