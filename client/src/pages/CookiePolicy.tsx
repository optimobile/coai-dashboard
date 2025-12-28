import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CookiePolicy() {
  useEffect(() => {
    document.title = 'Cookie Policy - CSOAI';
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
              Cookie Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last updated: December 28, 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose prose-lg max-w-none">
          <motion.div {...fadeInUp} className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">
                CSOAI uses cookies for various purposes:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li><strong>Authentication:</strong> To keep you logged in and maintain your session</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how you use our website and improve it</li>
                <li><strong>Security:</strong> To protect your account and detect fraudulent activity</li>
                <li><strong>Functionality:</strong> To enable certain features and functionality</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                  <p className="text-gray-600">
                    These cookies collect information about how you use our website, such as which pages you visit and any errors you encounter. This helps us improve our services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-600">
                    These cookies remember your choices to provide a personalized experience, such as your language preference or login information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are used to track your activity and deliver targeted advertising based on your interests.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                We may allow third-party service providers to place cookies on your device for analytics, advertising, and other purposes. These providers have their own privacy policies governing their use of cookies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. How to Control Cookies</h2>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Most web browsers allow you to refuse cookies or alert you when cookies are being sent</li>
                <li>You can delete cookies from your device at any time</li>
                <li>You can adjust your browser settings to control cookie preferences</li>
                <li>Some cookies can be disabled while others may be essential for website functionality</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookie Duration</h2>
              <p className="text-gray-600 mb-4">
                Cookies can be either session-based or persistent. Session cookies are deleted when you close your browser, while persistent cookies remain on your device for a specified period.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to know what cookies we use and to control their use. You can manage your cookie preferences through your browser settings or contact us for more information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time. We will notify you of any significant changes by posting the updated policy on our website.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about our use of cookies, please contact us at:
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> privacy@csoai.org<br />
                <strong>Address:</strong> CSOAI, United Kingdom<br />
                <strong>Website:</strong> www.csoai.org
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
