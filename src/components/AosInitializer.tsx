'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export const AosInitializer = () => {
  useEffect(() => {
    AOS.init({
      disable: true
    });
  }, []);

  return null;
};
