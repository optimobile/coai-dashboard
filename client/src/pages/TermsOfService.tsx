import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service - CSOAI';
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
              Terms of Service
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using CSOAI's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on CSOAI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Disclaimer</h2>
              <p className="text-gray-600 mb-4">
                The materials on CSOAI's website are provided on an 'as is' basis. CSOAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations</h2>
              <p className="text-gray-600 mb-4">
                In no event shall CSOAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CSOAI's website, even if CSOAI or a CSOAI authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Accuracy of Materials</h2>
              <p className="text-gray-600 mb-4">
                The materials appearing on CSOAI's website could include technical, typographical, or photographic errors. CSOAI does not warrant that any of the materials on its website are accurate, complete, or current. CSOAI may make changes to the materials contained on its website at any time without notice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Links</h2>
              <p className="text-gray-600 mb-4">
                CSOAI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by CSOAI of the site. Use of any such linked website is at the user's own risk.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Modifications</h2>
              <p className="text-gray-600 mb-4">
                CSOAI may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Governing Law</h2>
              <p className="text-gray-600 mb-4">
                These terms and conditions are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. User Responsibilities</h2>
              <p className="text-gray-600 mb-4">
                By using CSOAI's services, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the services only for lawful purposes</li>
                <li>Not engage in any conduct that restricts or inhibits anyone's use or enjoyment of the services</li>
                <li>Not submit false or misleading information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Intellectual Property Rights</h2>
              <p className="text-gray-600 mb-4">
                All content on CSOAI's website, including text, graphics, logos, images, and software, is the property of CSOAI or its content suppliers and is protected by international copyright laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> legal@csoai.org<br />
                <strong>Address:</strong> San Francisco, CA, USA
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
