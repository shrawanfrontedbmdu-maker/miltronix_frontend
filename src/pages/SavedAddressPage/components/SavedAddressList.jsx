import React, { useEffect, useState } from "react";
import AddressCard from "../../../components/ui/AddressCard";
import {
  getAddressesApi,
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "../../../api/api";

const emptyForm = {
  fullName: "",
  houseFlatNo: "",
  buildingApartment: "",
  streetLocality: "",
  landmark: "",
  pinCode: "",
  city: "",
  state: "",
  isDefault: false,
};

const SavedAddressList = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  // ================= FETCH ADDRESSES =================
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddressesApi();
      setAddresses(data || []);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ================= OPEN ADD MODAL =================
  const handleAddNewAddress = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // ================= OPEN EDIT MODAL =================
  const handleEditAddress = (address) => {
    setIsEdit(true);
    setCurrentId(address._id);
    setFormData({
      fullName: address.fullName || "",
      houseFlatNo: address.houseFlatNo || "",
      buildingApartment: address.buildingApartment || "",
      streetLocality: address.streetLocality || "",
      landmark: address.landmark || "",
      pinCode: address.pinCode || "",
      city: address.city || "",
      state: address.state || "",
      isDefault: address.isDefault || false,
    });
    setShowModal(true);
  };

  // ================= DELETE =================
  const handleRemoveAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await deleteAddressApi(id);
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  // ================= FORM CHANGE =================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateAddressApi(currentId, formData);
        alert("Address updated successfully");
      } else {
        await addAddressApi(formData);
        alert("Address added successfully");
      }

      setShowModal(false);
      fetchAddresses();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="address-header d-flex justify-content-between align-items-center">
        <h5>Saved Address</h5>
        <button onClick={handleAddNewAddress} className="btn btn-link">
          + Add New Address
        </button>
      </div>

      {/* List */}
      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length > 0 ? (
        addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onEdit={() => handleEditAddress(address)}
            onRemove={() => handleRemoveAddress(address._id)}
          />
        ))
      ) : (
        <p>No saved addresses.</p>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>{isEdit ? "Edit Address" : "Add Address"}</h4>

            <form onSubmit={handleSubmit}>
              <input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                name="houseFlatNo"
                placeholder="House / Flat No."
                value={formData.houseFlatNo}
                onChange={handleChange}
                required
              />

              <input
                name="buildingApartment"
                placeholder="Building / Apartment (Optional)"
                value={formData.buildingApartment}
                onChange={handleChange}
              />

              <input
                name="streetLocality"
                placeholder="Street / Locality"
                value={formData.streetLocality}
                onChange={handleChange}
                required
              />

              <input
                name="landmark"
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChange={handleChange}
              />

              <input
                name="pinCode"
                placeholder="Pin Code"
                value={formData.pinCode}
                onChange={handleChange}
                maxLength={6}
                required
              />

              <input
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <input
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <label style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                />
                Set as Default Address
              </label>

              <div style={{ marginTop: "10px" }}>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddressList;