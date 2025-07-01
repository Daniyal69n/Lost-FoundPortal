import React from 'react';

const HeaderBanner = ({ home }) => (
  <div
    style={{
      width: '100vw',
      maxWidth: '100%',
      height: home ? '350px' : '250px',
      background: "url('/c.jpg') center/cover no-repeat",
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textShadow: '0 2px 8px rgba(0,0,0,0.7)',
    }}
  >
    <h1 style={{ fontSize: '2.8rem', fontWeight: 700, margin: 0 }}>Lost & Found Portal</h1>
    <p style={{ fontSize: '1.2rem', margin: 0 }}>Helping students find their belongings</p>
  </div>
);

export default HeaderBanner; 