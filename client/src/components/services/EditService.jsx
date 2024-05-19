import React from 'react';
import '../../css/Services.css';
import Header from '../Header';
import Navigator from '../Navigator';
import { Link } from 'react-router-dom';

export default function EditService() {
  return (
    <>
      <div className="Services">
        <Navigator />
        <div className="services-content">
          <Header />
          <div className="add-service-body">
            <div className="add-service-main">
              <form className="add-service-form">
                <div className="add-service-title">Редагувати послугу у прайс-листі</div>
                <hr />
                <div className="add-service-inputs-buttons">
                  <div className="add-service-inputs">
                    <div className="add-service-input">
                      <label htmlFor="service-name">Назва послуги</label>
                      <input
                        id="service-name"
                        type="text"
                        // value={service.name}
                      />
                    </div>
                    <div className="add-service-input">
                      <label htmlFor="service-price">Ціна послуги</label>
                      <input
                        id="service-price"
                        type="text"
                        // value={service.price}
                      />
                    </div>
                  </div>
                  <div className="add-service-buttons">
                    <button className="service-buttons" type="button">
                      Зберегти
                    </button>
                    <Link to="/services">
                      <button
                        className="service-buttons"
                        style={{ backgroundColor: 'var(--charcoal)' }}
                        type="button"
                      >
                        Скасувати
                      </button>
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
