import { useState } from "react";
import { Button } from "react-bootstrap";
import { ConcertsDataProps } from "../../../../../../interface/interface";
import style from "./Card.module.scss";
import { formatFirestoreDate } from "../../../../../../configs/firebase/firebaseConfigs";
import { useConcerts } from "../../../../../../customHooks/customHooks";
import EventFormModal from "../../../Modal/Modal";


const Card = ({ concert, data }: { concert: ConcertsDataProps, data: ConcertsDataProps[] }) => {
  const { month, day, year } = formatFirestoreDate(concert.date);
  const { deleteDataFromFirestore, loading } = useConcerts();

  // State to control modal visibility
  const [showModal, setShowModal] = useState<boolean>(false);
  // const [isUpload, setIsUpload] = useState<boolean>(false)
  const [selectedConcert, setSelectedConcert] = useState<ConcertsDataProps | null>(null);

  // Handle edit button click
  const handleEdit = () => {
    setSelectedConcert(concert); // Set selected concert
    setShowModal(true); // Open modal
  };

  // Check if the image exists and is valid
  const imageSrc = concert.image && concert.image !== "" ? concert.image : "Brave";

  return (
    <>
      <tr>
        <td>{concert.city_name}</td>
        <td>{concert.hall_name}</td>
        <td>{concert.time}</td>
        <td>
          <div className={style.imageContainer}>
            {/* Render image or a placeholder if the concert image is invalid */}
              <img alt="concertImage" src={imageSrc} />
          </div>
        </td>
        <td>{concert.link}</td>
        <td>{`${day} ${month} ${year}`}</td>
        <td>
          <Button variant="secondary" onClick={handleEdit}>Edit</Button>
        </td>
        <td>
          <Button variant="danger" onClick={() => concert.id && deleteDataFromFirestore(concert.id)}>Delete</Button>
        </td>
      </tr>

      {/* Edit Modal */}
      {showModal && (
        <EventFormModal showModal={showModal} setShowModal={setShowModal} concertData={selectedConcert} />
      )}
    </>
  );
};

export default Card;
