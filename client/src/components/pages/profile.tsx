import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import '../../style/auth.scss';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const validate = (formData: ProfileForm, isPasswordChange: boolean): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Введите имя';
  } else if (!/^[a-zA-Z]+$/.test(formData.name)) {
    errors.name = 'Имя должно содержать только латинские буквы';
  } else if (formData.name.length < 2) {
    errors.name = 'Имя должно быть не менее 2 символов';
  }

  if (!formData.email.trim()) {
    errors.email = 'Введите email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Введите корректный email (например: user@mail.ru)';
  }

  if (!formData.phone.trim()) {
    errors.phone = 'Введите номер телефона';
  } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
    errors.phone = 'Введите корректный номер (например: +79991234567)';
  }

  if (isPasswordChange) {
    if (formData.password.length > 0 && formData.password.length < 6) {
      errors.password = 'Пароль должен быть не менее 6 символов';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }
  }

  return errors;
};

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.status === 401) {
          if (!cancelled) navigate('/auth');
          return;
        }
        if (!response.ok) {
          if (!cancelled) setServerError('Не удалось загрузить данные');
          return;
        }
        const data = await response.json();
        if (!cancelled && data?.userInfo) {
          setUserInfo(data.userInfo);
          setFormData((prev) => ({
            ...prev,
            name: data.userInfo.name ?? '',
            email: data.userInfo.email ?? '',
            phone: data.userInfo.phone ?? '',
          }));
        }
      } catch {
        if (!cancelled) setServerError('Не удалось подключиться к серверу');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleInputChange = (field: keyof ProfileForm, value: string) => {
    if (field === 'name' && value && !/^[a-zA-Z]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccessMessage(null);
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } finally {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const isPasswordChange = formData.password.length > 0 || formData.confirmPassword.length > 0;
    const validationErrors = validate(formData, isPasswordChange);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    try {
      const body: { name?: string; email?: string; phone?: string; password?: string; confirmPassword?: string } = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      if (formData.password) {
        body.password = formData.password;
        body.confirmPassword = formData.confirmPassword;
      }

      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(data?.error || 'Не удалось сохранить данные');
        return;
      }

      if (data?.userInfo) {
        setUserInfo(data.userInfo);
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        setSuccessMessage('Данные сохранены');
      }
    } catch {
      setServerError('Не удалось подключиться к серверу');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-main">
        <div className="profile-card auth-main auth-main-register">
          <p className="auth-title">Загрузка...</p>
        </div>
      </main>
    );
  }

  if (!userInfo) {
    return (
      <main className="profile-main">
        <div className="profile-card auth-main auth-main-register">
          <p className="auth-title">Не удалось загрузить профиль</p>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-main">
      <div className="profile-card auth-main auth-main-register">
        <h1 className="auth-title">Личный кабинет</h1>
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="auth-field-container" style={{ marginTop: '16px' }}>
            <label htmlFor="profile-name" className="auth-label auth-label-name">
              Имя (только латиница)
            </label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                id="profile-name"
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`auth-input ${errors.name ? 'auth-input--error' : ''}`}
                aria-required="true"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>
            )}
          </div>

          <div className="auth-field-container" style={{ marginTop: '8px' }}>
            <label htmlFor="profile-email" className="auth-label auth-label-email">
              Email
            </label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                id="profile-email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                aria-required="true"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>
            )}
          </div>

          <div className="auth-field-container" style={{ marginTop: '8px' }}>
            <label htmlFor="profile-phone" className="auth-label auth-label-phone">
              Номер телефона
            </label>
            <div className="auth-input-wrapper">
              <input
                type="tel"
                id="profile-phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`auth-input ${errors.phone ? 'auth-input--error' : ''}`}
                aria-required="true"
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>
            )}
          </div>

          <div className="auth-field-container" style={{ marginTop: '8px' }}>
            <label htmlFor="profile-password" className="auth-label auth-label-password">
              Новый пароль (оставьте пустым, чтобы не менять)
            </label>
            <div className="auth-input-wrapper">
              <input
                type="password"
                id="profile-password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`auth-input ${errors.password ? 'auth-input--error' : ''}`}
                autoComplete="new-password"
              />
            </div>
            {errors.password && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>
            )}
          </div>

          <div className="auth-field-container" style={{ marginTop: '8px' }}>
            <label htmlFor="profile-confirmPassword" className="auth-label auth-label-confirm">
              Повторить новый пароль
            </label>
            <div className="auth-input-wrapper">
              <input
                type="password"
                id="profile-confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`auth-input ${errors.confirmPassword ? 'auth-input--error' : ''}`}
                autoComplete="new-password"
              />
            </div>
            {errors.confirmPassword && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {serverError && (
            <p style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>{serverError}</p>
          )}
          {successMessage && (
            <p style={{ color: '#4caf50', fontSize: '14px', marginTop: '8px' }}>{successMessage}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="m"
            className="auth-submit-button"
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>

          <div className="profile-logout-wrap">
            <Button
              type="button"
              variant="stroke"
              size="m"
              className="auth-submit-button profile-logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              Выйти из аккаунта
            </Button>
          </div>
        </form>
      </div>

      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div className="logout-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 id="logout-modal-title" className="logout-modal-title">
              Хотите выйти?
            </h2>
            <div className="logout-modal-actions">
              <Button
                type="button"
                variant="primary"
                size="m"
                onClick={handleLogout}
              >
                Да
              </Button>
              <Button
                type="button"
                variant="stroke"
                size="m"
                onClick={() => setShowLogoutModal(false)}
              >
                Нет
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Profile;
