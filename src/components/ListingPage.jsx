import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi";
import {
  MdDeleteOutline,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import BarLoader from "react-spinners/BarLoader";

import { ToasterContext } from "../context/ToasterContext";
import copyToClipboard from "../helper/copyToClipboard";

function ListingPage() {
  const [page, setPage] = useState(1);
  const showToast = useContext(ToasterContext);
  const queryClient = useQueryClient();

  const getContacts = async (curPage = 1) => {
    const response = await fetch(`/api/contacts?page=${curPage}`);
    if (!response.ok) {
      throw new Error("An error occurred while fetching contacts.");
    }
    return response.json();
  };

  const deleteContact = async (id) => {
    const response = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("An error occurred while deleting the contact.");
    }
    return response;
  };

  const { mutate } = useMutation(deleteContact, {
    onSuccess: () => {
      setPage(1);
      queryClient.removeQueries("contacts");
    },
    onError: (err) => {
      showToast(err.message, "error");
    },
  });

  const { data, isLoading, isError, error, isFetching, isPreviousData } =
    useQuery(["contacts", page], () => getContacts(page), {
      keepPreviousData: true,
    });

  const handleDelete = (id) => {
    mutate(id, {
      onSuccess: () => {
        data.contacts.filter((c) => c.id !== id);
        showToast("Contact deleted successfully");
      },
      onError: (err) => {
        showToast(err.message, "error");
      },
    });
  };

  const handleCopy = (id) => {
    const { phone } = data.contacts.find((c) => c.id === id);
    copyToClipboard(phone).then(() => {
      showToast("Copied to clipboard");
    });
  };

  if (isLoading)
    return (
      <div>
        <p className="font-bold text-xl mb-2">Loading...</p>
        <PulseLoader color="#36d7b7" />
      </div>
    );
  if (isError) return showToast(error.message, "error");

  return (
    <div className="relative">
      {isFetching && (
        <AnimatePresence>
          <motion.div
            className="absolute justify-center top-11 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <BarLoader color="#36d7b7" width="100" />
          </motion.div>
        </AnimatePresence>
      )}
      <h1 className="text-3xl font-bold mb-5">Contacts</h1>
      {data.contacts.length === 0 ? (
        <div className="card w-96 bg-base-100 shadow-xl mb-4">
          <div className="card-body">
            <p>No contacts found</p>
          </div>
        </div>
      ) : (
        <table className="table w-full mb-4">
          <thead>
            <tr>
              {/* <th>Id</th> */}
              <th>Name</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.contacts.map((c) => (
              <tr key={c.id} className="hover">
                {/* <td>{c.id}</td> */}
                <td>{c.name}</td>
                <td>
                  <div className="tooltip tooltip-info" data-tip="Copy">
                    <button
                      type="button"
                      className="focus:outline-none"
                      onClick={() => handleCopy(c.id)}
                    >
                      {formatPhoneNumberIntl(c.phone)}
                    </button>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Link to={`/create-edit/${c.id}`}>
                    <button
                      type="button"
                      className="btn btn-circle btn-xs mr-1"
                      aria-label="edit"
                    >
                      <HiOutlinePencil />
                    </button>
                  </Link>
                  <button
                    type="button"
                    className="btn btn-circle btn-outline btn-xs btn-error"
                    onClick={() => handleDelete(c.id)}
                    aria-label="delete"
                  >
                    <MdDeleteOutline />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mb-4 flex justify-center gap-2 relative">
        {data?.hasPrev && (
          <button
            type="button"
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
          >
            <MdNavigateBefore />
          </button>
        )}
        {data?.hasNext && (
          <button
            type="button"
            onClick={() => {
              if (!isPreviousData && data.hasNext) {
                setPage((old) => old + 1);
              }
            }}
            disabled={isPreviousData || !data?.hasNext}
          >
            <MdNavigateNext />
          </button>
        )}
      </div>
      <Link to="/create-edit">
        <button type="button" className="btn btn-primary">
          Add new contact
        </button>
      </Link>
    </div>
  );
}

export default ListingPage;
