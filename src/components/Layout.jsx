import { Outlet } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

export default function Layout() {
  return (
    <HelmetProvider>
      <Helmet>
        <title>My Phonebook</title>
        <meta name="description" content="My phonebook app" />
        <meta property="og:title" content="An amazing phonebook app" />
      </Helmet>

      <Outlet />
    </HelmetProvider>
  );
}
