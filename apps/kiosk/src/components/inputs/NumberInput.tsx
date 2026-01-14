import { useState } from 'react';
import style from './NumberInput.module.css';

interface NumberInputProps {
  value?: number;
  onChange?: (value: number) => void;
};

const NumberInput = ({ value = 1, onChange }: NumberInputProps) => {
  const [currentValue, setCurrentValue] = useState(value);

  const handleDecrement = () => {
    setCurrentValue(Math.max(1, currentValue - 1));
    if (onChange) {
      onChange(Math.max(1, currentValue - 1));
    }
  };

  const handleIncrement = () => {
    setCurrentValue(currentValue + 1);
    if (onChange) {
      onChange(Math.max(1, currentValue + 1));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 1;
    setCurrentValue(Math.max(1, newValue));
    if (onChange) {
      onChange(Math.max(1, newValue));
    }
  };

  return <div className="flex h-15 w-max text-2xl">
    <button className={style.button} onClick={handleDecrement}>-</button>
    <input className={style.input} type="number" value={currentValue} onChange={handleChange} min="1" />
    <button className={style.button} onClick={handleIncrement}>+</button>
  </div>;
};

export default NumberInput;