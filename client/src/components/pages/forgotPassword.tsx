import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import "../../style/auth.scss";

interface RequestForm {
  email: string;
}

interface ConfirmForm {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

type Step = "request" | "confirm";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("request");
  const [requestForm, setRequestForm] = useState<RequestForm>({ email: "" });
  const [confirmForm, setConfirmForm] = useState<ConfirmForm>({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!requestForm.email.trim()) {
      setServerError("Введите email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(requestForm.email)) {
      setServerError("Введите корректный email (например: user@mail.ru)");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: requestForm.email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setServerError(data?.error || "Не удалось отправить код");
        return;
      }

      setConfirmForm((prev) => ({ ...prev, email: requestForm.email }));
      setStep("confirm");
      setSuccessMessage("Код отправлен на email (в dev-режиме код выводится в консоль сервера).");
    } catch {
      setServerError("Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на порту 8080.");
    } finally {
      setLoading(false);
    }
  };

  const submitConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    if (!confirmForm.code.trim()) {
      setServerError("Введите код");
      return;
    }
    if (!/^\d{6}$/.test(confirmForm.code.trim())) {
      setServerError("Код должен быть из 6 цифр");
      return;
    }
    if (!confirmForm.password || confirmForm.password.length < 6) {
      setServerError("Пароль должен быть не менее 6 символов");
      return;
    }
    if (confirmForm.password !== confirmForm.confirmPassword) {
      setServerError("Пароли не совпадают");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: confirmForm.email,
          code: confirmForm.code.trim(),
          password: confirmForm.password,
          confirmPassword: confirmForm.confirmPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setServerError(data?.error || "Не удалось обновить пароль");
        return;
      }

      setSuccessMessage("Пароль обновлён. Теперь можно войти.");
      setTimeout(() => navigate("/login"), 400);
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
          <Button variant="stroke" size="m" onClick={() => navigate("/")}>Главная</Button>
          <Button variant="stroke" size="m" onClick={() => navigate("/catalogue")}>Каталог</Button>
        </nav>
        <button className="auth-button-login" onClick={() => navigate("/login")}>
          <span>Войти</span>
        </button>
      </header>

      <main className="auth-main auth-main-login">
        <h1 className="auth-title">Восстановление пароля</h1>

        {step === "request" ? (
          <form onSubmit={submitRequest} className="auth-form" noValidate>
            <div className="auth-field-container" style={{ marginTop: "12px" }}>
              <label htmlFor="reset-email" className="auth-label auth-label-email">
                Email
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  id="reset-email"
                  name="email"
                  value={requestForm.email}
                  onChange={(e) => setRequestForm({ email: e.target.value })}
                  className="auth-input"
                  autoComplete="email"
                  placeholder="user@mail.ru"
                />
              </div>
            </div>

            {serverError && <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>{serverError}</p>}
            {successMessage && <p style={{ color: "#4caf50", fontSize: "14px", marginTop: "8px" }}>{successMessage}</p>}

            <Button type="submit" variant="primary" size="m" className="auth-submit-button" disabled={loading}>
              {loading ? "Загрузка..." : "Отправить код"}
            </Button>

            <p className="auth-terms auth-terms-login">
              <a
                href="#back"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Вернуться к входу
              </a>
            </p>
          </form>
        ) : (
          <form onSubmit={submitConfirm} className="auth-form" noValidate>
            <div className="auth-field-container" style={{ marginTop: "12px" }}>
              <label htmlFor="reset-code" className="auth-label">
                Код из email
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  id="reset-code"
                  name="code"
                  value={confirmForm.code}
                  onChange={(e) => setConfirmForm((prev) => ({ ...prev, code: e.target.value }))}
                  className="auth-input"
                  inputMode="numeric"
                  placeholder="123456"
                />
              </div>
            </div>

            <div className="auth-field-container" style={{ marginTop: "8px" }}>
              <label htmlFor="reset-password" className="auth-label auth-label-password">
                Новый пароль
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  id="reset-password"
                  name="password"
                  value={confirmForm.password}
                  onChange={(e) => setConfirmForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="auth-input"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="auth-field-container" style={{ marginTop: "8px" }}>
              <label htmlFor="reset-confirm" className="auth-label auth-label-confirm">
                Повторить пароль
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  id="reset-confirm"
                  name="confirmPassword"
                  value={confirmForm.confirmPassword}
                  onChange={(e) => setConfirmForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="auth-input"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {serverError && <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>{serverError}</p>}
            {successMessage && <p style={{ color: "#4caf50", fontSize: "14px", marginTop: "8px" }}>{successMessage}</p>}

            <Button type="submit" variant="primary" size="m" className="auth-submit-button" disabled={loading}>
              {loading ? "Загрузка..." : "Обновить пароль"}
            </Button>

            <p className="auth-terms auth-terms-login">
              <a
                href="#back"
                onClick={(e) => {
                  e.preventDefault();
                  setStep("request");
                  setServerError(null);
                  setSuccessMessage(null);
                }}
              >
                Отправить код ещё раз
              </a>
            </p>
          </form>
        )}
      </main>

      <footer className="auth-footer">
        <p>© 2026 DermoLand</p>
      </footer>
    </div>
  );
}

export default ForgotPassword;

