import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ContactModal = ({ show, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Contact Information</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Name:</strong> Daniyal</p>
        <p><strong>Email:</strong> dmn7146@gmail.com</p>
        <p><strong>Phone:</strong> +12345678</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContactModal; 