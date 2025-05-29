import Faq from '../views/pages/faq';
import Wishlist from '../views/pages/wishlist';
import LandingPage from '../views/pages/landing-page';
import Detail from '../views/pages/detail';
import LoginFlowry from '../views/pages/login';
import RegistrasiFlowry from '../views/pages/registrasi';
import AdminBouquet from '../views/pages/admin-bouquet';
import AdminFeedback from '../views/pages/admin-feedback';

const routes = {
  '/': LandingPage, // default page
  '/landing-page': LandingPage,
  '/wishlist': Wishlist,
  '/faq': Faq,
  '/login': LoginFlowry,
  '/registrasi': RegistrasiFlowry,
  '/admin-bouquet': AdminBouquet,
  '/admin-feedback': AdminFeedback,
  '/detail/:id': Detail,
};

export default routes;
