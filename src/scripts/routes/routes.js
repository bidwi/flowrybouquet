import Faq from '../views/pages/faq';
import Wishlist from '../views/pages/wishlist';
import LandingPage from '../views/pages/landing-page';
import Detail from '../views/pages/detail';

const routes = {
  '/': LandingPage, // default page
  '/landing-page': LandingPage,
  '/wishlist': Wishlist,
  '/faq': Faq,
  '/detail/:id': Detail,
};

export default routes;
