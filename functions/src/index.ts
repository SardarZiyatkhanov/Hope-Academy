import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Resend } from "resend";

initializeApp();

const resendApiKey = defineSecret("RESEND_API_KEY");

const TEAM_EMAIL = "sziyatkhanov17499@ada.edu.az";
const FROM_EMAIL = "Hope Academy <onboarding@resend.dev>";

function getResend(): Resend {
  return new Resend(resendApiKey.value());
}

// ─── New lead from website form ───
export const onNewLead = onDocumentCreated(
  { document: "leads/{leadId}", secrets: [resendApiKey] },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const resend = getResend();
    console.log("onNewLead triggered for:", data.name, data.surname);

    const teamResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `Yeni müraciət: ${data.name} ${data.surname}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#0e2454;padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:#fff;margin:0;font-size:18px">Yeni müraciət daxil oldu</h2>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:120px">Ad Soyad</td><td style="padding:8px 0;font-weight:600">${data.name} ${data.surname}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Telefon</td><td style="padding:8px 0">${data.phone}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">E-poçt</td><td style="padding:8px 0">${data.email}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Ölkə</td><td style="padding:8px 0">${data.country ?? "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">Səviyyə</td><td style="padding:8px 0">${data.level ?? "—"}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">İxtisas</td><td style="padding:8px 0">${data.specialty ?? "—"}</td></tr>
            </table>
            <div style="margin-top:20px">
              <a href="https://hopeacademy.az/admin/leads" style="background:#1a4aa8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
                Admin paneldə bax
              </a>
            </div>
          </div>
        </div>
      `,
    });
    console.log("Team email result:", JSON.stringify(teamResult));

    if (data.email) {
      const userResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.email,
        subject: "Müraciətiniz alındı — Hope Academy",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
            <div style="background:#0e2454;padding:24px;border-radius:12px 12px 0 0">
              <h2 style="color:#fff;margin:0;font-size:18px">Hope Academy</h2>
            </div>
            <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
              <p style="font-size:15px;margin:0 0 12px">Salam ${data.name},</p>
              <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 12px">
                Müraciətiniz uğurla qeydə alındı. Komandamız <strong>24 saat ərzində</strong> sizinlə əlaqə saxlayacaq.
              </p>
              <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 20px">
                Sualınız varsa birbaşa bu emailə cavab yaza bilərsiniz.
              </p>
              <p style="font-size:13px;color:#6b7280;margin:0">
                Hörmətlə,<br/>Hope Academy komandası
              </p>
            </div>
          </div>
        `,
      });
      console.log("User email result:", JSON.stringify(userResult));
    }
  },
);

// ─── New contact message ───
export const onNewContactMessage = onDocumentCreated(
  { document: "contactMessages/{messageId}", secrets: [resendApiKey] },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const resend = getResend();

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `Yeni mesaj: ${data.subject || data.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#0e2454;padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:#fff;margin:0;font-size:18px">Yeni əlaqə mesajı</h2>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:100px">Adı</td><td style="padding:8px 0;font-weight:600">${data.name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">E-poçt</td><td style="padding:8px 0">${data.email}</td></tr>
              ${data.phone ? `<tr><td style="padding:8px 0;color:#6b7280">Telefon</td><td style="padding:8px 0">${data.phone}</td></tr>` : ""}
              ${data.subject ? `<tr><td style="padding:8px 0;color:#6b7280">Mövzu</td><td style="padding:8px 0">${data.subject}</td></tr>` : ""}
            </table>
            <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;line-height:1.6">
              ${data.message}
            </div>
            <div style="margin-top:20px">
              <a href="https://hopeacademy.az/admin/messages" style="background:#1a4aa8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
                Admin paneldə bax
              </a>
            </div>
          </div>
        </div>
      `,
    });
  },
);

// ─── New student registered ───
export const onNewStudent = onDocumentCreated(
  { document: "users/{userId}", secrets: [resendApiKey] },
  async (event) => {
    const data = event.data?.data();
    if (!data || data.role !== "student") return;

    const resend = getResend();

    await resend.emails.send({
      from: FROM_EMAIL,
      to: TEAM_EMAIL,
      subject: `Yeni tələbə qeydiyyatı: ${data.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto">
          <div style="background:#0e2454;padding:24px;border-radius:12px 12px 0 0">
            <h2 style="color:#fff;margin:0;font-size:18px">Yeni tələbə qeydiyyatdan keçdi</h2>
          </div>
          <div style="border:1px solid #e5e7eb;border-top:none;padding:24px;border-radius:0 0 12px 12px">
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#6b7280;width:100px">Ad</td><td style="padding:8px 0;font-weight:600">${data.name}</td></tr>
              <tr><td style="padding:8px 0;color:#6b7280">E-poçt</td><td style="padding:8px 0">${data.email}</td></tr>
              ${data.phone ? `<tr><td style="padding:8px 0;color:#6b7280">Telefon</td><td style="padding:8px 0">${data.phone}</td></tr>` : ""}
            </table>
            <div style="margin-top:20px">
              <a href="https://hopeacademy.az/admin/students" style="background:#1a4aa8;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600">
                Tələbələrə bax
              </a>
            </div>
          </div>
        </div>
      `,
    });
  },
);

// ─── Keep auth custom claims in sync with each user's Firestore role ───
// Storage security rules check request.auth.token.role directly (no
// cross-service Firestore read), so this claim must exist and stay current.
export const syncUserRoleClaim = onDocumentWritten("users/{userId}", async (event) => {
  const userId = event.params.userId;
  const after = event.data?.after?.data();

  if (!after) {
    await getAuth().setCustomUserClaims(userId, null);
    return;
  }

  await getAuth().setCustomUserClaims(userId, { role: after.role });
});
