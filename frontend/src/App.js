import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Footer from './Home/Footer';
import HomeMain from './Home/HomeMain';
import Navbar from './Home/Navbar';
import {BrowserRouter as Router, Route, Routes, useLocation} from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import AdminRoutes from './Routes/AdminRoutes';
import AdminDashboard from './admin/AdminDashboard';
import CreateBike from './admin/CreateBike';
import UpdateBike from './admin/UpdateBike';
import Bikes from './admin/Bikes';
import AdminOrders from './admin/AdminOrders';
import CreateBrands from './admin/CreateBrands';
import BrandsList from './admin/BrandsList';
import Brands from './Home/Brands';
import About from './Home/About';
import PrivateRoute from './Routes/PrivateRoute';
import UserDashboard from './common/UserDashboard';
import UserOrder from './common/UserOrder';
import UserProfile from './common/UserProfile';
import NotFound from './pages/NotFound';
import Cart from './pages/Cart';
import CarsFilterpage from './Home/CarsFilterpage';
import CarView from './pages/CarView';
import BikeView from './pages/BikeView';
import CarInBrand from './pages/CarInBrand';
import OrderConfirmation from './pages/OrderConfirmation';
import SellerRoute from './Routes/SellerRoute';
import SellerDashboard from './seller/SellerDashboard';
import AddBike from './seller/AddBike';
import MyBikes from './seller/MyBikes';
import EditBike from './seller/EditBike';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ManageBikes from './admin/ManageBikes';
import AdminUsers from './admin/AdminUsers';

const NavbarWrapper = () => {
  const location = useLocation();
  const hideOn = ['/login', '/register'];
  if (hideOn.includes(location.pathname)) return null;
  return <Navbar />;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NavbarWrapper />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
      <Route path='/' element={<HomeMain />} />
      <Route path='/cart' element={<Cart/>} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/brands' element={<Brands />} />
      <Route path='/about' element={<About />} />
      <Route path='/cars' element={<CarsFilterpage />} />
      <Route path='/bikes' element={<CarsFilterpage />} />
      <Route path='/car/:slug' element={<CarView/>} />
      <Route path='/bike/:id' element={<BikeView/>} />
      <Route path='/brand/:slug' element={<CarInBrand/>} />
      <Route path='/order-confirmation' element={<OrderConfirmation/>} />
      <Route path='/*' element={<NotFound/>} />
      <Route path='/dashboard' element={<AdminRoutes/>}>
            <Route path='admin' element={<AdminDashboard/>}/>
            <Route path='admin/bikes' element={<Bikes/>}/>
            <Route path='admin/create-bike' element={<CreateBike/>}/>
            <Route path='admin/update-bike/:id' element={<UpdateBike/>}/>
            <Route path='admin/create-brands' element={<CreateBrands/>} />
            <Route path='admin/allbrands' element={<BrandsList/>} />

            <Route path='admin/orders' element={<AdminOrders/>}/>
            <Route path='admin/manage-bikes' element={<ManageBikes/>}/>
            <Route path='admin/users' element={<AdminUsers/>}/>
      </Route>
      <Route path='/dashboard' element={<PrivateRoute/>}>
            <Route path='user' element={<UserDashboard/>} />
            <Route path='user/order' element={<UserOrder/>} />
            <Route path='user/profile' element={<UserProfile/>} />
      </Route>
      <Route path='/dashboard' element={<SellerRoute/>}>
            <Route path='seller' element={<SellerDashboard/>} />
            <Route path='seller/add-bike' element={<AddBike/>} />
            <Route path='seller/my-bikes' element={<MyBikes/>} />
            <Route path='seller/edit-bike/:id' element={<EditBike/>} />
      </Route>
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
