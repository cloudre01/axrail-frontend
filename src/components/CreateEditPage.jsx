import "react-phone-number-input/style.css";

import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import PhoneInputWithCountrySelect, {
  isValidPhoneNumber,
} from "react-phone-number-input";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import { ToasterContext } from "../context/ToasterContext";

function CreateEditPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const showToast = useContext(ToasterContext);

  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const getContactById = async () => {
    const result = await fetch(`/api/contacts/${id}`);
    if (!result.ok) {
      throw new Error("An error occurred while fetching the contact.");
    }
    return result.json();
  };

  const { data: contact, isLoading } = useQuery(
    ["contact", id],
    () => getContactById(id),
    {
      enabled: !!id,
    }
  );

  const updateContact = async (body) => {
    const result = await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!result.ok) {
      throw new Error("An error occurred while updating the contact.");
    }

    return result;
  };

  const createContact = async (body) => {
    const result = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!result.ok) {
      throw new Error("An error occurred while creating the contact.");
    }

    return result.json();
  };

  const { mutate: saveContact, isLoading: isSaving } = useMutation(
    id ? updateContact : createContact,
    {
      onSuccess: () => {
        showToast(
          id ? "Contact updated successfully" : "Contact saved successfully"
        );
        navigate(`/`);
        queryClient.invalidateQueries("contacts");
        queryClient.invalidateQueries(["contact", id]);
      },
      onError: (error) => {
        showToast(error.message, "error");
      },
    }
  );

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhone(contact.phone);
    }
  }, [contact]);

  const handleSave = (e) => {
    e.preventDefault();
    // client side validation
    if (!name || !phone) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!isValidPhoneNumber(phone)) {
      showToast("Please enter a valid phone number", "error");
      return;
    }

    const body = { name, phone };
    const isContactChanged = contact
      ? name !== contact.name || phone !== contact.phone
      : true;
    if (isContactChanged) {
      saveContact(body);
    } else {
      navigate(`/`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          <IoIosArrowBack /> Back
        </button>
        <h1 className="text-3xl font-bold mb-5">
          {id ? "Edit" : "Create"} contact
        </h1>
      </div>
      <form onSubmit={handleSave}>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            id="name"
            className="input input-bordered w-full max-w-xs"
            type="text"
            placeholder="Enter contact name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs mb-4">
          <label className="label">
            <span className="label-text">Phone number</span>
          </label>
          <PhoneInputWithCountrySelect
            defaultCountry="MY"
            placeholder="Enter phone number"
            className="input input-bordered w-full max-w-xs"
            value={phone}
            onChange={setPhone}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {id ? "Save changes" : "Add contact"}
        </button>
      </form>
    </>
  );
}

export default CreateEditPage;
