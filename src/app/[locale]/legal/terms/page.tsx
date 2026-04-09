import { generatePageMetadata } from "@/lib/seo/metadata";
import { StructuredData } from "@/components/shared/StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo/structured-data";

interface TermsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: TermsPageProps) {
  const { locale } = await params;

  return generatePageMetadata({
    locale,
    path: "/legal/terms",
    title: "Terms of Service | Uplocal",
    description:
      "Read the terms and conditions for using Uplocal, the browser based AI image upscaler. Learn about our plans, usage policies, and your rights.",
  });
}

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "description", title: "Description of Service" },
  { id: "account-registration", title: "Account Registration" },
  { id: "subscription-plans", title: "Subscription Plans" },
  { id: "cancellation-and-refunds", title: "Cancellation and Refunds" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "privacy", title: "Privacy" },
  { id: "limitation-of-liability", title: "Limitation of Liability" },
  { id: "modifications", title: "Modifications to Terms" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact", title: "Contact" },
] as const;

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;

  return (
    <section className="py-24">
      <StructuredData data={generateBreadcrumbSchema([
        { name: "Uplocal", url: "https://uplocal.app" },
        { name: "Terms of Service", url: `https://uplocal.app/${locale}/legal/terms` },
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
              Terms of Service
            </h1>
            <p className="mb-12 font-mono text-sm text-muted">
              Last updated: April 9, 2026
            </p>

            {/* Acceptance of Terms */}
            <div id="acceptance" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Acceptance of Terms
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  By accessing or using Uplocal at uplocal.app, you agree to be
                  bound by these Terms of Service. These terms constitute a
                  legally binding agreement between you and HiddenLab (SIRET: 980
                  715 809 00011), a company registered in France, operating
                  under the trade name Uplocal.
                </p>
                <p>
                  If you do not agree to these terms, you must not access or use
                  the service. If you are using the service on behalf of an
                  organization, you represent and warrant that you have the
                  authority to bind that organization to these terms.
                </p>
                <p>
                  These terms apply to all visitors, registered users, and
                  paying subscribers of the service.
                </p>
              </div>
            </div>

            {/* Description of Service */}
            <div id="description" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Description of Service
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  Uplocal is a browser based AI image upscaling service. The
                  service uses Real-ESRGAN, an artificial intelligence model
                  compiled to WebAssembly, to upscale images directly in your
                  web browser. All image processing occurs locally on your
                  device. No images are uploaded to any server.
                </p>
                <p>The service provides the following capabilities:</p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    AI powered image upscaling at 2x, 4x, and 8x scale factors,
                    depending on your subscription plan.
                  </li>
                  <li>
                    Support for PNG, JPEG, WebP, and BMP input formats.
                  </li>
                  <li>
                    Output in PNG, JPEG, or WebP formats with adjustable quality
                    settings.
                  </li>
                  <li>
                    Batch processing for multiple images simultaneously,
                    depending on your subscription plan.
                  </li>
                </ul>
                <p>
                  The quality of upscaling results depends on multiple factors,
                  including the quality of the original image, the subject
                  matter, and the scale factor selected. Uplocal does not
                  guarantee specific results for any given image.
                </p>
              </div>
            </div>

            {/* Account Registration */}
            <div id="account-registration" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Account Registration
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  To use certain features of the service, including tracked
                  usage and paid subscriptions, you must create an account. You
                  may register using one of the following methods:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>Google OAuth authentication</li>
                  <li>GitHub OAuth authentication</li>
                  <li>Email magic link (passwordless sign in via email)</li>
                </ul>
                <p>When you create an account, you agree to the following:</p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    You will provide accurate and complete information during
                    registration.
                  </li>
                  <li>
                    You are responsible for maintaining the security of your
                    account and for all activities that occur under your account.
                  </li>
                  <li>
                    You will notify us immediately at contact@metalya.fr if you
                    become aware of any unauthorized use of your account.
                  </li>
                  <li>
                    You may not create multiple accounts to circumvent usage
                    limits or for any other purpose that violates these terms.
                  </li>
                  <li>
                    You must be at least 16 years of age to create an account.
                  </li>
                </ul>
                <p>
                  We reserve the right to suspend or terminate accounts that
                  violate these terms, at our sole discretion, with or without
                  prior notice.
                </p>
              </div>
            </div>

            {/* Subscription Plans */}
            <div id="subscription-plans" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Subscription Plans
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  Uplocal offers three subscription tiers. The features and
                  limits of each plan are as follows:
                </p>

                <h3 className="font-display text-lg text-ink pt-2">
                  Free Plan
                </h3>
                <ul className="list-disc space-y-2 ps-6">
                  <li>1 upscale per day (resets at midnight UTC)</li>
                  <li>Maximum scale factor of 2x</li>
                  <li>PNG and JPEG output formats</li>
                  <li>Maximum input file size of 5MB</li>
                  <li>No batch processing</li>
                </ul>

                <h3 className="font-display text-lg text-ink pt-2">
                  Pro Plan ($9 per month, or $79 per year)
                </h3>
                <ul className="list-disc space-y-2 ps-6">
                  <li>Unlimited upscales</li>
                  <li>Maximum scale factor of 4x</li>
                  <li>All output formats (PNG, JPEG, WebP)</li>
                  <li>Maximum input file size of 10MB</li>
                  <li>Batch processing of up to 10 images at once</li>
                  <li>Priority model loading</li>
                </ul>

                <h3 className="font-display text-lg text-ink pt-2">
                  Studio Plan ($24 per month, or $199 per year)
                </h3>
                <ul className="list-disc space-y-2 ps-6">
                  <li>Everything included in Pro</li>
                  <li>Maximum scale factor of 8x</li>
                  <li>Batch processing of up to 50 images at once</li>
                  <li>Custom output dimensions</li>
                  <li>API access (coming soon)</li>
                  <li>Commercial use license</li>
                </ul>

                <p>
                  All prices are in United States Dollars (USD). Prices are
                  exclusive of any applicable taxes, which may be added during
                  checkout depending on your jurisdiction.
                </p>
                <p>
                  Subscriptions are billed in advance on a monthly or annual
                  basis through Stripe. By subscribing to a paid plan, you
                  authorize Stripe to charge your selected payment method on a
                  recurring basis at the beginning of each billing cycle.
                </p>
                <p>
                  We reserve the right to modify pricing at any time. If pricing
                  changes affect your current subscription, you will be notified
                  at least 30 days before the change takes effect. The new
                  pricing will apply at the start of your next billing cycle
                  following the notification period.
                </p>
              </div>
            </div>

            {/* Cancellation and Refunds */}
            <div id="cancellation-and-refunds" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Cancellation and Refunds
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  You may cancel your subscription at any time from your
                  dashboard or through the Stripe Customer Portal. Cancellation
                  takes effect at the end of your current billing period. You
                  will retain access to your plan's features until that date.
                </p>
                <p>
                  Upon cancellation, your account will automatically revert to
                  the Free plan at the end of the current billing period. Your
                  account data and usage history will be preserved.
                </p>
                <p>
                  We offer a 7 day refund policy for new subscriptions. If you
                  are unsatisfied with the service, you may request a full
                  refund within 7 days of your initial subscription purchase by
                  contacting us at contact@metalya.fr. Refund requests made
                  after the 7 day period will be evaluated on a case by case
                  basis.
                </p>
                <p>
                  Refunds for annual subscriptions are prorated based on the
                  remaining unused months in the billing period, provided the
                  request is made within 30 days of purchase. After 30 days,
                  annual subscriptions are non refundable.
                </p>
                <p>
                  Refunds are processed through Stripe and will be returned to
                  the original payment method. Please allow 5 to 10 business
                  days for the refund to appear on your statement.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div id="intellectual-property" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Intellectual Property
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  <strong className="text-ink">Your images:</strong> You retain
                  full ownership of all images you process using Uplocal. We do
                  not claim any rights over your images. Because all image
                  processing occurs locally in your browser, we never have
                  access to your images, and therefore cannot use, store, or
                  distribute them.
                </p>
                <p>
                  <strong className="text-ink">Our service:</strong> The Uplocal
                  name, logo, website design, user interface, code, and all
                  associated intellectual property are owned by HiddenLab and are
                  protected by applicable intellectual property laws. You may not
                  copy, modify, distribute, or create derivative works based on
                  any part of the service without our prior written consent.
                </p>
                <p>
                  <strong className="text-ink">AI models:</strong> The
                  Real-ESRGAN model used by Uplocal is distributed under the BSD
                  3 Clause License. Our WebAssembly compilation, optimizations,
                  and the integration code are proprietary to HiddenLab.
                </p>
                <p>
                  <strong className="text-ink">Commercial use:</strong> Free and
                  Pro plan users may use upscaled images for personal and
                  non commercial purposes. Studio plan users are granted a
                  commercial use license, meaning they may use upscaled images
                  for commercial projects, publications, and products.
                </p>
              </div>
            </div>

            {/* Acceptable Use */}
            <div id="acceptable-use" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Acceptable Use
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  You agree to use Uplocal in compliance with all applicable
                  laws and regulations. The following activities are strictly
                  prohibited:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    Processing images that contain illegal content, including but
                    not limited to child sexual abuse material (CSAM),
                    non consensual intimate imagery, or content that violates the
                    laws of your jurisdiction.
                  </li>
                  <li>
                    Reverse engineering, decompiling, disassembling, or
                    attempting to extract the source code of the WebAssembly
                    modules, AI models, or any other proprietary components of
                    the service.
                  </li>
                  <li>
                    Using automated scripts, bots, or other tools to access the
                    service in a manner that exceeds reasonable usage patterns,
                    circumvents rate limits, or places an unreasonable load on
                    the infrastructure.
                  </li>
                  <li>
                    Creating multiple accounts to circumvent the usage limits of
                    the Free plan or any other plan restrictions.
                  </li>
                  <li>
                    Attempting to interfere with, compromise, or disrupt the
                    service, its servers, or the networks connected to the
                    service.
                  </li>
                  <li>
                    Redistributing, sublicensing, or reselling access to the
                    service without our prior written authorization.
                  </li>
                  <li>
                    Using the service to infringe upon the intellectual property
                    rights of any third party.
                  </li>
                </ul>
                <p>
                  While we do not monitor or have access to the images you
                  process (as processing is local to your device), you
                  acknowledge your sole responsibility for ensuring that your use
                  of the service complies with all applicable laws.
                </p>
                <p>
                  Violation of these terms may result in immediate account
                  suspension or termination, at our sole discretion, without
                  refund.
                </p>
              </div>
            </div>

            {/* Privacy */}
            <div id="privacy" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">Privacy</h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  Your use of Uplocal is also governed by our Privacy Policy,
                  which is available at{" "}
                  <a
                    href={`/${locale}/legal/privacy`}
                    className="text-accent underline underline-offset-4 transition-colors duration-200 hover:text-accent-hover"
                  >
                    uplocal.app/{locale}/legal/privacy
                  </a>
                  . The Privacy Policy is incorporated into these terms by
                  reference.
                </p>
                <p>
                  The fundamental privacy guarantee of Uplocal is that your
                  images never leave your device. All image processing occurs
                  locally in your browser via WebAssembly. We do not upload,
                  store, analyze, or transmit any image data. The only data we
                  collect is account information, anonymized usage metadata
                  (scale factor, dimensions, processing time), and subscription
                  details.
                </p>
                <p>
                  For full details on data collection, third party services,
                  cookies, data retention, and your GDPR rights, please refer to
                  our Privacy Policy.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div id="limitation-of-liability" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Limitation of Liability
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  The service is provided on an "as is" and "as available"
                  basis, without warranties of any kind, whether express or
                  implied. HiddenLab does not warrant that:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    The service will be uninterrupted, error free, or free from
                    harmful components.
                  </li>
                  <li>
                    The upscaling results will meet your specific requirements
                    or expectations.
                  </li>
                  <li>
                    The service will be compatible with all devices, browsers, or
                    operating systems.
                  </li>
                  <li>
                    Any defects in the service will be corrected within a
                    specific timeframe.
                  </li>
                </ul>
                <p>
                  To the maximum extent permitted by applicable law, HiddenLab
                  shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, including but not limited
                  to loss of profits, data, or goodwill, arising out of or in
                  connection with your use of the service, whether based on
                  warranty, contract, tort, or any other legal theory.
                </p>
                <p>
                  The total aggregate liability of HiddenLab for any claims
                  arising from your use of the service shall not exceed the
                  amount you have paid to HiddenLab in the 12 months preceding
                  the claim.
                </p>
                <p>
                  Because image processing occurs entirely on your device, you
                  acknowledge that the quality, speed, and success of upscaling
                  operations depend on your hardware, browser capabilities, and
                  available system resources. HiddenLab is not liable for
                  processing failures caused by insufficient device resources,
                  unsupported browsers, or network interruptions during model
                  loading.
                </p>
                <p>
                  Nothing in these terms shall exclude or limit liability for
                  death or personal injury caused by negligence, fraud, or any
                  other liability that cannot be excluded or limited under
                  applicable law.
                </p>
              </div>
            </div>

            {/* Modifications to Terms */}
            <div id="modifications" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Modifications to Terms
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  We reserve the right to modify these Terms of Service at any
                  time. When we make material changes, we will:
                </p>
                <ul className="list-disc space-y-2 ps-6">
                  <li>
                    Update the "Last updated" date at the top of this page.
                  </li>
                  <li>
                    Notify registered users via the email address associated with
                    their account at least 14 days before the changes take
                    effect.
                  </li>
                  <li>
                    Provide a summary of the key changes in the notification.
                  </li>
                </ul>
                <p>
                  Your continued use of the service after the effective date of
                  the updated terms constitutes your acceptance of the changes.
                  If you do not agree with the updated terms, you must stop using
                  the service and may cancel your subscription in accordance with
                  the Cancellation and Refunds section above.
                </p>
                <p>
                  For non material changes (such as typographical corrections or
                  clarifications that do not alter the substance of the terms),
                  we may update these terms without prior notice.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div id="governing-law" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">
                Governing Law
              </h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  These Terms of Service and any disputes arising out of or in
                  connection with them shall be governed by and construed in
                  accordance with the laws of France, without regard to its
                  conflict of law provisions.
                </p>
                <p>
                  Any disputes that cannot be resolved amicably shall be
                  submitted to the exclusive jurisdiction of the competent courts
                  in France.
                </p>
                <p>
                  If you are a consumer residing in the European Union, you also
                  benefit from the mandatory provisions of the consumer
                  protection laws of your country of residence. Nothing in these
                  terms affects your rights as a consumer under applicable EU
                  consumer protection legislation. You may also use the European
                  Commission's Online Dispute Resolution platform at
                  ec.europa.eu/consumers/odr.
                </p>
                <p>
                  If any provision of these terms is found to be unenforceable
                  or invalid by a court of competent jurisdiction, that provision
                  shall be limited or eliminated to the minimum extent necessary,
                  and the remaining provisions shall continue in full force and
                  effect.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div id="contact" className="mb-12 scroll-mt-28">
              <h2 className="mb-4 font-display text-2xl text-ink">Contact</h2>
              <div className="space-y-4 font-body text-base leading-relaxed text-muted">
                <p>
                  If you have any questions about these Terms of Service or need
                  to contact us for any reason, please reach out:
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
