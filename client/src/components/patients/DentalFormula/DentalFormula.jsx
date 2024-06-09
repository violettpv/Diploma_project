import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../../css/Patients.css';
import '../../../index.css';
import Button from '../../Button';
import { toast } from 'react-toastify';
import {
  getDentalFormula,
  updateDentalFormula,
  reset,
} from '../../../features/patients/patientsSlice';
import { OutlinedInput, MenuItem, FormControl, Select } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const options = [
  { label: 'C - карієс', value: 'C' },
  { label: 'P - пульпіт', value: 'P' },
  { label: 'Pt - періодонтит', value: 'Pt' },
  { label: 'Lp - локалізований пародонтит', value: 'Lp' },
  { label: 'Gp - генералізований пародонтит', value: 'Gp' },
  { label: 'R - корінь', value: 'R' },
  { label: 'А - відсутній', value: 'A' },
  { label: 'Сd - коронка', value: 'Cd' },
  { label: 'Рl - пломба', value: 'Pl' },
  { label: 'F - фасетка', value: 'F' },
  { label: 'ar - штучний зуб', value: 'ar' },
  { label: 'r - реставрація', value: 'r' },
  { label: 'H - гемісекція', value: 'H' },
  { label: 'Am - ампутація', value: 'Am' },
  { label: 'res - резекція', value: 'res' },
  { label: 'pin - штифт', value: 'pin' },
  { label: 'I - імплантація', value: 'I' },
  { label: 'Rp - реплантація', value: 'Rp' },
  { label: 'Dc - зубний камінь', value: 'Dc' },
];

const convertedFormula = {
  0: 18,
  1: 17,
  2: 16,
  3: 15,
  4: 14,
  5: 13,
  6: 12,
  7: 11,
  8: 21,
  9: 22,
  10: 23,
  11: 24,
  12: 25,
  13: 26,
  14: 27,
  15: 28,
  16: 48,
  17: 47,
  18: 46,
  19: 45,
  20: 44,
  21: 43,
  22: 42,
  23: 41,
  24: 31,
  25: 32,
  26: 33,
  27: 34,
  28: 35,
  29: 36,
  30: 37,
  31: 38,
};

