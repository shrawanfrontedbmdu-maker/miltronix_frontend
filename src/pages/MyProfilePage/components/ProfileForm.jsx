import React, { useState } from 'react';

const initialProfile = {
  firstName: 'Nikhil',
  lastName: 'Saini',
  mobile: '+91 9389674925',
  email: 'nikhil@gmail.com',
  dob: '29/June/2025',
};

const ProfileForm = () => {
  const [profile, setProfile] = useState(initialProfile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-form">
      <h5 className="mb-4 hv" style={{ color: '#4e5954', fontWeight: 600 }}>My Profile</h5>
      <form>
        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label">First Name</label>
            <input type="text" name="firstName" className="form-control see-more" value={profile.firstName} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Last Name</label>
            <input type="text" name="lastName" className="form-control see-more" value={profile.lastName} onChange={handleChange} />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label">Mobile Number</label>
            <input type="tel" name="mobile" className="form-control see-more" value={profile.mobile} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" className="form-control see-more" value={profile.email} onChange={handleChange} />
          </div>
        </div>
        <div className="mb-4 col-md-6">
          <label className="form-label">Date of Birth</label>
          <input type="text" name="dob" className="form-control see-more" value={profile.dob} onChange={handleChange} />
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;