import { Route, Routes } from 'react-router-dom';
import MainContext from './components/Main/MainContext';
import Login from "./pages/Login";
import Main from './pages/Main';
import Customer from './components/Main/Customer';
import Detail from './components/Main/Detail';
import Plot from './components/Main/Plot';
import Personal from './components/Main/Personal';
import Sales from './components/Main/Sales';
import SalesDetail from './components/Main/SalesDetail';
import PDF from './components/Main/PDF';
import Settings from './components/Main/Settings';
import PlotModal from './components/Main/PlotModal'

function App() {
  const mainData = {
    titles: {
      customer: 'Clientes',
      plot: 'Lotes',
      personal: 'Personal',
      sales: 'Ventas',
      settings: 'Ajustes'
    },
  };
  return (
    <>
      <MainContext.Provider value={mainData}>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/main/*' element={<Main />}>
            <Route path='customer/*' element={<Customer />} />
            <Route path='customer/detail/:id' element={<Detail value={"Clientes"} />} />
            <Route path='plot/*' element={<Plot />}>
              <Route path='detail/:id' element={<PlotModal />} />
            </Route>
            <Route path='personal/*' element={<Personal />} />
            <Route path='personal/detail/:id' element={<Detail value={"Personal"} />} />
            <Route path='sales/*' element={<Sales />} />
            <Route path='sales/detail/:id' element={<SalesDetail />} />
            <Route path='sales/detail/:id/invoice' element={<PDF />} />
            <Route path='settings/*' element={<Settings />} />
          </Route>
        </Routes>
      </MainContext.Provider>
    </>
  )
}

export default App