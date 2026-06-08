'use client';  // Makes it client-only
import { useState, useEffect } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);  // Only render after client loads
  }, []);
  
  if (!mounted) return <div>Loading...</div>;  // Matches server
  
  return (
    <div>
      <h1>Welcome to Museums Project</h1>
      <p>This is built with Next.js + TypeScript</p>
    </div>
  );
}
