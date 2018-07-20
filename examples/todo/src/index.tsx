import { StoreProvider } from 'plume2';
import React from 'react';
import { render } from 'react-dom';
import Footer from './component/footer';
import Header from './component/header';
import Main from './component/main-section';
import './css/base.css';
import './css/index.css';
import AppStore from './store';

if (__DEV__) {
  require('preact/devtools');
}

//debug: true, it will show good logs
@StoreProvider(AppStore, { debug: __DEV__ })
export default class TodoApp extends React.Component {
  render() {
    return (
      <section className="todoapp">
        <Header />
        <Main />
        <Footer />
      </section>
    );
  }
}

render(<TodoApp />, document.getElementById('app'));
