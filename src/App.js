import { useState, useTransition, Suspense } from 'react';

//import { generateProducts } from './data';
import ProductList from './components/ProductList';
import SuspenseContainer from './components/SuspenseContainer';




function App() {

  const [show, setShow] = useState(false); 

  if(true) {
    return (
      <div id="app">
        {/* <input type="text" onChange={updateFilterHandler} /> */}
        {/* {isPending && <p style={{color: 'white'}}>Updating List...</p>} */}
        <SuspenseContainer />
        
      </div>
    );
  } else {
      return (
      <button onClick = {() => setShow(true)}>Demo</button>
  )}
}

export default App;
