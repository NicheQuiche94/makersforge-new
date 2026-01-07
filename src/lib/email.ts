import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "andre@makersforge.co";
const FROM_EMAIL = "MakersForge <notifications@makersforge.co>";

export async function sendCandidateStatusUpdate({
  candidateEmail,
  candidateName,
  roleTitle,
  companyName,
  newStatus,
  interviewStage,
}: {
  candidateEmail: string;
  candidateName: string;
  roleTitle: string;
  companyName: string;
  newStatus: string;
  interviewStage?: string | null;
}) {
  const statusLabels: Record<string, string> = {
    contacted: "We've reached out to you",
    screening: "You're now in the screening stage",
    submitted: "Your profile has been submitted to the client",
    interviewing: `You're now in the interview stage${interviewStage ? ` (${interviewStage} Interview)` : ""}`,
    offer: "Great news! You have an offer",
    placed: "Congratulations! You've been placed",
  };

  const statusMessage = statusLabels[newStatus] || `Your status has been updated to ${newStatus}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: candidateEmail,
      subject: `Update on your application: ${roleTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
            .logo { color: #E8491F; font-size: 24px; font-weight: bold; margin-bottom: 24px; }
            h1 { font-size: 24px; margin: 0 0 16px 0; color: #ffffff; }
            .status { background-color: rgba(232, 73, 31, 0.1); border: 1px solid rgba(232, 73, 31, 0.3); color: #E8491F; padding: 12px 16px; border-radius: 8px; margin: 24px 0; }
            p { color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 16px 0; }
            .button { display: inline-block; background-color: #E8491F; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 16px; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">MAKERSFORGE</div>
              <h1>Hi ${candidateName},</h1>
              <p>There's an update on your application for <strong>${roleTitle}</strong> at <strong>${companyName}</strong>.</p>
              <div class="status">${statusMessage}</div>
              <p>Log in to your dashboard to see full details and any feedback.</p>
              <a href="https://app.makersforge.co/dashboard" class="button">View Dashboard</a>
              <div class="footer">
                <p>You're receiving this because you're registered on MakersForge.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send status update email:", error);
    return { success: false, error };
  }
}

export async function sendCandidateFeedbackNotification({
  candidateEmail,
  candidateName,
  roleTitle,
  companyName,
  stage,
  feedbackPreview,
}: {
  candidateEmail: string;
  candidateName: string;
  roleTitle: string;
  companyName: string;
  stage: string;
  feedbackPreview: string;
}) {
  const stageLabel = stage === "Screening" || stage === "Offer" ? stage : `${stage} Interview`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: candidateEmail,
      subject: `New feedback: ${roleTitle} at ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
            .logo { color: #E8491F; font-size: 24px; font-weight: bold; margin-bottom: 24px; }
            h1 { font-size: 24px; margin: 0 0 16px 0; color: #ffffff; }
            .stage { display: inline-block; background-color: rgba(232, 73, 31, 0.2); color: #E8491F; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500; margin-bottom: 16px; }
            .feedback { background-color: rgba(255,255,255,0.05); border-left: 3px solid #E8491F; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
            .feedback p { color: rgba(255,255,255,0.8); margin: 0; }
            p { color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 16px 0; }
            .button { display: inline-block; background-color: #E8491F; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 16px; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">MAKERSFORGE</div>
              <h1>Hi ${candidateName},</h1>
              <p>You've received new feedback for your application to <strong>${roleTitle}</strong> at <strong>${companyName}</strong>.</p>
              <span class="stage">${stageLabel}</span>
              <div class="feedback">
                <p>${feedbackPreview.length > 200 ? feedbackPreview.substring(0, 200) + "..." : feedbackPreview}</p>
              </div>
              <p>You can reply to this feedback directly in your dashboard.</p>
              <a href="https://app.makersforge.co/dashboard" class="button">View & Reply</a>
              <div class="footer">
                <p>You're receiving this because you're registered on MakersForge.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send feedback notification email:", error);
    return { success: false, error };
  }
}

export async function sendAdminReplyNotification({
  candidateName,
  candidateEmail,
  roleTitle,
  companyName,
  stage,
  replyPreview,
}: {
  candidateName: string;
  candidateEmail: string;
  roleTitle: string;
  companyName: string;
  stage: string;
  replyPreview: string;
}) {
  const stageLabel = stage === "Screening" || stage === "Offer" ? stage : `${stage} Interview`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `💬 ${candidateName} replied - ${roleTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .card { background-color: #1a1a1a; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.1); }
            .logo { color: #E8491F; font-size: 24px; font-weight: bold; margin-bottom: 24px; }
            h1 { font-size: 24px; margin: 0 0 16px 0; color: #ffffff; }
            .meta { color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 16px; }
            .stage { display: inline-block; background-color: rgba(34, 197, 94, 0.2); color: #22c55e; padding: 4px 12px; border-radius: 4px; font-size: 14px; font-weight: 500; margin-bottom: 16px; }
            .reply { background-color: rgba(34, 197, 94, 0.1); border-left: 3px solid #22c55e; padding: 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
            .reply p { color: rgba(255,255,255,0.8); margin: 0; }
            p { color: rgba(255,255,255,0.7); line-height: 1.6; margin: 0 0 16px 0; }
            .button { display: inline-block; background-color: #E8491F; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500; margin-top: 16px; }
            .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">MAKERSFORGE</div>
              <h1>New Reply from ${candidateName}</h1>
              <p class="meta">${roleTitle} at ${companyName} • ${candidateEmail}</p>
              <span class="stage">${stageLabel}</span>
              <div class="reply">
                <p>${replyPreview}</p>
              </div>
              <a href="https://app.makersforge.co/admin/processes" class="button">View in Admin</a>
              <div class="footer">
                <p>MakersForge Admin Notification</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send admin reply notification:", error);
    return { success: false, error };
  }
}