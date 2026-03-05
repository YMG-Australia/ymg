"use client";

import { useState } from "react";
import { cormorant, inter } from "@/components/ui/fonts";
import { DISCOUNT_CODES, DiscountCode } from "@/lib/discountCodes";

interface FormData {
  // Personal Info
  full_name: string;
  date_of_birth: string;
  mobile_number: string;
  email: string;
  city_suburb: string;
  state: string;
  country: string;
  
  // Dietary & Medical
  dietary_requirements: string;
  dietary_other: string;
  medical_conditions: string;
  medical_details: string;
  
  // Emergency Contact
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
  
  // Faith & Background
  is_clergy: string;
  vocation_status: string;
  is_catholic: string;
  parish: string;
  first_ymg_event: string;
  how_heard: string;
  how_heard_other: string;
  
  // Consent
  confirms_18_or_older: boolean;
  agrees_to_code_of_conduct: boolean;
  photo_consent: string;
  marketing_consent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  full_name: "",
  date_of_birth: "",
  mobile_number: "",
  email: "",
  city_suburb: "",
  state: "",
  country: "",
  dietary_requirements: "",
  dietary_other: "",
  medical_conditions: "",
  medical_details: "",
  emergency_contact_name: "",
  emergency_contact_relationship: "",
  emergency_contact_phone: "",
  is_clergy: "no",
  vocation_status: "layperson",
  is_catholic: "",
  parish: "",
  first_ymg_event: "",
  how_heard: "",
  how_heard_other: "",
  confirms_18_or_older: false,
  agrees_to_code_of_conduct: false,
  photo_consent: "",
  marketing_consent: false,
};


