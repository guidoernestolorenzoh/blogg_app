import { Eye, EyeSlash } from "@gravity-ui/icons";
import { useState } from "react";

const Input = ({
  type,
  value,
  onChange,
  placeholder,
  className,
  onBlur,
  onKeyDown,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <input
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        required
        placeholder={placeholder}
        className={className}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}          
          style={{            
            position: "absolute",
            right: 20,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showPassword ? <Eye /> : <EyeSlash />}
        </button>
      )}
    </>
  );
};

export default Input;
