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

  useEffect(() => { fetchAddresses(); }, []);

  const handleAddNewAddress = () => {
    setIsEdit(false);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const handleEditAddress = (address) => {
    setIsEdit(true);
    setCurrentId(address._id);
    setFormData({ ...address });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateAddressApi(currentId, formData);
      } else {
        await addAddressApi(formData);
      }
      setShowModal(false);
      fetchAddresses();
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="profile-container1 p-0">
      {/* Header Section */}
      <div className="address-header mb-4">
        <h5 className="saved-address-title text-uppercase ff2 fs-3 italic">Saved Address</h5>
        <button onClick={handleAddNewAddress} className="btn add-new-address fw-bold text-decoration-none border-bottom border-dark p-0">
          + ADD NEW ADDRESS
        </button>
      </div>

      {/* Address List Grid */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-secondary"></div>
          </div>
        ) : addresses.length > 0 ? (
          addresses.map((address) => (
            <div className="col-12 col-md-6" key={address._id}>
              <AddressCard
                address={address}
                onEdit={() => handleEditAddress(address)}
                onRemove={() => handleRemoveAddress(address._id)}
              />
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 about-card rounded-3">
            <p className="text-muted mb-0">No addresses saved yet.</p>
          </div>
        )}
      </div>

      {/* ================= MODERN MODAL ================= */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-modal shadow-lg border-0">
              <button className="custom-close fs-3" onClick={() => setShowModal(false)} style={{ color: '#616D6B' }}>&times;</button>
              
              <div className="modal-header border-0 pb-0">
                <h4 className="modal-title ff2 italic fs-2">{isEdit ? "Update Address" : "Add Address"}</h4>
              </div>
              
              <div className="modal-body pt-4">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <input name="fullName" className="form-control custom-input shadow-sm" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    
                    <div className="col-md-6">
                      <input name="houseFlatNo" className="form-control custom-input shadow-sm" placeholder="House / Flat No." value={formData.houseFlatNo} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <input name="pinCode" className="form-control custom-input shadow-sm" placeholder="Pin Code" maxLength={6} value={formData.pinCode} onChange={handleChange} required />
                    </div>

                    <div className="col-12">
                      <input name="streetLocality" className="form-control custom-input shadow-sm" placeholder="Street / Locality" value={formData.streetLocality} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <input name="city" className="form-control custom-input shadow-sm" placeholder="City" value={formData.city} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                      <input name="state" className="form-control custom-input shadow-sm" placeholder="State" value={formData.state} onChange={handleChange} required />
                    </div>

                    <div className="col-12 mt-3">
                      <div className="form-check form-switch p-2 ps-5 rounded-3 border" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}>
                        <input className="form-check-input ms-[-2.5em]" type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleChange} id="defaultCheck" />
                        <label className="form-check-label fw-bold" htmlFor="defaultCheck" style={{ color: '#616D6B', fontSize: '14px' }}>Set as Default Address</label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button type="submit" className="btn custom-login-btn flex-grow-1 py-2 fw-bold text-uppercase">
                      {isEdit ? "Update Address" : "Save Address"}
                    </button>
                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-secondary px-4 rounded-3 border-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedAddressList;
