import React, { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { Button, Col, Form, Row } from "react-bootstrap";
import defaultConcertImage from "../../../../assets/defaultConcertImage.jpeg";
import { useConcerts } from "../../../../customHooks/customHooks";
import { ConcertsDataProps } from "../../../../interface/interface";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Compressor from "compressorjs";
import { storage } from "../../../../configs/firebase/firebase";

// Define the interface for the form data
interface EventFormData {
  date: string | Date | Timestamp; // Allow all possible types
  cityName: string;
  hallName: string;
  uploadImage: File | string | null;
  time: string;
  link: string;
}

const AdminAddForm = ({ showModal, setShowModal, concertData }: { showModal: boolean; setShowModal: (value: boolean) => void, concertData?: ConcertsDataProps | null; }) => {

  const [isUpload, setIsUpload] = useState<boolean>(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);


  const { addDataToFirestore, editDataInFirestore, deleteImageFromStorage } = useConcerts();

  const formatDateForInput = (date: Date | Timestamp | string): string => {
    if (date instanceof Timestamp) {
      return date.toDate().toISOString().split("T")[0];
    }
    if (typeof date === "string") {
      return date.split("T")[0]; 
    }
    return "";
  };

  // Define state with correct types
  const [formData, setFormData] = useState<EventFormData>({
    date: concertData?.date ? formatDateForInput(concertData.date) : "",
    cityName: concertData?.city_name || "",
    hallName: concertData?.hall_name || "",
    uploadImage: concertData?.image || defaultConcertImage,
    time: concertData?.time || "",
    link: concertData?.link || "",
  });

  useEffect(() => {
    // When concertData changes, update the formData
    if (concertData) {
      setFormData({
        date: formatDateForInput(concertData.date),
        cityName: concertData.city_name,
        hallName: concertData.hall_name,
        uploadImage: concertData.image || defaultConcertImage,
        time: concertData.time,
        link: concertData.link,
      });
    }
  }, [concertData]);

  // Handle adding data
  const handleAddData = async () => {
    const concertData: ConcertsDataProps = {
      city_name: formData.cityName,
      hall_name: formData.hallName,
      date:
        formData.date instanceof Timestamp
          ? formData.date
          : Timestamp.fromDate(new Date(formData.date)),
      time: formData.time,
      image: formData.uploadImage, 
      link: formData.link,
    };

    try {
      await addDataToFirestore(concertData);
      setShowModal(false); 
    } catch (error) {
      console.error("Error adding concert:", error);
    }
  };


  // Handle editing data
  const handleEditData = async () => {
    if (!concertData?.id) return; 

    const concertDataToUpdate: ConcertsDataProps = {
      city_name: formData.cityName,
      hall_name: formData.hallName,
      date:
        formData.date instanceof Timestamp
          ? formData.date
          : Timestamp.fromDate(new Date(formData.date)), 
      time: formData.time,
      image: formData.uploadImage, 
      link: formData.link,
    };

    try {
      await editDataInFirestore(concertData.id, concertDataToUpdate);
      setShowModal(false); 
    } catch (error) {
      console.error("Error editing concert:", error);
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file upload change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setIsUpload(true); // Show loading indicator
  
    new Compressor(file, {
      quality: 0.8, // Adjust compression quality
      maxWidth: 400, // Resize image width if needed
      success: async (compressedFile) => {
        const storageRef = ref(storage, `concertPhotos/${file.name}_${Date.now()}`);
        try {
          await uploadBytes(storageRef, compressedFile);
          const downloadURL = await getDownloadURL(storageRef);
  
          setUploadedImageUrl(downloadURL); // Track uploaded image URL
          setFormData((prevState) => ({
            ...prevState,
            uploadImage: downloadURL,
          }));
        } catch (error) {
          console.error("Error uploading image to Firebase Storage:", error);
        } finally {
          setIsUpload(false); // Hide loading indicator
        }
      },
      error: (err) => {
        console.error("Compression error:", err);
        setIsUpload(false);
      }
    });
  };
  

  
  

 


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (concertData?.id) {
      await handleEditData();
    } else {
      await handleAddData();
    }
};


  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        {/* Date Field */}
        <Form.Group as={Col} controlId="formDate" className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={typeof formData.date === "string" ? formData.date : ""}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>

        {/* City Name Field */}
        <Form.Group as={Col} controlId="formCityName" className="mb-3">
          <Form.Label>City Name</Form.Label>
          <Form.Control
            type="text"
            name="cityName"
            value={formData.cityName}
            maxLength={20}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>
      </Row>

      <Row>
        {/* Hall Name Field */}
        <Form.Group as={Col} controlId="formHallName" className="mb-3">
  <Form.Label>Hall Name</Form.Label>
  <Form.Control
    type="text"
    name="hallName"
    value={formData.hallName}
    onChange={handleChange}
    maxLength={76} 
    required
    className="form-control"
  />
</Form.Group>

        {/* Time Field */}
        <Form.Group as={Col} controlId="formTime" className="mb-3">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="form-control"
          />
        </Form.Group>
      </Row>

      {/* Image Upload Field */}
      <Form.Group controlId="formUploadImage" className="mb-3">
      <Form.Label>Upload Image</Form.Label>
      <div className="mb-2">
        {/* Conditional rendering based on loading state */}
        {isUpload ? (
          <div
            className="placeholder-glow"
            style={{ width: "150px", height: "100px", borderRadius: "4px" }}
          >
            <div className="placeholder col-12" style={{ height: "100%", borderRadius: "4px" }}></div>
          </div>
        ) : (
          <img
            src={typeof formData.uploadImage === "string" ? formData.uploadImage : defaultConcertImage}
            alt="Preview"
            className="img-thumbnail"
            style={{ width: "150px", height: "100px", objectFit: "cover" }}
          />
        )}
      </div>
      <Form.Control type="file" name="uploadImage" onChange={handleFileChange} />
    </Form.Group>

      {/* Link Field */}
      <Form.Group controlId="formLink" className="mb-3">
        <Form.Label>Link</Form.Label>
        <Form.Control
          type="url"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="http://example.com"
          className="form-control"
        />
      </Form.Group>

      <div className="d-flex justify-content-end">
      <Button
  variant="outline-dark"
  onClick={async () => {
    if (uploadedImageUrl) {
      await deleteImageFromStorage(uploadedImageUrl); // Delete if uploaded
      setUploadedImageUrl(null);
    }
    
    setFormData((prevState) => ({
      ...prevState,
      uploadImage: defaultConcertImage, // Reset to default image
    }));
    
    setShowModal(false);
  }}
  className="me-2"
>
  Cancel
</Button>

        <Button variant="success" type="submit">
          {concertData ? "Update" : "Submit"}
        </Button>
      </div>
    </Form>
  );
};

export default AdminAddForm;
