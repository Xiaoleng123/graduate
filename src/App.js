import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Wuhan from './charts/wuhan';
import Beijing from './charts/beijing';
import Compare from './charts/compare';

import './App.less';
const Home = () => (
  <div>
    <h1 style={{ textAlign: 'center' }}>欢迎使用</h1>
  </div>
)


const BasicExample = () => (
  <Router>
    <div style={{ height: '100%' }}>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/wuhan">Wuhan</Link></li>
        <li><Link to="/beijing">Beijing</Link></li>
        <li><Link to="/compare">Compare</Link></li>
      </ul>
      <div className="router-view">
        <Route exact path="/" component={Home} />
        <Route path="/wuhan" component={Wuhan} />
        <Route path="/beijing" component={Beijing} />
        <Route path="/compare" component={Compare} />
      </div>
    </div>
  </Router>
)
export default BasicExample