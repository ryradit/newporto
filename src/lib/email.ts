export async function sendLeadEmailNotification(lead: {
  visitorName: string;
  visitorCompany: string;
  intent: 'client' | 'recruiter';
  details: string;
  summary: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn("RESEND_API_KEY is not defined in environment variables. Email notification skipped.");
    return;
  }

  const subject = lead.intent === 'recruiter'
    ? `💼 [AI Hiring Agent] Recruiter Lead: ${lead.visitorName} from ${lead.visitorCompany}`
    : `🚀 [AI Hiring Agent] Client Proposal: ${lead.visitorName} from ${lead.visitorCompany}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
      <h2 style="color: #4f46e5; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
        ${lead.intent === 'recruiter' ? '💼 New Recruiter Inquiry' : '🚀 New Client Project Proposal'}
      </h2>
      
      <p style="font-size: 16px;">Hey Ryan,</p>
      <p style="font-size: 16px;">Someone just reached the result stage on your AI Hiring Agent! Here are the details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 120px;">Name</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.visitorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.visitorCompany}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Type</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-transform: capitalize;">${lead.intent}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Details</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${lead.details}</td>
        </tr>
      </table>

      <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #4f46e5; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #111827;">AI Summary & Match</h3>
        <p style="white-space: pre-wrap; font-size: 14px; margin-bottom: 0;">${lead.summary}</p>
      </div>

      <p style="font-size: 14px; color: #6b7280; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 15px;">
        Sent automatically by your portfolio AI Agent. Check your Supabase <strong>agent_leads</strong> table for the full breakdown!
      </p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'AI Agent <onboarding@resend.dev>',
        to: 'ryradit@gmail.com',
        subject: subject,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Resend API returned ${res.status}: ${errorText}`);
    }

    console.log(`Lead email notification successfully sent to ryradit@gmail.com via Resend!`);
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
  }
}
