import { Route, Routes } from 'react-router-dom';
import MainContext from './components/Main/MainContext';
import Login from "./pages/Login";
import Main from './pages/Main';
import Customer from './components/Main/Customer';

function App() {
  const mainData = {
    titles: {
      customer: 'Clientes',
    },
  };
  return (
    <>
      <MainContext.Provider value={mainData}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/main/*' element={<Main />}>
            <Route path='customer' element={<Customer />} />
          </Route>
        </Routes>
      </MainContext.Provider>
    </>
  )
}

export default App