import React, { useEffect, useState } from "react";
import { getUserProfileApi } from "../../../api/api";


const ProfileForm = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    // dob: "",
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch profile from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfileApi();
        const user = res.user;

        // split fullName into first & last name
        const [firstName, ...lastArr] = user.fullName?.split(" ") || [];
        const lastName = lastArr.join(" ");

        setProfile({
          firstName: firstName || "",
          lastName: lastName || "",
          mobile: user.mobile || "",
          email: user.email || "",
          // dob: "", 
        });
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-form">
      <h5 className="mb-4 hv" style={{ color: "#4e5954", fontWeight: 600 }}>
        My Profile
      </h5>

      <form>
        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              className="form-control see-more"
              value={profile.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="form-control see-more"
              value={profile.lastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              className="form-control see-more"
              value={profile.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control see-more"
              value={profile.email}
              onChange={handleChange}
              disabled
            />
          </div>
        </div>

        {/* <div className="mb-4 col-md-6">
          <label className="form-label">Date of Birth</label>
          <input
            type="text"
            name="dob"
            className="form-control see-more"
            value={profile.dob}
            onChange={handleChange}
          />
        </div> */}
      </form>
    </div>
  );
};

export default ProfileForm;
