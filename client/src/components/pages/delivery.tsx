import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import "../../style/auth.scss";

interface DeliveryForm {
  postalCode: string;
  address: string;
}

interface FormErrors {
  postalCode?: string;
  address?: string;
}

const validate = (formData: DeliveryForm): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.postalCode.trim()) {
    errors.postalCode = "Введите почтовый индекс";
  } else if (!/^[0-9]{6}$/.test(formData.postalCode.trim())) {
    errors.postalCode = "Почтовый индекс должен содержать 6 цифр";
  }

  if (!formData.address.trim()) {
    errors.address = "Введите адрес доставки";
  } else if (formData.address.trim().length < 5) {
    errors.address = "Адрес должен быть не короче 5 символов";
  }

  return errors;
};

function Delivery() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<DeliveryForm>({
    postalCode: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof DeliveryForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/basket/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          type: "courier",
          postalCode: formData.postalCode.trim(),
          address: formData.address.trim(),
        }),
      });

      if (response.status === 401) {
        navigate("/auth");
        return;
      }

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setServerError(data?.error || "Не удалось сохранить данные доставки");
        return;
      }

      setSuccessMessage("Данные доставки сохранены. Перенаправляем в корзину...");
      setTimeout(() => navigate("/cart"), 400);
    } catch {
      setServerError("Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на порту 8080.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <main className="auth-main">
        <h1 className="auth-title">Доставка</h1>
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {serverError && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "8px" }}>{serverError}</p>
          )}
          {successMessage && (
            <p style={{ color: "#4caf50", fontSize: "14px", marginTop: "8px" }}>{successMessage}</p>
          )}
          <div className="auth-field-container" style={{ marginTop: "16px" }}>
            <label
              htmlFor="postalCode"
              className="auth-label auth-label-postal-code"
            >
              Почтовый индекс
            </label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange("postalCode", e.target.value)}
                className={`auth-input ${
                  errors.postalCode ? "auth-input--error" : ""
                }`}
                autoComplete="postal-code"
              />
            </div>
            {errors.postalCode && (
              <p className="auth-error-text">{errors.postalCode}</p>
            )}
          </div>

          <div className="auth-field-container" style={{ marginTop: "12px" }}>
            <label
              htmlFor="address"
              className="auth-label auth-label-address"
            >
              Адрес
            </label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className={`auth-input ${
                  errors.address ? "auth-input--error" : ""
                }`}
                autoComplete="street-address"
              />
            </div>
            {errors.address && (
              <p className="auth-error-text">{errors.address}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="m"
            className="auth-submit-button"
            disabled={submitting}
          >
            {submitting ? "Отправка..." : "Сохранить адрес"}
          </Button>
        </form>
      </main>
    </div>
  );
}

export default Delivery;

