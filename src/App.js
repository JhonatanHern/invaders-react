import React from 'react'
import SpaceInvaders from './SpaceInvaders'

import './App.css';

const myStyle = {
  width: '100%',
  height: '50vh',
  backgroundColor: 'black'
}

function App() {
  return (
    <>
        <SpaceInvaders style={myStyle} tickSpeed={150}/>
    </>
  );
}

export default App;
