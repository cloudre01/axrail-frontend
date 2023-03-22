import "./App.css";

import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CreateEditPage from "./components/CreateEditPage";
import ErrorPage from "./components/ErrorPage";
import Layout from "./components/Layout";
import ListingPage from "./components/ListingPage";
import { ToasterProvider } from "./context/ToasterContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <ListingPage />,
      },
      {
        path: "create-edit",
        element: <CreateEditPage />,
      },
      {
        path: "create-edit/:id",
        element: <CreateEditPage />,
      },
    ],
  },
]);

function App() {
  const queryClient = new QueryClient();
  queryClient.setDefaultOptions({
    queries: {
      // 30 mins
      staleTime: 1000 * 60 * 30,
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ToasterProvider>
        <RouterProvider router={router} />
      </ToasterProvider>
    </QueryClientProvider>
  );
}

export default App;