export default function PowerRetreatSignUp() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");
  const [showCoCModal, setShowCoCModal] = useState(false);
  const [cocModalAgreed, setCocModalAgreed] = useState(false);

  const now = new Date();
  const earlyBirdDeadline = new Date("2026-04-30T23:59:59");
  const standardStart = new Date("2026-05-01T00:00:00");
  const registrationClose = new Date("2026-06-30T23:59:59");
  
  const isEarlyBirdAvailable = now <= earlyBirdDeadline;
  const isStandardAvailable = now >= standardStart && now <= registrationClose;
  const isRegistrationOpen = now <= registrationClose;

  const basePrice = isEarlyBirdAvailable ? 250 : 300;
  const currentPrice = appliedDiscount ? appliedDiscount.price : basePrice;
  const registrationType = appliedDiscount 
    ? `discount_${appliedDiscount.code.toLowerCase()}` 
    : (isEarlyBirdAvailable ? "early_bird" : "standard");

  const applyDiscountCode = () => {
    setDiscountError("");
    setDiscountSuccess("");
    
    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code");
      return;
    }

    const foundCode = DISCOUNT_CODES.find(
      (dc) => dc.code.toLowerCase() === discountCode.trim().toLowerCase()
    );

    if (!foundCode) {
      setDiscountError("Invalid discount code");
      setAppliedDiscount(null);
      return;
    }

    // Check if code has expired
    if (foundCode.validUntil && now > foundCode.validUntil) {
      setDiscountError("This discount code has expired");
      setAppliedDiscount(null);
      return;
    }

    setAppliedDiscount(foundCode);
    setDiscountSuccess(`Discount applied! New price: $${foundCode.price.toFixed(2)}`);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountSuccess("");
    setDiscountError("");
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Personal Info validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    }
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^[\d\s+()-]{8,}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Please enter a valid phone number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.city_suburb.trim()) {
      newErrors.city_suburb = "City/Suburb is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Dietary & Medical
    if (!formData.dietary_requirements) {
      newErrors.dietary_requirements = "Please select dietary requirements";
    }
    if (formData.dietary_requirements === "other" && !formData.dietary_other.trim()) {
      newErrors.dietary_other = "Please specify your dietary requirements";
    }
    if (!formData.medical_conditions) {
      newErrors.medical_conditions = "Please indicate if you have medical conditions";
    }
    if (formData.medical_conditions === "yes" && !formData.medical_details.trim()) {
      newErrors.medical_details = "Please provide details of your medical conditions";
    }

    // Emergency Contact
    if (!formData.emergency_contact_name.trim()) {
      newErrors.emergency_contact_name = "Emergency contact name is required";
    }
    if (!formData.emergency_contact_relationship.trim()) {
      newErrors.emergency_contact_relationship = "Relationship is required";
    }
    if (!formData.emergency_contact_phone.trim()) {
      newErrors.emergency_contact_phone = "Emergency contact phone is required";
    }

    // Consent
    if (!formData.confirms_18_or_older) {
      newErrors.confirms_18_or_older = "You must confirm you are 18 or older";
    }
    if (!formData.photo_consent) {
      newErrors.photo_consent = "Please select a photo consent option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    // Show the Code of Conduct modal before submitting
    setCocModalAgreed(false);
    setShowCoCModal(true);
  };

  const confirmAndSubmit = async () => {
    if (!cocModalAgreed) return;

    setShowCoCModal(false);
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          agrees_to_code_of_conduct: true,
          registration_type: registrationType,
          amount_paid: currentPrice,
          discount_code: appliedDiscount?.code || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to success page
      window.location.href = "/power-retreat-sign-up/success";
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-[var(--background)] border border-[var(--border-subtle)] rounded-lg text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors";
  const labelClasses = `${inter.className} block text-[var(--foreground)] font-medium mb-2`;
  const errorClasses = `${inter.className} text-red-400 text-sm mt-1`;
  const sectionClasses = "card p-8 mb-8";

  if (!isRegistrationOpen) {
    return (
      <div className="min-h-screen">
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />
          <div className="relative max-w-2xl mx-auto text-center">
            <h1 className={`${cormorant.className} text-5xl font-bold text-[var(--foreground)] mb-6`}>
              Registration Closed
            </h1>
            <p className={`${inter.className} text-[var(--foreground-muted)]`}>
              Registration for this event has closed. Please contact us for more information.
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Code of Conduct Modal */}
      {showCoCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCoCModal(false)}
          />
          {/* Modal */}
          <div className="relative bg-[var(--background)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-subtle)]">
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)]`}>
                Code of Conduct
              </h2>
              <p className={`${inter.className} text-[var(--foreground-muted)] text-sm mt-1`}>
                Please read and agree to proceed with your registration.
              </p>
            </div>
            {/* Scrollable content */}
            <div className="p-6 overflow-y-auto flex-1">
              <p className={`${inter.className} text-[var(--foreground-muted)] text-sm mb-4`}>
                YMG is committed to creating a safe and respectful environment in line with Australian Catholic safeguarding standards.
              </p>
              <div className="mb-4">
                <p className={`${inter.className} text-[var(--foreground)] font-semibold text-sm mb-2`}>Participants must:</p>
                <ul className={`${inter.className} text-[var(--foreground-muted)] text-sm space-y-1 list-none`}>
                  {[
                    "Respect the dignity and rights of all individuals",
                    "Maintain appropriate physical and emotional boundaries",
                    "Avoid any form of bullying, harassment, or discrimination",
                    "Follow instructions of leaders and safeguarding officers",
                    "Report any concerns or incidents immediately",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[var(--accent-primary)] mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <p className={`${inter.className} text-[var(--foreground)] font-semibold text-sm mb-2`}>Prohibited behaviours:</p>
                <ul className={`${inter.className} text-[var(--foreground-muted)] text-sm space-y-1 list-none`}>
                  {[
                    "Abuse or misconduct of any kind",
                    "Use of alcohol, drugs, or unsafe behaviour",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-red-400 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className={`${inter.className} text-[var(--foreground-muted)] text-sm italic`}>
                YMG reserves the right to remove participants who breach these standards.
              </p>
            </div>
            {/* Footer */}
            <div className="p-6 border-t border-[var(--border-subtle)] space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cocModalAgreed}
                  onChange={(e) => setCocModalAgreed(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-[var(--accent-primary)] flex-shrink-0"
                />
                <span className={`${inter.className} text-[var(--foreground)] text-sm`}>
                  I have read and agree to abide by the YMG Code of Conduct. <span className="text-red-400">*</span>
                </span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCoCModal(false)}
                  className={`${inter.className} flex-1 py-3 px-4 border border-[var(--border-subtle)] rounded-lg text-[var(--foreground-muted)] hover:border-[var(--foreground-muted)] transition-colors text-sm`}
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={confirmAndSubmit}
                  disabled={!cocModalAgreed || isSubmitting}
                  className="flex-1 btn-primary py-3 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : "Confirm & Register"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className={`${inter.className} text-[var(--accent-primary)] text-sm font-semibold uppercase tracking-widest`}>
            Melbourne 2026
          </span>
          <h1 className={`${cormorant.className} text-5xl sm:text-6xl font-bold text-[var(--foreground)] mt-4`}>
            Power Retreat Registration
          </h1>
          <div className="section-divider mt-8" />
        </div>
      </section>

      {/* Pricing Info */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card p-6 border-[var(--accent-primary)] border-2 text-center mb-8">
            <p className={`${inter.className} text-[var(--foreground-muted)] mb-2`}>
              {appliedDiscount 
                ? `Discount Applied (${appliedDiscount.code})` 
                : (isEarlyBirdAvailable ? "Early Bird Price" : "Standard Price")}
            </p>
            <div className="flex items-center justify-center gap-3">
              {appliedDiscount && (
                <span className={`${cormorant.className} text-2xl text-[var(--foreground-muted)] line-through`}>
                  ${basePrice}
                </span>
              )}
              <span className={`${cormorant.className} text-5xl font-bold text-[var(--accent-primary)]`}>
                ${currentPrice.toFixed(2).replace(/\.00$/, '')}
              </span>
            </div>
            {isEarlyBirdAvailable && !appliedDiscount && (
              <div>
                <p className={`${inter.className} text-[var(--foreground-muted)] mt-2`}>
                  🚨 Early bird pricing available only until April 30th! 🚨
                </p>
                <p className={`${inter.className} text-[var(--foreground-muted)] mt-2`}>
                  Standard pricing is $300
                </p>
              </div>

            )}
          </div>

          {/* Discount Code Input */}
          <div className="card p-6 mb-8">
            <h3 className={`${inter.className} text-[var(--foreground)] font-medium mb-4`}>
              Have a discount code?
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => {
                  setDiscountCode(e.target.value);
                  setDiscountError("");
                }}
                placeholder="Enter discount code"
                className={`${inputClasses} flex-1`}
                disabled={!!appliedDiscount}
              />
              {appliedDiscount ? (
                <button
                  type="button"
                  onClick={removeDiscount}
                  className="px-6 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={applyDiscountCode}
                  className="px-6 py-3 bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)] text-[var(--accent-primary)] rounded-lg hover:bg-[var(--accent-primary)]/30 transition-colors"
                >
                  Apply
                </button>
              )}
            </div>
            {discountError && (
              <p className={`${inter.className} text-red-400 text-sm mt-2`}>{discountError}</p>
            )}
            {discountSuccess && (
              <p className={`${inter.className} text-green-400 text-sm mt-2`}>{discountSuccess}</p>
            )}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-6`}>
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>
                    Full Name <span className="text-red-400">*</span>
                    <span className="text-[var(--foreground-muted)] font-normal text-sm ml-2">
                      (as you would like it to appear on your name badge)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.full_name && <p className={errorClasses}>{errors.full_name}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    Date of Birth <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.date_of_birth && <p className={errorClasses}>{errors.date_of_birth}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.mobile_number && <p className={errorClasses}>{errors.mobile_number}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.email && <p className={errorClasses}>{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>
                      City / Suburb <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="city_suburb"
                      value={formData.city_suburb}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                    {errors.city_suburb && <p className={errorClasses}>{errors.city_suburb}</p>}
                  </div>

                  <div>
                    <label className={labelClasses}>
                      State <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                    {errors.state && <p className={errorClasses}>{errors.state}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>
                    Country <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.country && <p className={errorClasses}>{errors.country}</p>}
                </div>
              </div>
            </div>

            {/* Dietary Requirements */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-6`}>
                Dietary Requirements
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>
                    Do you have any dietary requirements? <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    {["none", "vegetarian", "vegan", "gluten-free", "other"].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="dietary_requirements"
                          value={option}
                          checked={formData.dietary_requirements === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[var(--accent-primary)]"
                        />
                        <span className={`${inter.className} text-[var(--foreground)] capitalize`}>
                          {option === "none" ? "None" : option === "gluten-free" ? "Gluten-free" : option}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.dietary_requirements && <p className={errorClasses}>{errors.dietary_requirements}</p>}
                </div>

                {formData.dietary_requirements === "other" && (
                  <div>
                    <label className={labelClasses}>
                      Please specify <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="dietary_other"
                      value={formData.dietary_other}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                    {errors.dietary_other && <p className={errorClasses}>{errors.dietary_other}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Medical Conditions */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-6`}>
                Medical Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>
                    Do you have any medical conditions, allergies, or mobility needs we should be aware of? <span className="text-red-400">*</span>
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="medical_conditions"
                        value="no"
                        checked={formData.medical_conditions === "no"}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[var(--accent-primary)]"
                      />
                      <span className={`${inter.className} text-[var(--foreground)]`}>No</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="medical_conditions"
                        value="yes"
                        checked={formData.medical_conditions === "yes"}
                        onChange={handleInputChange}
                        className="w-4 h-4 accent-[var(--accent-primary)]"
                      />
                      <span className={`${inter.className} text-[var(--foreground)]`}>Yes</span>
                    </label>
                  </div>
                  {errors.medical_conditions && <p className={errorClasses}>{errors.medical_conditions}</p>}
                </div>

                {formData.medical_conditions === "yes" && (
                  <div>
                    <label className={labelClasses}>
                      Please provide details <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="medical_details"
                      value={formData.medical_details}
                      onChange={handleInputChange}
                      rows={3}
                      className={inputClasses}
                    />
                    {errors.medical_details && <p className={errorClasses}>{errors.medical_details}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-6`}>
                Emergency Contact
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>
                    Emergency Contact Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.emergency_contact_name && <p className={errorClasses}>{errors.emergency_contact_name}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    Relationship to You <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.emergency_contact_relationship && <p className={errorClasses}>{errors.emergency_contact_relationship}</p>}
                </div>

                <div>
                  <label className={labelClasses}>
                    Emergency Contact Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="emergency_contact_phone"
                    value={formData.emergency_contact_phone}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                  {errors.emergency_contact_phone && <p className={errorClasses}>{errors.emergency_contact_phone}</p>}
                </div>
              </div>
            </div>

            {/* Faith & Background */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-2`}>
                Faith & Background
              </h2>
              <p className={`${inter.className} text-[var(--foreground-muted)] text-sm mb-6`}>
                Optional but helpful
              </p>

              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Are you a member of the Clergy?</label>
                  <div className="space-y-2">
                    {["no", "yes"].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="is_clergy"
                          value={option}
                          checked={formData.is_clergy === option}
                          onChange={(e) => {
                            handleInputChange(e);
                            // Reset vocation_status and is_catholic based on clergy answer
                            if (e.target.value === "no") {
                              setFormData((prev) => ({ ...prev, vocation_status: "layperson" }));
                            } else {
                              setFormData((prev) => ({ ...prev, vocation_status: "", is_catholic: "yes" }));
                            }
                          }}
                          className="w-4 h-4 accent-[var(--accent-primary)]"
                        />
                        <span className={`${inter.className} text-[var(--foreground)] capitalize`}>
                          {option === "yes" ? "Yes" : "No"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.is_clergy === "yes" && (
                  <div>
                    <label className={labelClasses}>Vocation</label>
                    <div className="space-y-2">
                      {[
                        { value: "seminarian", label: "Seminarian" },
                        { value: "deacon", label: "Deacon" },
                        { value: "priest", label: "Priest" },
                        { value: "religious_brother", label: "Religious Brother" },
                        { value: "bishop", label: "Bishop" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="vocation_status"
                            value={option.value}
                            checked={formData.vocation_status === option.value}
                            onChange={handleInputChange}
                            className="w-4 h-4 accent-[var(--accent-primary)]"
                          />
                          <span className={`${inter.className} text-[var(--foreground)]`}>
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className={labelClasses}>Are you Catholic?</label>
                  <div className="space-y-2">
                    {["yes", "no", "exploring"].map((option) => {
                      const isDisabled = formData.is_clergy === "yes" && option !== "yes";
                      return (
                        <label 
                          key={option} 
                          className={`flex items-center gap-3 ${isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                        >
                          <input
                            type="radio"
                            name="is_catholic"
                            value={option}
                            checked={formData.is_catholic === option}
                            onChange={handleInputChange}
                            disabled={isDisabled}
                            className="w-4 h-4 accent-[var(--accent-primary)]"
                          />
                          <span className={`${inter.className} text-[var(--foreground)] capitalize`}>
                            {option === "exploring" ? "Exploring faith" : option === "yes" ? "Yes" : "No"}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {formData.is_clergy === "yes" && (
                    <p className={`${inter.className} text-[var(--foreground-muted)] text-sm mt-2`}>
                      Automatically set to Yes for clergy members
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClasses}>Parish / Church / Community (if any)</label>
                  <input
                    type="text"
                    name="parish"
                    value={formData.parish}
                    onChange={handleInputChange}
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>Is this your first Young Men of God event?</label>
                  <div className="space-y-2">
                    {["yes", "no"].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="first_ymg_event"
                          value={option}
                          checked={formData.first_ymg_event === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[var(--accent-primary)]"
                        />
                        <span className={`${inter.className} text-[var(--foreground)] capitalize`}>
                          {option === "yes" ? "Yes" : "No"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>How did you hear about this conference?</label>
                  <div className="space-y-2">
                    {["friend", "parish", "social_media", "ymg_group", "other"].map((option) => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="how_heard"
                          value={option}
                          checked={formData.how_heard === option}
                          onChange={handleInputChange}
                          className="w-4 h-4 accent-[var(--accent-primary)]"
                        />
                        <span className={`${inter.className} text-[var(--foreground)]`}>
                          {option === "friend" ? "Friend" : 
                           option === "parish" ? "Parish" : 
                           option === "social_media" ? "Social Media" : 
                           option === "ymg_group" ? "YMG Group" : "Other"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.how_heard === "other" && (
                  <div>
                    <label className={labelClasses}>Please specify</label>
                    <input
                      type="text"
                      name="how_heard_other"
                      value={formData.how_heard_other}
                      onChange={handleInputChange}
                      className={inputClasses}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Safeguarding & Consent */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-6`}>
                Safeguarding & Consent
              </h2>

              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="confirms_18_or_older"
                    checked={formData.confirms_18_or_older}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 accent-[var(--accent-primary)]"
                  />
                  <span className={`${inter.className} text-[var(--foreground)]`}>
                    I confirm that I am 18 years or older. <span className="text-red-400">*</span>
                  </span>
                </label>
                {errors.confirms_18_or_older && <p className={errorClasses}>{errors.confirms_18_or_older}</p>}

                <p className={`${inter.className} text-[var(--foreground-muted)] text-sm`}>
                  You will be asked to read and agree to our Code of Conduct in the next step.
                </p>
              </div>
            </div>

            {/* Photos & Videos */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-6`}>
                Photos & Videos
              </h2>

              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="photo_consent"
                    value="yes"
                    checked={formData.photo_consent === "yes"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[var(--accent-primary)]"
                  />
                  <span className={`${inter.className} text-[var(--foreground)]`}>
                    I consent to photos and videos being taken during the event for ministry purposes.
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="photo_consent"
                    value="no"
                    checked={formData.photo_consent === "no"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-[var(--accent-primary)]"
                  />
                  <span className={`${inter.className} text-[var(--foreground)]`}>
                    I do not consent.
                  </span>
                </label>
              </div>
              {errors.photo_consent && <p className={errorClasses}>{errors.photo_consent}</p>}
            </div>

            {/* Communication */}
            <div className={sectionClasses}>
              <h2 className={`${cormorant.className} text-2xl font-bold text-[var(--foreground)] mb-6`}>
                Communication
              </h2>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="marketing_consent"
                  checked={formData.marketing_consent}
                  onChange={handleInputChange}
                  className="w-5 h-5 mt-0.5 accent-[var(--accent-primary)]"
                />
                <span className={`${inter.className} text-[var(--foreground)]`}>
                  I would like to receive updates about future Young Men of God events and formation opportunities.
                </span>
              </label>
            </div>

            {/* Submit */}
            {submitError && (
              <div className="card p-4 mb-8 border-red-500 border bg-red-500/10">
                <p className={`${inter.className} text-red-400`}>{submitError}</p>
              </div>
            )}

            {/* Important Notice */}
            <div className="card p-4 mb-6 border-[var(--accent-primary)] border bg-[var(--accent-primary)]/10">
              <p className={`${inter.className} text-[var(--foreground)] text-sm`}>
                <span className="font-semibold">Important:</span> Your registration will be confirmed immediately. You will receive a payment link separately – we will be in touch via email.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
