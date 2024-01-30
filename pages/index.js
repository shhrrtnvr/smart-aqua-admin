import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Redirect to home if token exists
      router.push('/home');
    } else {
      // Redirect to sign-in page if token doesn't exist
      router.push('/signin');
    }
  }, []);

  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>This is the landing page of my application.</p>
    </div>
  );
};

export default Home;