function MultipleSelectChip({ parentState, defVal, toothId, disabled }) {
  const [toothOption, setToothOption] = useState([]);

  useEffect(() => {
    setToothOption(defVal);
  }, [defVal]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const stateValue = typeof value === 'string' ? value.split(',') : value;
    setToothOption(
      // On autofill we get a stringified value.
      stateValue
    );
    parentState((prevState) => ({ ...prevState, [toothId]: stateValue }));
  };

  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          key={toothId}
          value={toothOption}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" />}
          renderValue={(selected) =>
            selected.map((value) => (
              <span key={value} id="chip">
                {value}
              </span>
            ))
          }
          MenuProps={MenuProps}
          disabled={disabled}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default function DentalFormula({ uuid }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dentalFormula, isError, isSuccess, message } = useSelector(
    (state) => state.patients
  );
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, []);

  const dentalFormulaFormRef = useRef(null);
  const buttonUpdateRef = useRef(null);
  const buttonsSaveCancelRef = useRef(null);

  const [jsonDentalFormula, setJsonDentalFormula] = useState({
    18: [],
    17: [],
    16: [],
    15: [],
    14: [],
    13: [],
    12: [],
    11: [],
    21: [],
    22: [],
    23: [],
    24: [],
    25: [],
    26: [],
    27: [],
    28: [],
    48: [],
    47: [],
    46: [],
    45: [],
    44: [],
    43: [],
    42: [],
    41: [],
    31: [],
    32: [],
    33: [],
    34: [],
    35: [],
    36: [],
    37: [],
    38: [],
  });
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isError) {
      toast.error(message, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }

    if (user && (user.role === 'doctor' || user.role === 'main')) {
      dispatch(getDentalFormula(uuid));
    } else {
      toast.warn('У вас немає доступу до цієї сторінки', {
        position: 'top-right',
        autoClose: 1100,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      navigate(`/patients/card/${uuid}/info`);
    }

    return () => {
      dispatch(reset());
    };
  }, [isError, message, dispatch, uuid]);

  useEffect(() => {
    if (Object.keys(dentalFormula).length > 0) {
      setJsonDentalFormula((prevState) => ({
        ...prevState,
        ...dentalFormula.jsonDentalFormula,
      }));
      setNote(dentalFormula.note || '');
    }
  }, [dentalFormula]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = {
      uuid: dentalFormula.uuid,
      jsonDentalFormula: jsonDentalFormula || dentalFormula.jsonDentalFormula,
      note: note || dentalFormula.note,
    };
    await dispatch(updateDentalFormula(data));
    toast.success(`Зубна формула пацієнта оновлена`, {
      position: 'top-right',
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    cancelEditForm();
    await dispatch(getDentalFormula(dentalFormula.patientUuid));
  };

  const enableEditForm = () => {
    dentalFormulaFormRef.current.querySelectorAll('.options').forEach((textarea) => {
      textarea.removeAttribute('disabled');
    });
    buttonUpdateRef.current.classList.add('disabled');
    buttonsSaveCancelRef.current.classList.remove('disabled');
    setIsEditing(true);
  };

  const cancelEditForm = () => {
    dentalFormulaFormRef.current.querySelectorAll('.options').forEach((textarea) => {
      textarea.setAttribute('disabled', '');
    });
    buttonUpdateRef.current.classList.remove('disabled');
    buttonsSaveCancelRef.current.classList.add('disabled');
    setIsEditing(false);
  };

  return (
    <div className="DentalFormula">
      <div className="DentalFormula-main">
        <div className="DentalFormula-block-1">
          <div className="df-table-div">
            {isSuccess && (
              <table
                id="df-table"
                style={{ flex: 1 }}
                border="1"
                ref={dentalFormulaFormRef}
              >
                <tbody>
                  <tr className="options-row">
                    {[...Array(16)].map((_, index) => (
                      <td key={index} className="td-buttons">
                        <MultipleSelectChip
                          disabled={!isEditing}
                          parentState={setJsonDentalFormula}
                          toothId={convertedFormula[index]}
                          defVal={jsonDentalFormula[convertedFormula[index]]}
                        />
                      </td>
                    ))}
                  </tr>
                  <tr className="image-row">
                    <td colSpan="16">
                      <img
                        id="dental-formula-img"
                        src={require('./dental-formula.png')}
                        alt="dental-formula"
                      />
                    </td>
                  </tr>
                  <tr className="options-row">
                    {[...Array(16)].map((_, index) => (
                      <td key={index} className="td-buttons">
                        <MultipleSelectChip
                          disabled={!isEditing}
                          parentState={setJsonDentalFormula}
                          toothId={convertedFormula[16 + index]}
                          defVal={jsonDentalFormula[convertedFormula[16 + index]]}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="DentalFormula-block-2">
          <div className="df-note" ref={dentalFormulaFormRef}>
            <textarea
              placeholder="Примітка"
              id="df-note"
              className="options"
              disabled={!isEditing}
              defaultValue={dentalFormula.note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="df-buttons">
            <div className="df-buttons-1" ref={buttonUpdateRef}>
              <Button
                type="button"
                onClick={enableEditForm}
                text="Редагувати"
                color="var(--piction-blue)"
              />
            </div>
            <div className="df-buttons-2 disabled" ref={buttonsSaveCancelRef}>
              <Button
                type="button"
                onClick={(e) => handleUpdate(e)}
                text="Зберегти"
                color="var(--piction-blue)"
              />
              <Button
                type="button"
                text="Скасувати"
                color="gray"
                onClick={cancelEditForm}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
