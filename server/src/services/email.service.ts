import nodemailer from "nodemailer";

class EmailService {
    async sendResetCode(email: string, code: string): Promise<void> {
        const user: string | undefined = process.env.MAIL_USER;
        const pass: string | undefined = process.env.MAIL_PASSWORD;
        const host: string = process.env.MAIL_HOST || "smtp.gmail.com";
        const portValue: string = process.env.MAIL_PORT || "587";
        const port: number = Number(portValue);
        const appName: string = process.env.APP_NAME || "L-Shop";

        if (!user || !pass) {
            throw new Error("MAIL_USER or MAIL_PASSWORD is not set in environment variables");
        }

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass
            }
        });

        const text: string = `
Здравствуйте!

Вы запросили восстановление пароля в ${appName}.

Ваш код для восстановления: ${code}

Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.
`;

        const html: string = `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Восстановление пароля</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width:480px;background:#ffffff;border-radius:12px;box-shadow:0 10px 30px rgba(15,23,42,0.08);overflow:hidden;">
            <tr>
              <td style="padding:24px 24px 16px 24px;background:linear-gradient(135deg,#111827,#1f2937);">
                <h1 style="margin:0;font-size:20px;line-height:1.4;color:#f9fafb;font-weight:600;">Восстановление пароля</h1>
                <p style="margin:8px 0 0 0;font-size:14px;color:#d1d5db;">Вы запросили код для входа в ${appName}.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#111827;">
                  Здравствуйте! Используйте этот код для восстановления доступа к вашему аккаунту:
                </p>
                <div style="margin:0 0 16px 0;text-align:center;">
                  <div style="display:inline-block;padding:12px 24px;border-radius:999px;background:#111827;color:#f9fafb;font-size:24px;letter-spacing:6px;font-weight:600;font-family:'SF Mono',Menlo,Monaco,Consolas,monospace;">
                    ${code}
                  </div>
                </div>
                <p style="margin:0 0 8px 0;font-size:12px;line-height:1.6;color:#6b7280;">
                  Код действует в течение ограниченного времени. По истечении срока действия запросите новый код на странице восстановления пароля.
                </p>
                <p style="margin:0;font-size:12px;line-height:1.6;color:#9ca3af;">
                  Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо — ваш текущий пароль останется без изменений.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 20px 24px;border-top:1px solid #e5e7eb;background-color:#f9fafb;">
                <p style="margin:0;font-size:11px;line-height:1.6;color:#9ca3af;">
                  Это автоматическое письмо, отвечать на него не нужно.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

        await transporter.sendMail({
            from: user,
            to: email,
            subject: `Код для восстановления пароля · ${appName}`,
            text,
            html
        });
    }
}

export default new EmailService();

