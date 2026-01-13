import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "MakersForge <andre@makersforge.gg>";
const ADMIN_EMAIL = "andre@makersforge.gg";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email exception:", error);
    return { success: false, error };
  }
}

// Notify admin when candidate sends a message
export async function notifyAdminNewMessage({
  candidateName,
  candidateEmail,
  messagePreview,
  dashboardLink,
}: {
  candidateName: string;
  candidateEmail: string;
  messagePreview: string;
  dashboardLink: string;
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; padding: 32px; border-radius: 12px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">New Message from Candidate</h1>
        <p style="color: #999999; font-size: 14px; margin: 0 0 24px 0;">Someone's trying to reach you</p>
        
        <div style="background: #252525; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #E8491F; font-size: 14px; font-weight: 600; margin: 0 0 4px 0;">${candidateName}</p>
          <p style="color: #666666; font-size: 13px; margin: 0 0 16px 0;">${candidateEmail}</p>
          <p style="color: #cccccc; font-size: 15px; margin: 0; line-height: 1.5;">"${messagePreview}"</p>
        </div>
        
        <a href="${dashboardLink}" style="display: inline-block; background: #E8491F; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View & Reply</a>
      </div>
      
      <p style="color: #666666; font-size: 12px; text-align: center; margin-top: 24px;">
        MakersForge • Building World Class Teams in Mobile Games
      </p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `💬 New message from ${candidateName}`,
    html,
    replyTo: candidateEmail,
  });
}

// Notify candidate when their process is updated
export async function notifyCandidateProcessUpdate({
  candidateName,
  candidateEmail,
  companyName,
  newStage,
  dashboardLink,
}: {
  candidateName: string;
  candidateEmail: string;
  companyName: string;
  newStage: string;
  dashboardLink: string;
}) {
  const stageMessages: Record<string, string> = {
    screening: "We're reviewing your profile for this opportunity.",
    submitted: "Your profile has been submitted to the company.",
    "1st_interview": "Great news! The company wants to interview you.",
    "2nd_interview": "You're progressing to the next interview round.",
    "3rd_interview": "You're moving forward to another interview round.",
    "final_interview": "You've reached the final interview stage!",
    interviewing: "Great news! The company wants to interview you.",
    technical: "You have a technical assessment coming up.",
    offer: "Exciting times! There's an offer on the table.",
    placed: "Congratulations! You've been placed. 🎉",
    rejected: "Unfortunately, the company has decided not to proceed.",
    withdrawn: "This process has been withdrawn.",
    // Feedback stages
    screening_feedback: "We have feedback on your screening.",
    interviewing_feedback: "We have feedback from your interview.",
    technical_feedback: "We have feedback on your technical assessment.",
    offer_feedback: "We have an update on your offer.",
  };

  const stageMessage = stageMessages[newStage] || "There's been an update to your process.";
  
  // Format stage for display
  const displayStage = newStage
    .replace(/_/g, " ")
    .replace(/feedback/gi, "")
    .trim();

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; padding: 32px; border-radius: 12px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">Process Update</h1>
        <p style="color: #999999; font-size: 14px; margin: 0 0 24px 0;">Hi ${candidateName.split(' ')[0]}, there's news on your application</p>
        
        <div style="background: #252525; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Company</p>
          <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">${companyName}</p>
          
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Status</p>
          <p style="color: #E8491F; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; text-transform: capitalize;">${displayStage}</p>
          
          <p style="color: #cccccc; font-size: 14px; margin: 0; line-height: 1.5;">${stageMessage}</p>
        </div>
        
        <a href="${dashboardLink}" style="display: inline-block; background: #E8491F; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Details</a>
      </div>
      
      <p style="color: #666666; font-size: 12px; text-align: center; margin-top: 24px;">
        MakersForge • Building World Class Teams in Mobile Games
      </p>
    </div>
  `;

  // Don't email for certain stages
  if (["withdrawn"].includes(newStage)) {
    return { success: true, skipped: true };
  }

  return sendEmail({
    to: candidateEmail,
    subject: `${companyName} - Process Update`,
    html,
  });
}

// Notify admin when candidate replies to feedback
export async function notifyAdminFeedbackReply({
  candidateName,
  candidateEmail,
  companyName,
  roleTitle,
  messagePreview,
  processLink,
}: {
  candidateName: string;
  candidateEmail: string;
  companyName: string;
  roleTitle: string;
  messagePreview: string;
  processLink: string;
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; padding: 32px; border-radius: 12px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">Candidate Reply</h1>
        <p style="color: #999999; font-size: 14px; margin: 0 0 24px 0;">${candidateName} responded to feedback</p>
        
        <div style="background: #252525; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Process</p>
          <p style="color: #ffffff; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">${roleTitle}</p>
          <p style="color: #E8491F; font-size: 14px; margin: 0 0 16px 0;">${companyName}</p>
          
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Message</p>
          <p style="color: #cccccc; font-size: 15px; margin: 0; line-height: 1.5;">"${messagePreview}"</p>
        </div>
        
        <a href="${processLink}" style="display: inline-block; background: #E8491F; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">View Process</a>
      </div>
      
      <p style="color: #666666; font-size: 12px; text-align: center; margin-top: 24px;">
        MakersForge • Building World Class Teams in Mobile Games
      </p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `💬 ${candidateName} replied - ${roleTitle}`,
    html,
    replyTo: candidateEmail,
  });
}

// Notify admin of new quote reservation
export async function notifyAdminNewQuote({
  companyName,
  email,
  permanentHires,
  contractHires,
  contractDuration,
  totalQuote,
  paymentPreference,
}: {
  companyName: string;
  email: string;
  permanentHires: number;
  contractHires: number;
  contractDuration: number;
  totalQuote: number;
  paymentPreference: string;
}) {
  const teamComposition = [
    permanentHires > 0 ? `${permanentHires} permanent` : null,
    contractHires > 0 ? `${contractHires} contractors (${contractDuration}mo)` : null,
  ].filter(Boolean).join(" + ");

  const formattedQuote = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(totalQuote);

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; padding: 32px; border-radius: 12px;">
        <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px 0;">🔥 New Quote Reserved</h1>
        <p style="color: #999999; font-size: 14px; margin: 0 0 24px 0;">Someone's interested in building a team</p>
        
        <div style="background: #252525; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Company</p>
          <p style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">${companyName}</p>
          
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Contact</p>
          <p style="color: #cccccc; font-size: 14px; margin: 0 0 16px 0;">${email}</p>
          
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Team</p>
          <p style="color: #cccccc; font-size: 14px; margin: 0 0 16px 0;">${teamComposition}</p>
          
          <p style="color: #666666; font-size: 13px; margin: 0 0 4px 0;">Quote</p>
          <p style="color: #E8491F; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;">${formattedQuote}</p>
          <p style="color: #666666; font-size: 12px; margin: 0;">${paymentPreference === 'monthly' ? 'Prefers monthly payments' : 'Single payment'}</p>
        </div>
        
        <a href="mailto:${email}" style="display: inline-block; background: #E8491F; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">Reply to ${companyName}</a>
      </div>
      
      <p style="color: #666666; font-size: 12px; text-align: center; margin-top: 24px;">
        Quote valid for 30 days
      </p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `🔥 ${companyName} reserved a ${formattedQuote} team build quote`,
    html,
    replyTo: email,
  });
}