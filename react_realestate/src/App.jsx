import { Route, Routes } from 'react-router-dom';
import MainContext from './components/Main/MainContext';
import Login from "./pages/Login";
import Main from './pages/Main';
import Customer from './components/Main/Customer';
import Detail from './components/Main/Detail';
import Personal from './components/Main/Personal';

function App() {
  const mainData = {
    titles: {
      customer: 'Clientes',
      personal: 'Personal'
    },
  };
  return (
    <>
      <MainContext.Provider value={mainData}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/main/*' element={<Main />}>
            <Route path='customer/*' element={<Customer />} />
            <Route path='customer/detail/:id' element={<Detail value={"customer"} />} />
            <Route path='personal/*' element={<Personal />} />
            <Route path='personal/detail/:id' element={<Detail value={"personal"} />} />
          </Route>
        </Routes>
      </MainContext.Provider>
    </>
  )
}

export default App