import React, { useState } from "react";
import Modal from "react-modal";

const customStyles = {
  overlay: {
    zIndex: 1000,
    background: "rgba(0,0,0, 0.3)",
  },
};

Modal.setAppElement("#root");

const Essay = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openEssayModal(e) {
    e.preventDefault();
    setIsOpen(true);
  }

  function closeEssayModal() {
    setIsOpen(false);
  }

  return (
    <div className="essay">
      <div className="text">
        <h3 className="essay__heading">Θέμα 1</h3>
        <p className="essay__date">18-02-2020</p>
      </div>
      <a className="essay__link" href="#" onClick={openEssayModal}>
        <i className="far fa-file-alt"></i>
      </a>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeEssayModal}
        className="modal-show-essay"
        style={customStyles}
        contentLabel="Test Modal"
        closeTimeoutMS={300}
      >
        <header>
          <button onClick={closeEssayModal}>
            <i class="fas fa-times"></i>
          </button>
        </header>
        <div className="container">
          <div className="title">
            <h1>Essay Title</h1>
          </div>
          <div className="main-section">
            <div className="text-wrapper">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                assumenda esse animi porro voluptas repellendus, aperiam nisi
                quisquam ipsum deserunt odio dicta sunt nam sint tempore est
                blanditiis. Reiciendis, quisquam illo amet maiores nam sunt quo
                quod tenetur nostrum ad fugiat deserunt optio cum magni?
                Eligendi fuga velit consectetur soluta quisquam voluptate rerum
                asperiores. Corrupti nobis maxime corporis, harum suscipit eos
                iste tempore ducimus odio officiis voluptatum debitis, et
                ratione nemo nisi tempora sapiente praesentium dolore fugit
                expedita nihil nam iusto. Obcaecati odit asperiores beatae sit
                minima aut eum aperiam numquam odio laboriosam in, iure illo,
                eaque quia corporis quibusdam!
              </p>
            </div>
            <div className="author-wrapper">
              <h3 className="author">Lefteris Dimitriou</h3>
              <p className="date">18/02/2021</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Essay;
