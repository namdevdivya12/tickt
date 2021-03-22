import Routes from './routes';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './redux/rootReducer';
import rootSaga from './redux/rootSaga';
import Loader from './common/loader';
import Toast from './common/toast';
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sagaMiddleware = createSagaMiddleware()

// mount it on the Store
export const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(sagaMiddleware)
))

//run the saga
sagaMiddleware.run(rootSaga)

const App = () => {
  return (
    <Provider store={store}>
      <Routes />
      <Loader />
      <Toast />
    </Provider>
  );
}

export default App;
