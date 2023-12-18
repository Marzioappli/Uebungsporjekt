import React from 'react';
import './Front.css';

const App = () => {
  return (
    <div className="homepage">
      <img src="https://www.arzt-wirtschaft.de/wp-content/uploads/2020/06/AdobeStock_279164330n.jpg" alt="Profile" className="profile-image" />
      <div className="text-box">
        <h1>Willkommen auf der PatientenDB Website!</h1>
        <p>Auf dieser Website können authentifizierte Personen auf die Patientendaten zugreifen.</p>
      </div>
    </div>
  );
};

export default App;
