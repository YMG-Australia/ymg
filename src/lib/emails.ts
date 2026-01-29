export function generateAdminEmailHtml(
  registration: Record<string, unknown>,
  paid: boolean = false
): string {
  const badgeHtml = paid
    ? `<span class="paid-badge">PAID - $${registration.amount_paid}</span>`
    : `<span class="pending-badge">PENDING – payment link to be sent</span>`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4a853; color: #0a0f14; padding: 20px; text-align: center; }
        .section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px; }
        .section h3 { margin-top: 0; color: #0a0f14; border-bottom: 2px solid #d4a853; padding-bottom: 10px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .paid-badge { background: #22c55e; color: white; padding: 5px 15px; border-radius: 20px; display: inline-block; }
        .pending-badge { background: #eab308; color: #0a0f14; padding: 5px 15px; border-radius: 20px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 New Power Retreat Registration</h1>
          ${badgeHtml}
        </div>

        <div class="section">
          <h3>Personal Information</h3>
          <div class="field"><span class="label">Full Name:</span> <span class="value">${registration.full_name}</span></div>
          <div class="field"><span class="label">Date of Birth:</span> <span class="value">${registration.date_of_birth}</span></div>
          <div class="field"><span class="label">Mobile:</span> <span class="value">${registration.mobile_number}</span></div>
          <div class="field"><span class="label">Email:</span> <span class="value">${registration.email}</span></div>
          <div class="field"><span class="label">Location:</span> <span class="value">${registration.city_suburb}, ${registration.state}, ${registration.country}</span></div>
        </div>

        <div class="section">
          <h3>Dietary & Medical</h3>
          <div class="field"><span class="label">Dietary Requirements:</span> <span class="value">${registration.dietary_requirements}${registration.dietary_other ? ` (${registration.dietary_other})` : ""}</span></div>
          <div class="field"><span class="label">Medical Conditions:</span> <span class="value">${registration.medical_conditions}${registration.medical_details ? ` - ${registration.medical_details}` : ""}</span></div>
        </div>

        <div class="section">
          <h3>Emergency Contact</h3>
          <div class="field"><span class="label">Name:</span> <span class="value">${registration.emergency_contact_name}</span></div>
          <div class="field"><span class="label">Relationship:</span> <span class="value">${registration.emergency_contact_relationship}</span></div>
          <div class="field"><span class="label">Phone:</span> <span class="value">${registration.emergency_contact_phone}</span></div>
        </div>

        <div class="section">
          <h3>Faith & Background</h3>
          <div class="field"><span class="label">Vocation Status:</span> <span class="value">${registration.vocation_status ? String(registration.vocation_status).replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) : "Not specified"}</span></div>
          <div class="field"><span class="label">Catholic:</span> <span class="value">${registration.is_catholic || "Not specified"}</span></div>
          <div class="field"><span class="label">Parish:</span> <span class="value">${registration.parish || "Not specified"}</span></div>
          <div class="field"><span class="label">First YMG Event:</span> <span class="value">${registration.first_ymg_event || "Not specified"}</span></div>
          <div class="field"><span class="label">How Heard:</span> <span class="value">${registration.how_heard || "Not specified"}${registration.how_heard_other ? ` (${registration.how_heard_other})` : ""}</span></div>
        </div>

        <div class="section">
          <h3>Consent</h3>
          <div class="field"><span class="label">Confirms 18+:</span> <span class="value">${registration.confirms_18_or_older ? "Yes" : "No"}</span></div>
          <div class="field"><span class="label">Agrees to Code of Conduct:</span> <span class="value">${registration.agrees_to_code_of_conduct ? "Yes" : "No"}</span></div>
          <div class="field"><span class="label">Photo Consent:</span> <span class="value">${registration.photo_consent ? "Yes" : "No"}</span></div>
          <div class="field"><span class="label">Marketing Consent:</span> <span class="value">${registration.marketing_consent ? "Yes" : "No"}</span></div>
        </div>

        <div class="section">
          <h3>Registration Details</h3>
          <div class="field"><span class="label">Type:</span> <span class="value">${registration.registration_type === "early_bird" ? "Early Bird" : "Standard"}</span></div>
          <div class="field"><span class="label">Amount ${paid ? "Paid" : "Due"}:</span> <span class="value">$${registration.amount_paid} AUD</span></div>
          <div class="field"><span class="label">Discount Code:</span> <span class="value">${registration.discount_code || "None"}</span></div>
          <div class="field"><span class="label">Registration ID:</span> <span class="value">${registration.id}</span></div>
          <div class="field"><span class="label">Registered At:</span> <span class="value">${new Date(registration.created_at as string).toLocaleString()}</span></div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateRegistrantEmailHtml(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Georgia, 'Times New Roman', serif; 
          line-height: 1.8; 
          color: #333; 
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 40px 20px;
          background-color: #ffffff;
        }
        .header { 
          text-align: center; 
          padding-bottom: 30px;
          border-bottom: 2px solid #d4a853;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0a0f14;
          font-size: 28px;
          margin: 0;
          font-weight: normal;
        }
        .header .subtitle {
          color: #d4a853;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 10px;
        }
        .content {
          color: #444;
          font-size: 16px;
        }
        .content p {
          margin: 0 0 20px 0;
        }
        .greeting {
          font-style: italic;
          color: #0a0f14;
        }
        .list {
          margin: 20px 0;
          padding-left: 30px;
        }
        .list li {
          margin: 10px 0;
          color: #555;
        }
        .highlight {
          background-color: #fdf6e3;
          padding: 20px;
          border-left: 4px solid #d4a853;
          margin: 25px 0;
        }
        .signature {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        .signature p {
          margin: 5px 0;
        }
        .signature .name {
          font-weight: bold;
          color: #0a0f14;
        }
        .signature .title {
          font-style: italic;
          color: #666;
          font-size: 14px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Young Men of God</h1>
          <div class="subtitle">Men's Conference 2026</div>
        </div>

        <div class="content">
          <p class="greeting">Dear Brother in Christ,</p>

          <p>Thank you for registering for the Young Men of God Men's Conference.</p>

          <p>We are grateful for your response to this call, and we look forward to journeying with you during this powerful weekend of faith, brotherhood, and renewal.</p>

          <p>Your registration has been received successfully. You will receive a payment link via email shortly. Over the coming weeks, we will be in touch via email with further important details, including:</p>

          <ul class="list">
            <li>Program schedule</li>
            <li>Packing and arrival information</li>
            <li>Accommodation details</li>
            <li>What to expect during the conference</li>
          </ul>

          <div class="highlight">
            <p style="margin: 0;"><strong>Please keep an eye on your inbox</strong> and ensure our emails do not go to your spam folder.</p>
          </div>

          <p>In the meantime, please keep this conference and all participants in your prayers as we prepare together.</p>

          <p>If you have any questions, feel free to contact us by replying to this email — <a href="mailto:ymgmovementaustralia@gmail.com" style="color: #d4a853;">ymgmovementaustralia@gmail.com</a>.</p>

          <p>May the Lord bless you and guide you as you prepare to go deeper, grow stronger, and step forward in His power.</p>

          <div class="signature">
            <p>With prayers and blessings,</p>
            <p class="name">Fr Terrence Shanaka MGL</p>
            <p class="title">Chaplain – Young Men of God Movement and team</p>
          </div>
        </div>

        <div class="footer">
          <p>Young Men of God Movement Australia</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
