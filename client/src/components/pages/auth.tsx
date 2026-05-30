import { useState, type FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import '../../style/auth.scss';
import type { RegisterRequest } from '../../types/api';

interface AuthForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  agree?: string;
}

type Field = {
  id: keyof AuthForm;
  label: string;
  type: string;
}

/**
 * Validates registration form fields before calling the register endpoint.
 *
 * @param formData - Current registration form state.
 * @returns Field-level validation errors.
 */
const validate = (formData: AuthForm): FormErrors => {
  const errors: FormErrors = {};

  // Имя — только английские буквы, минимум 2 символа
  if (!formData.name.trim()) {
    errors.name = "Введите имя";
  } else if (!/^[a-zA-Z]+$/.test(formData.name)) {
    errors.name = "Имя должно содержать только латинские буквы";
  } else if (formData.name.length < 2) {
    errors.name = "Имя должно быть не менее 2 символов";
  }

  // Email
  if (!formData.email.trim()) {
    errors.email = "Введите email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Введите корректный email (например: user@mail.ru)";
  }

  // Телефон — цифры, +, -, пробелы, минимум 10 цифр
  if (!formData.phone.trim()) {
    errors.phone = "Введите номер телефона";
  } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
    errors.phone = "Введите корректный номер (например: +79991234567)";
  }

  // Пароль
  if (!formData.password) {
    errors.password = "Введите пароль";
  } else if (formData.password.length < 6) {
    errors.password = "Пароль должен быть не менее 6 символов";
  }

  // Подтверждение пароля
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Повторите пароль";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Пароли не совпадают";
  }

  if (!formData.agree) {
    errors.agree = "Нужно принять соглашение";
  }

  return errors;
};

function Auth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AuthForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof AuthForm, value: string | boolean) => {
    // Для имени — не допускаем нелатинские символы
    if (field === "name" && typeof value === "string" && value && !/^[a-zA-Z]*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [field]: value }));
    // Убираем ошибку поля при вводе
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const body: RegisterRequest = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setServerError(data?.error || "Неверный логин или пароль");
        return;
      }

      navigate('/login');
    } catch {
      setServerError("Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на порту 8080.");
    } finally {
      setLoading(false);
    }
  };

  const formFields: Field[] = [
    { id: "name", label: "Имя (только латиница)", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "phone", label: "Номер телефона", type: "tel" },
    { id: "password", label: "Пароль", type: "password" },
    { id: "confirmPassword", label: "Повторить пароль", type: "password" },
  ];

  return (
    <div className="auth-page auth-page-register">
      <header className="auth-header">
        <nav className="auth-nav" role="navigation" aria-label="Main navigation">
          <Button variant="stroke" size="m" onClick={() => navigate('/')}>Главная</Button>
          <Button variant="stroke" size="m" onClick={() => navigate('/catalogue')}>Каталог</Button>
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
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {formFields.map((field, index) => (
            <div key={field.id} className="auth-field-container" style={{ marginTop: index === 0 ? "16px" : "8px" }}>
              <label htmlFor={field.id} className={`auth-label auth-label-${field.id}`}>{field.label}</label>
              <div className="auth-input-wrapper">
                <input
                  type={field.type}
                  id={field.id}
                  name={field.id}
                  value={formData[field.id]}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`auth-input ${errors[field.id] ? "auth-input--error" : ""}`}
                  aria-required="true"
                />
              </div>
              {errors[field.id] && (
                <p className="auth-error-text">{errors[field.id]}</p>
              )}
            </div>
          ))}

          {serverError && <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>{serverError}</p>}

          <div className="auth-checkbox-row">
            <label className="auth-checkbox-label">
              <input
                type="checkbox"
                checked={formData.agree}
                onChange={(e) => handleInputChange("agree", e.target.checked)}
              />
              <span>
                Я принимаю{" "}
                <a
                  href="#agreement"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/agreement");
                  }}
                  style={{ color: '#97302c' }}
                >
                  пользовательское соглашение
                </a>
              </span>
            </label>
            {errors.agree && <p className="auth-error-text">{errors.agree}</p>}
          </div>

          <Button type="submit" variant="primary" size="m" className="auth-submit-button" disabled={loading}>
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </Button>

          
        </form>
      </main>

      <footer className="auth-footer">
        <p>© 2026 DermoLand</p>
      </footer>
    </div>
  );
}

export default Auth;
