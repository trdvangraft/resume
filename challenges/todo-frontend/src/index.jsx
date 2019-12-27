import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Page from './App'
import configureStore from './store/configure-store.jsx'

import './index.css'

const store = configureStore()

render(
  <Provider store={store}>
    <Page />
  </Provider>,
  document.getElementById('root')
)