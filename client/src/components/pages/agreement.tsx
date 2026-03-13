import { useNavigate } from 'react-router-dom';
import Button from '../Button';
import '../../style/auth.scss';
import agreementText from '../../assets/agreement.txt?raw';

function Agreement() {
  const navigate = useNavigate();

  return (
    <div className="auth-page auth-page-register">
      <header className="auth-header">
        <nav className="auth-nav" role="navigation" aria-label="Main navigation">
          <Button variant="stroke" size="m" onClick={() => navigate('/')}>Главная</Button>
          <Button variant="stroke" size="m" onClick={() => navigate('/catalogue')}>Каталог</Button>
        </nav>
        <button className="auth-button-login" onClick={() => navigate(-1)}>
          <span>Назад</span>
        </button>
      </header>

      <main className="auth-main auth-main-register agreement-main">
        <h1 className="auth-title">Пользовательское соглашение</h1>
        <div className="agreement-content">
          <pre className="agreement-pre">{agreementText}</pre>
        </div>
      </main>

      <footer className="auth-footer">
        <p>© 2026 DermoLand</p>
      </footer>
    </div>
  );
}

export default Agreement;

