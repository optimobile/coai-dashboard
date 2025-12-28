import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - CSOAI';
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: December 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <motion.div {...fadeInUp} className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                CSOAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">We may collect information about you in a variety of ways:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>Personal Data:</strong> Name, email address, phone number, and other contact information you provide when registering or using our services.</li>
                <li><strong>Account Information:</strong> Information related to your account, including credentials, preferences, and usage history.</li>
                <li><strong>Certification Data:</strong> Information about your training progress, exam results, and certifications.</li>
                <li><strong>Watchdog Reports:</strong> Information submitted through incident reports, including descriptions and supporting evidence.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, operating system, and usage analytics.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">We use the information we collect for various purposes:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>To provide, maintain, and improve our services</li>
                <li>To process your account registration and authentication</li>
                <li>To deliver training courses and certification exams</li>
                <li>To process and analyze Watchdog incident reports</li>
                <li>To send administrative and promotional communications</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>Service Providers:</strong> Third parties who assist us in operating our website and providing services.</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety.</li>
                <li><strong>Public Reports:</strong> Watchdog incident reports may be made public to promote transparency in AI safety.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or bankruptcy.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
              <p className="text-gray-600 mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>Access:</strong> The right to access your personal information</li>
                <li><strong>Correction:</strong> The right to correct inaccurate information</li>
                <li><strong>Deletion:</strong> The right to request deletion of your information</li>
                <li><strong>Portability:</strong> The right to receive your data in a portable format</li>
                <li><strong>Opt-out:</strong> The right to opt out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the updated policy on our website and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> privacy@csoai.org<br />
                <strong>Address:</strong> San Francisco, CA, USA
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
