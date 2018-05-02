import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Wuhan from './charts/wuhan';
import Beijing from './charts/beijing';

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)


const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/wuhan">Wuhan</Link></li>
        <li><Link to="/beijing">Beijing</Link></li>
      </ul>

      <hr/>

      <Route exact path="/" component={Home}/>
      <Route path="/wuhan" component={Wuhan}/>
      <Route path="/beijing" component={Beijing}/>
    </div>
  </Router>
)
export default BasicExample