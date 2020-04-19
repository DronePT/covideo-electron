import React, { CSSProperties } from 'react';
import css from './Button.scss';

interface ButtonStyle extends CSSProperties {
  width?: string;
}

interface ButtonProps {
  width?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

// eslint-disable-next-line react/prop-types
const Button: React.FC<ButtonProps> = ({ children, width, onClick }) => {
  const style: ButtonStyle = {};

  if (width) style.width = width;

  return (
    <button
      type="button"
      style={style}
      className={css.Button}
      onClick={event => onClick(event)}
    >
      {children}
    </button>
  );
};

export default Button;
