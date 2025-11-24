import localFont from 'next/font/local';

// Didot - Serif font for headlines
export const didot = localFont({
  src: [
    {
      path: '../public/fonts/Didot-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Didot-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/Didot-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-didot',
  display: 'swap',
});

// Gotham - Sans-serif font for data and labels
export const gotham = localFont({
  src: [
    {
      path: '../public/fonts/Gotham-Book.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gotham-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-gotham',
  display: 'swap',
});
