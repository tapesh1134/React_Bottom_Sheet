import React from 'react';
import BottomSheet from './components/BottomSheet';

function App() {
  return (
    <div style={{fontFamily: 'sans-serif', minHeight: '100vh', background: '#f3f3fa'}}>
      <h1 style={{padding: 24}}>React Bottom Sheet</h1>
      <BottomSheet>
        <h2>Drag content</h2>
        <p>Something to write in paragraph space</p>
        <ul>
          <li>a</li>
          <li>a</li>
          <li>a</li>
        </ul>
      </BottomSheet>
    </div>
  );
}
export default App;
