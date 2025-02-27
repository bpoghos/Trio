import { Modal } from "react-bootstrap";
import AdminAddForm from "../AdminAddForm/AdminAddForm";
import { ConcertsDataProps } from "../../../../interface/interface";


interface EventFormModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  concertData?: ConcertsDataProps | null; // Pass concert data if editing
}

const EventFormModal: React.FC<EventFormModalProps> = ({ showModal, setShowModal, concertData }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered className="custom-modal">
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>{concertData ? "Edit Concert" : "New Concert"}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-light">
        <AdminAddForm showModal={showModal} setShowModal={setShowModal} concertData={concertData} />
      </Modal.Body>
    </Modal>
  );
};

export default EventFormModal;

