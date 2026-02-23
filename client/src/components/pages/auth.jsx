import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import '../../style/auth.scss';

function Auth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    login: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const formFields = [
    { id: "login", label: "Логин", type: "text", icon: false },
    { id: "email", label: "Email", type: "email", icon: false },
    { id: "phone", label: "Номер телефона", type: "tel", icon: false },
    { id: "password", label: "Пароль", type: "password", icon: false },
    {
      id: "confirmPassword",
      label: "Повторить пароль",
      type: "password",
      icon: false,
    },
  ];

  return (
    <div className="auth-page auth-page-register">
      <header className="auth-header">
        <nav
          className="auth-nav"
          role="navigation"
          aria-label="Main navigation"
        >
          <Button
            variant="stroke"
            size="m"
            onClick={() => navigate('/')}
          >
            Главная
          </Button>

          <Button
            variant="stroke"
            size="m"
            onClick={() => navigate('/catalogue')}
          >
            Каталог
          </Button>
        </nav>

        <button className="auth-button-login" onClick={() => navigate('/login')}>
          <span>Войти</span>
          <svg style={{ position: 'relative', width: '24px', height: '24px', aspectRatio: '1' }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#e8def8"/>
          </svg>
        </button>
      </header>

      <main className="auth-main auth-main-register">
        <h1 className="auth-title">Регистрация</h1>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
          noValidate
        >
          {formFields.map((field, index) => (
            <div
              key={field.id}
              className="auth-field-container"
              style={{ marginTop: index === 0 ? "16px" : "8px" }}
            >
              <label
                htmlFor={field.id}
                className={`auth-label ${
                  field.id === "login"
                    ? "auth-label-login"
                    : field.id === "email"
                      ? "auth-label-email"
                      : field.id === "phone"
                        ? "auth-label-phone"
                        : field.id === "password"
                          ? "auth-label-password"
                          : "auth-label-confirm"
                }`}
              >
                {field.label}
              </label>

              <div
                className={`auth-input-wrapper ${
                  field.icon ? "auth-input-wrapper-with-icon" : ""
                } ${
                  field.id === "email"
                    ? "auth-input-wrapper-email"
                    : field.id === "confirmPassword"
                      ? "auth-input-wrapper-confirm"
                      : ""
                }`}
              >
                {field.icon && (
                  <svg
                    style={{ position: 'relative', width: '16px', height: '16px', aspectRatio: '1', flexShrink: 0 }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#1c1b1f"/>
                  </svg>
                )}
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className="auth-input"
                  aria-required="true"
                  autoComplete={
                    field.id === "login"
                      ? "username"
                      : field.id === "email"
                        ? "email"
                        : field.id === "phone"
                          ? "tel"
                          : field.id === "password"
                            ? "new-password"
                            : field.id === "confirmPassword"
                              ? "new-password"
                              : "off"
                  }
                />
              </div>
            </div>
          ))}

          <Button
            type="submit"
            variant="primary"
            size="m"
            className="auth-submit-button"
          >
            Зарегистрироваться
          </Button>

          <p className="auth-terms">
            <span>Регистрируясь, вы соглашаетесь с </span>
            <a href="#terms">условиями использования</a>
            <span> и </span>
            <a href="#privacy">политикой конфиденциальности</a>
          </p>
        </form>
      </main>

      <footer className="auth-footer">
        <p>© 2026 DermoLand</p>
      </footer>
    </div>
  );
}

export default Auth;
