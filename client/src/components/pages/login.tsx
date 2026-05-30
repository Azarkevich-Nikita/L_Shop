import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import '../../style/auth.scss';

interface LoginForm {
  identifier: string;
  password: string;
}

interface FormErrors {
  identifier?: string;
  password?: string;
}

// Определяем тип идентификатора
const detectIdentifierType = (value: string): "email" | "phone" | "name" | null => {
  if (!value.trim()) return null;
  if (value.includes("@")) return "email";
  if (/^\+?[\d\s\-()]{7,}$/.test(value)) return "phone";
  if (/^[a-zA-Z]{2,}$/.test(value)) return "name";
  return null;
};

const validate = (formData: LoginForm): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.identifier.trim()) {
    errors.identifier = "Введите email";
  } else {
    const type = detectIdentifierType(formData.identifier);
    if (!type) {
      errors.identifier = "Введите корректный email, телефон или имя (только латиница)";
    } else if (type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)) {
      errors.identifier = "Введите корректный email (например: user@mail.ru)";
    }
  }

  if (!formData.password) {
    errors.password = "Введите пароль";
  } else if (formData.password.length < 6) {
    errors.password = "Пароль должен быть не менее 6 символов";
  }

  return errors;
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginForm>({
    identifier: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

     setLoading(true);
     try {
       // Отправляем в поле email — бэкенд сам разберёт тип
       const response = await fetch("/api/auth/login", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         credentials: "include",
         body: JSON.stringify({
           email: formData.identifier,
           password: formData.password,
         }),
       });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setServerError(data?.error || "Неверный логин или пароль");
        return;
      }

      const data = await response.json();
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      navigate('/');
    } catch {
      setServerError("Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на порту 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-login">
      <header className="auth-header">
        <nav className="auth-nav" role="navigation" aria-label="Main navigation">
          <Button variant="stroke" size="m" onClick={() => navigate('/')}>Главная</Button>
          <Button variant="stroke" size="m" onClick={() => navigate('/catalogue')}>Каталог</Button>
        </nav>
        <button className="auth-button-login" onClick={() => navigate('/auth')}>
          <span>Зарегистрироваться</span>
          <svg style={{ position: 'relative', width: '24px', height: '24px', aspectRatio: '1' }} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#e8def8"/>
          </svg>
        </button>
      </header>

      <main className="auth-main auth-main-login">
        <h1 className="auth-title">Авторизация</h1>
        <form onSubmit={handleSubmit} className="auth-form" noValidate>

          <div className="auth-field-container" style={{ marginTop: "12px" }}>
            <label htmlFor="identifier" className="auth-label auth-label-identifier">
              Email
            </label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={(e) => handleInputChange("identifier", e.target.value)}
                className={`auth-input ${errors.identifier ? "auth-input--error" : ""}`}
                aria-required="true"
                autoComplete="username"
                placeholder="user@mail.ru"
              />
            </div>
            {errors.identifier && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{errors.identifier}</p>
            )}
          </div>

          <div className="auth-field-container" style={{ marginTop: "8px" }}>
            <label htmlFor="password" className="auth-label auth-label-password">Пароль</label>
            <div className="auth-input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`auth-input ${errors.password ? "auth-input--error" : ""}`}
                aria-required="true"
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>{errors.password}</p>
            )}
          </div>

          {serverError && <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>{serverError}</p>}

          <Button type="submit" variant="primary" size="m" className="auth-submit-button" disabled={loading}>
            {loading ? "Загрузка..." : "Войти"}
          </Button>

          <p className="auth-terms auth-terms-login">
            <span>Нет аккаунта? </span>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/auth'); }}>
              Зарегистрироваться
            </a>
          </p>
        </form>
      </main>

      <footer className="auth-footer">
        <p>© 2026 DermoLand</p>
      </footer>
    </div>
  );
}

export default Login;
