import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { ref as storageRef, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";

const ApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dob: '',
    nationality: '',
    address: '',
    pinCode: '',
    mobileNumber: '',
    email: '',
    idProof: null,
    casteCertificate: null,
    indianPostalOrder: '',
    educationQualifications: [{}, {}, {}],
    experienceDetails: [{}, {}, {}],
    noObjectionCertificate: null,
    pwdCertificate: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (section === "education") {
      const updatedEducation = [...formData.education];
      updatedEducation[index][name] = files ? files[0] : value;
      setFormData({ ...formData, education: updatedEducation });
    } else if (section === "experience") {
      const updatedExperience = [...formData.experience];
      updatedExperience[index][name] = files ? files[0] : value;
      setFormData({ ...formData, experience: updatedExperience });
    } else if (name === "idProof" || name === "casteCertificate" || name === "noObjectionCertificate" || name === "pwdCertificate") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddEducationRow = () => {
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formRef = push(ref(db, "applications"));
    const key = formRef.key;

    const uploadFile = async (file, path) => {
      if (file) {
        const storageReference = storageRef(storage, `documents/${key}/${path}`);
        await uploadBytes(storageReference, file);
      }
    };

    await uploadFile(formData.idProof, "idProof");
    await uploadFile(formData.casteCertificate, "casteCertificate");
    await uploadFile(formData.noObjectionCertificate, "noObjectionCertificate");
    await uploadFile(formData.pwdCertificate, "pwdCertificate");

    for (let i = 0; i < formData.education.length; i++) {
      await uploadFile(formData.education[i].marksCard, `education/${i}/marksCard`);
    }

    for (let i = 0; i < formData.experience.length; i++) {
      await uploadFile(formData.experience[i].experienceCertificate, `experience/${i}/experienceCertificate`);
    }

    await set(formRef, formData);
    alert("Form submitted successfully!");
    setFormData({
      name: "",
      fatherHusbandName: "",
      dob: "",
      nationality: "",
      address: "",
      pincode: "",
      mobile: "",
      email: "",
      idProof: null,
      casteCertificate: null,
      postalOrder: "",
      education: [{ class: "", board: "", year: "", subjects: "", percentage: "", marksCard: null }],
      experience: [
        { post: "", employer: "", period: "", natureOfWork: "", salary: "", remainder: "", experienceCertificate: null },
      ],
      noObjectionCertificate: null,
      pwdCertificate: null,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Application Form</h2>

      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Father/Husband's Name:</label>
        <input
          type="text"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Nationality:</label>
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Permanent Address:</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Pincode:</label>
        <input
          type="text"
          name="pinCode"
          value={formData.pinCode}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Mobile Number:</label>
        <input
          type="number"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>ID Proof (Pan Card/Driving License/Aadhaar Card):</label>
        <input
          type="file"
          name="idProof"
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Caste Certificate (Gen/SC/ST/OBC):</label>
        <input
          type="file"
          name="casteCertificate"
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Indian Postal Order:</label>
        <input
          type="text"
          name="indianPostalOrder"
          value={formData.indianPostalOrder}
          onChange={handleChange}
        />
      </div>

      <h3>Education Qualification:</h3>
      <h5>Required Documents : 10th,12th and Gate Score</h5>
      {formData.educationQualifications.map((_, index) => (
        <div key={index}>
          <input
            type="text"
            name={`educationQualifications[${index}].class`}
            placeholder="Class/Degree"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`educationQualifications[${index}].board`}
            placeholder="Board"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`educationQualifications[${index}].year`}
            placeholder="Year of Passing"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`educationQualifications[${index}].subjects`}
            placeholder="Subjects"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`educationQualifications[${index}].percentage`}
            placeholder="Percentage"
            onChange={handleChange}
          />
          <input
            type="file"
            name={`educationQualifications[${index}].marksCard`}
            onChange={handleChange}
          />
        </div>
      ))}

      <h3>Details of Any Other Experience:</h3>
      {formData.experienceDetails.map((_, index) => (
        <div key={index}>
          <input
            type="text"
            name={`experienceDetails[${index}].poetHired`}
            placeholder="Poet Hired"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`experienceDetails[${index}].employer`}
            placeholder="Name of Employer"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`experienceDetails[${index}].periodFrom`}
            placeholder="Period (From)"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`experienceDetails[${index}].periodTo`}
            placeholder="Period (To)"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`experienceDetails[${index}].natureOfWork`}
            placeholder="Nature of Work"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`experienceDetails[${index}].salary`}
            placeholder="Salary"
            onChange={handleChange}
          />
          <input
            type="text"
            name={`experienceDetails[${index}].remainder`}
            placeholder="Remainder"
            onChange={handleChange}
          />
          <input
            type="file"
            name={`experienceDetails[${index}].experienceCertificate`}
            onChange={handleChange}
          />
        </div>
      ))}

      <div>
        <label>No Objection Certificate (if applicable):</label>
        <input type="file" name="noObjectionCertificate" onChange={handleChange} />
      </div>

      <div>
        <label>PWD Certificate (if applicable):</label>
        <input type="file" name="pwdCertificate" onChange={handleChange} />
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default ApplicationForm;
