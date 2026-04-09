import { generatePageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/shared/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data";

interface PrivacyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps) {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    path: "/legal/privacy",
    title: "Privacy Policy | Uplocal",
    description:
      "Learn how Uplocal handles your data. Your images never leave your device. Read our complete privacy policy.",
  });
}

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "image-processing", title: "Image Processing" },
  { id: "data-we-collect", title: "Data We Collect" },
  { id: "how-we-use-your-data", title: "How We Use Your Data" },
  { id: "third-party-services", title: "Third Party Services" },
  { id: "cookies", title: "Cookies" },
  { id: "data-storage-and-security", title: "Data Storage and Security" },
  { id: "data-retention", title: "Data Retention" },
  { id: "your-rights", title: "Your Rights (GDPR)" },
  { id: "contact", title: "Contact" },
] as const;

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;

  return (
    <section className="py-24">
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Uplocal", url: "https://uplocal.app" },
        { name: "Privacy Policy", url: `https://uplocal.app/${locale}/legal/privacy` },
      ])} />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          {/* Sticky table of contents: desktop only */}
          <nav className="hidden lg:block" aria-label="Table of contents">
            <div className="lg:sticky lg:top-24">
              <span className="mb-4 block text-xs uppercase tracking-widest text-muted font-body">
                On this page
              </span>
              <ul className="space-y-3">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block text-sm text-muted transition-colors duration-200 hover:text-ink font-body"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main content */}
          <article className="max-w-3xl">
            <h1 className="mb-4 font-display text-4xl text-ink md:text-5xl">
              Privacy Policy
            </h1>
            <p className="mb-12 font-mono text-sm text-muted">
              Last updated: April 9, 2026
            </p>

            {/* Introduction */}
            <div id="introduction" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Introduction
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  Uplocal is a browser based AI image upscaling service operated
                  by HiddenLab (SIRET: 980 715 809 00011), a company registered
                  in France. This privacy policy explains how we collect, use,
                  and protect your personal data when you use our website at
                  uplocal.app and the services available through it.
                </p>
                <p>
                  We are committed to protecting your privacy. The core design
                  principle of Uplocal is that your images are processed entirely
                  on your own device. No image data is ever transmitted to our
                  servers or any third party. This policy describes in detail
                  what information we do collect, why we collect it, and how you
                  can exercise your rights over that data.
                </p>
                <p>
                  By creating an account or using our services, you acknowledge
                  that you have read and understood this policy. If you do not
                  agree with any part of this policy, please do not use our
                  services.
                </p>
              </div>
            </div>

            {/* Image Processing */}
            <div id="image-processing" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Image Processing
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  This is the most important section of our privacy policy.
                  Uplocal uses Real-ESRGAN, an AI upscaling model compiled to
                  WebAssembly, which runs entirely inside your web browser. When
                  you upload an image to Uplocal, the following is true:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    Your image is loaded directly into your browser's memory. It
                    is never transmitted over the network to any server,
                    including ours.
                  </li>
                  <li>
                    All AI processing (upscaling, enhancement, artifact removal)
                    occurs locally on your device using WebAssembly. No server is
                    involved in the image processing pipeline.
                  </li>
                  <li>
                    Your original image and the upscaled result remain
                    exclusively in your browser's memory until you close the page
                    or navigate away, at which point they are discarded.
                  </li>
                  <li>
                    We do not store, cache, log, analyze, or transmit any pixel
                    data from your images. We have no access to your images
                    whatsoever.
                  </li>
                  <li>
                    No thumbnail, preview, hash, or any other derivative of your
                    image is sent to our servers.
                  </li>
                </ul>
                <p>
                  The only data related to an upscaling operation that we record
                  is anonymized usage metadata: the scale factor selected (2x,
                  4x, or 8x), the input and output dimensions in pixels, the
                  input and output file formats, and the processing time in
                  milliseconds. This metadata is used solely for usage tracking
                  and service improvement. It does not contain any image content.
                </p>
                <p>
                  You can verify this claim independently. Because Uplocal runs
                  in your browser, you can use your browser's developer tools
                  (Network tab) to confirm that no image data leaves your
                  device during the upscaling process.
                </p>
              </div>
            </div>

            {/* Data We Collect */}
            <div id="data-we-collect" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Data We Collect
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  We collect and process the following categories of personal
                  data:
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Account Information
                </h3>
                <p>
                  When you create an account, we collect your email address and,
                  if you sign in via Google or GitHub, your display name and
                  profile picture URL as provided by the OAuth provider. If you
                  sign in via email magic link, we collect only your email
                  address.
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Usage Metadata
                </h3>
                <p>
                  When you perform an upscale, we record the following metadata
                  linked to your account: the scale factor used, the input image
                  dimensions (width and height in pixels), the output image
                  dimensions, the input file format, the output file format, and
                  the processing time in milliseconds. This data helps us
                  enforce plan limits and improve the service. As stated above,
                  no image content is ever recorded.
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Subscription and Payment Data
                </h3>
                <p>
                  If you subscribe to a paid plan, we store your subscription
                  status, plan type (Free, Pro, or Studio), billing period dates,
                  and your Stripe customer ID. All payment processing is handled
                  by Stripe. We do not receive, store, or have access to your
                  credit card number, bank account details, or other financial
                  payment instruments. Stripe processes this data in accordance
                  with their own privacy policy.
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  User Preferences
                </h3>
                <p>
                  We store your preferred theme (light, dark, or system),
                  default scale factor, default output format, default quality
                  setting, and preferred language. These preferences are stored
                  to provide a consistent experience across sessions.
                </p>
              </div>
            </div>

            {/* How We Use Your Data */}
            <div id="how-we-use-your-data" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                How We Use Your Data
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>We use the data we collect for the following purposes:</p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    <strong className="text-ink">Account management:</strong> to
                    create and maintain your account, authenticate your identity,
                    and enable you to sign in to the service.
                  </li>
                  <li>
                    <strong className="text-ink">Usage tracking:</strong> to
                    enforce the limits of your current plan (for example, one
                    free upscale per day for Free tier users) and to display your
                    usage history in your dashboard.
                  </li>
                  <li>
                    <strong className="text-ink">Subscription management:</strong>{" "}
                    to manage your subscription status, process plan changes, and
                    communicate billing related information.
                  </li>
                  <li>
                    <strong className="text-ink">Service improvement:</strong> to
                    understand aggregate usage patterns (such as most common
                    scale factors and average processing times) in order to
                    optimize performance and plan future features.
                  </li>
                  <li>
                    <strong className="text-ink">
                      Transactional communications:
                    </strong>{" "}
                    to send you essential emails such as magic link sign in
                    codes, subscription confirmations, and billing receipts. We
                    do not send marketing emails.
                  </li>
                </ul>
                <p>
                  We do not sell, rent, or share your personal data with third
                  parties for their marketing purposes. We do not use your data
                  for advertising. We do not build user profiles for ad
                  targeting.
                </p>
              </div>
            </div>

            {/* Third-Party Services */}
            <div id="third-party-services" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Third Party Services
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  We use the following third party services to operate Uplocal.
                  Each service receives only the minimum data necessary to
                  perform its function:
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Stripe (Payment Processing)
                </h3>
                <p>
                  Stripe, Inc. processes all payments for subscriptions. When you
                  subscribe to a paid plan, Stripe receives your email address
                  and payment information. Stripe may set cookies for fraud
                  prevention purposes. Stripe's privacy policy is available at
                  stripe.com/privacy.
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Google and GitHub (Authentication)
                </h3>
                <p>
                  If you choose to sign in with Google or GitHub, the respective
                  provider shares your email address, display name, and profile
                  picture with us through the OAuth protocol. We do not receive
                  your password from these providers. Google's privacy policy is
                  available at policies.google.com/privacy. GitHub's privacy
                  policy is available at docs.github.com/en/site-policy/privacy-policies.
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Resend (Email Delivery)
                </h3>
                <p>
                  We use Resend to deliver transactional emails such as magic
                  link sign in codes and subscription related notifications.
                  Resend receives your email address for this purpose. Resend's
                  privacy policy is available at resend.com/legal/privacy-policy.
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Vercel (Hosting)
                </h3>
                <p>
                  Uplocal is hosted on Vercel, Inc. (340 S Lemon Ave #4133,
                  Walnut, CA 91789, USA). Vercel processes standard HTTP request
                  data (IP address, user agent, request URL) as part of serving
                  the website. We use Vercel Analytics, which is a
                  privacy friendly analytics tool that does not use cookies and
                  does not track individual users. Vercel's privacy policy is
                  available at vercel.com/legal/privacy-policy.
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  MongoDB Atlas (Database)
                </h3>
                <p>
                  Your account data, usage records, and subscription information
                  are stored in MongoDB Atlas, a cloud database service operated
                  by MongoDB, Inc. Data is encrypted at rest and in transit.
                  MongoDB's privacy policy is available at
                  mongodb.com/legal/privacy-policy.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div id="cookies" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">Cookies</h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  Uplocal uses only essential cookies that are strictly necessary
                  for the service to function. We do not use any advertising,
                  tracking, or analytics cookies.
                </p>
                <p>The cookies we use are:</p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    <strong className="text-ink">Authentication session cookie:</strong>{" "}
                    a secure, HTTP only cookie that maintains your signed in
                    session. This cookie is set when you sign in and is removed
                    when you sign out or when it expires.
                  </li>
                  <li>
                    <strong className="text-ink">Theme preference cookie:</strong>{" "}
                    a cookie that stores your selected theme (light or dark) so
                    the server can render the correct theme on page load,
                    preventing a visual flash.
                  </li>
                  <li>
                    <strong className="text-ink">CSRF token:</strong> a security
                    cookie used to protect against cross site request forgery
                    attacks during authentication.
                  </li>
                </ul>
                <p>
                  Stripe may set additional cookies for fraud prevention when you
                  interact with payment related features. These cookies are
                  controlled by Stripe and are classified as essential cookies
                  necessary for payment security.
                </p>
                <p>
                  Because we only use essential cookies, no cookie consent is
                  required under the ePrivacy Directive for the base
                  functionality of the site.
                </p>
              </div>
            </div>

            {/* Data Storage and Security */}
            <div id="data-storage-and-security" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Data Storage and Security
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  We take the security of your data seriously and implement
                  appropriate technical and organizational measures to protect
                  it:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    All data in transit is encrypted using HTTPS (TLS 1.2 or
                    higher).
                  </li>
                  <li>
                    All data at rest in MongoDB Atlas is encrypted using AES 256
                    encryption.
                  </li>
                  <li>
                    Passwords are hashed using bcrypt before storage. We never
                    store passwords in plain text.
                  </li>
                  <li>
                    Payment data is handled entirely by Stripe, which is PCI DSS
                    Level 1 certified. We do not store, process, or have access
                    to your full payment card details.
                  </li>
                  <li>
                    API endpoints are protected by rate limiting (100 requests
                    per minute per authenticated user, 10 requests per minute per
                    IP on authentication endpoints) to prevent abuse.
                  </li>
                  <li>
                    Stripe webhook endpoints verify the cryptographic signature
                    of every incoming request to ensure authenticity.
                  </li>
                  <li>
                    All API endpoints validate input data using strict schemas to
                    prevent injection attacks.
                  </li>
                </ul>
                <p>
                  Your account data is stored on MongoDB Atlas servers. Vercel
                  serves the application from edge locations globally. No image
                  data is ever stored on any server, as all image processing
                  occurs exclusively in your browser.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div id="data-retention" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Data Retention
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  We retain your personal data for as long as your account is
                  active and as necessary to provide you with our services. The
                  specific retention periods are:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    <strong className="text-ink">Account data:</strong> retained
                    for the duration of your account. Deleted within 30 days of
                    an account deletion request.
                  </li>
                  <li>
                    <strong className="text-ink">Usage records:</strong> retained
                    for the duration of your account to provide your usage
                    history and for aggregate analytics purposes.
                  </li>
                  <li>
                    <strong className="text-ink">Subscription data:</strong>{" "}
                    retained for as long as required by applicable tax and
                    accounting regulations (typically 10 years for financial
                    records under French law), even after account deletion.
                  </li>
                  <li>
                    <strong className="text-ink">Authentication logs:</strong>{" "}
                    session records are retained for the lifetime of the session
                    and deleted upon sign out or expiry.
                  </li>
                </ul>
                <p>
                  You may request the deletion of your account and associated
                  data at any time by contacting us at the email address listed
                  in the Contact section below. Upon receiving your request, we
                  will delete your account data within 30 days, subject to any
                  legal retention obligations.
                </p>
              </div>
            </div>

            {/* Your Rights (GDPR) */}
            <div id="your-rights" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Your Rights (GDPR)
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  If you are located in the European Economic Area (EEA), the
                  United Kingdom, or any other jurisdiction that grants similar
                  data protection rights, you have the following rights
                  regarding your personal data:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    <strong className="text-ink">Right of access:</strong> you
                    have the right to request a copy of the personal data we hold
                    about you.
                  </li>
                  <li>
                    <strong className="text-ink">Right to rectification:</strong>{" "}
                    you have the right to request that we correct any inaccurate
                    or incomplete personal data.
                  </li>
                  <li>
                    <strong className="text-ink">Right to erasure:</strong> you
                    have the right to request that we delete your personal data,
                    subject to any legal retention obligations.
                  </li>
                  <li>
                    <strong className="text-ink">Right to data portability:</strong>{" "}
                    you have the right to receive your personal data in a
                    structured, commonly used, and machine readable format.
                  </li>
                  <li>
                    <strong className="text-ink">Right to object:</strong> you
                    have the right to object to the processing of your personal
                    data for specific purposes, including processing based on
                    legitimate interest.
                  </li>
                  <li>
                    <strong className="text-ink">
                      Right to restrict processing:
                    </strong>{" "}
                    you have the right to request that we limit the processing of
                    your personal data under certain circumstances.
                  </li>
                  <li>
                    <strong className="text-ink">
                      Right to withdraw consent:
                    </strong>{" "}
                    where processing is based on your consent, you have the right
                    to withdraw that consent at any time.
                  </li>
                </ul>
                <p>
                  To exercise any of these rights, please contact us at
                  contact@metalya.fr. We will respond to your request within 30
                  days, as required by the GDPR. If you believe that your data
                  protection rights have been violated, you have the right to
                  lodge a complaint with the Commission Nationale de
                  l'Informatique et des Libertes (CNIL), the French data
                  protection authority, or with your local supervisory authority.
                </p>
                <p>
                  The legal basis for processing your personal data is as
                  follows: account data and usage tracking are processed on the
                  basis of contractual necessity (Article 6(1)(b) GDPR),
                  subscription and billing data are processed on the basis of
                  contractual necessity and legal obligation (Article 6(1)(b) and
                  6(1)(c) GDPR), and aggregate analytics are processed on the
                  basis of our legitimate interest in improving the service
                  (Article 6(1)(f) GDPR).
                </p>
              </div>
            </div>

            {/* Contact */}
            <div id="contact" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">Contact</h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  If you have any questions about this privacy policy, your
                  personal data, or wish to exercise any of your rights, please
                  contact us:
                </p>
                <ul className="list-none space-y-2 ps-0">
                  <li>
                    <strong className="text-ink">Company:</strong> HiddenLab
                  </li>
                  <li>
                    <strong className="text-ink">SIRET:</strong> 980 715 809
                    00011
                  </li>
                  <li>
                    <strong className="text-ink">Email:</strong>{" "}
                    <a
                      href="mailto:contact@metalya.fr"
                      className="text-accent underline underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
                    >
                      contact@metalya.fr
                    </a>
                  </li>
                  <li>
                    <strong className="text-ink">Website:</strong>{" "}
                    <a
                      href="https://hiddenlab.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
                    >
                      hiddenlab.fr
                    </a>
                  </li>
                  <li>
                    <strong className="text-ink">Publication Director:</strong>{" "}
                    HiddenLab
                  </li>
                  <li>
                    <strong className="text-ink">Hosting:</strong> Vercel Inc.,
                    340 S Lemon Ave #4133, Walnut, CA 91789, USA
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
