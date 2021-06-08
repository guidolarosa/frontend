import { Web3ReactProvider } from '@web3-react/core'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { App } from './pages/app'
import { store } from './state'
import { Web3Provider } from '@ethersproject/providers'
import Web3ReactManager from './components/web3-react-manager'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLibrary = (provider: any) => new Web3Provider(provider)

ReactDOM.render(
  <StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <HashRouter>
          <Web3ReactManager>
            <App />
          </Web3ReactManager>
        </HashRouter>
      </Provider>
    </Web3ReactProvider>
  </StrictMode>,
  document.getElementById('root')
)
