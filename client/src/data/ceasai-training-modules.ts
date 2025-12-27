/**
 * CEASAI EU AI Act Comprehensive Training Modules
 * 8 authoritative modules covering all EU AI Act Articles 4-52
 * With real-world case studies, practical implementation guides, and 100+ assessment questions
 */

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  tier: 'fundamentals' | 'professional' | 'advanced';
  durationHours: number;
  objectives: string[];
  topics: string[];
  caseStudies: CaseStudy[];
  practicalExercises: PracticalExercise[];
  assessmentQuestions: number;
  passScore: number;
}

export interface CaseStudy {
  title: string;
  company: string;
  issue: string;
  analysis: string;
  lessons: string[];
  regulatoryImplications: string;
}

export interface PracticalExercise {
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  deliverable: string;
}

export const ceasaiTrainingModules: TrainingModule[] = [
  {
    id: 'ceasai-module-1-fundamentals',
    title: 'EU AI Act Fundamentals and Risk Framework',
    description: 'Introduction to the EU AI Act, risk-based approach, and foundational concepts for AI Safety Analysts',
    tier: 'fundamentals',
    durationHours: 8,
    objectives: [
      'Understand the EU AI Act structure, scope, and implementation timeline',
      'Master the four-tier risk-based approach (Unacceptable, High, Limited, Minimal)',
      'Identify prohibited AI practices and understand enforcement mechanisms',
      'Recognize high-risk AI systems and their requirements',
      'Understand the roles of stakeholders (providers, deployers, authorities)',
    ],
    topics: [
      'EU AI Act overview and history',
      'Regulation (EU) 2024/1689 structure and scope',
      'Risk-based approach and categorization',
      'Prohibited AI practices (Article 5)',
      'High-risk AI systems (Annex III)',
      'Transparency and disclosure requirements',
      'Enforcement and penalties',
      'Implementation timeline and phased approach',
    ],
    caseStudies: [
      {
        title: 'Amazon Recruitment AI Bias',
        company: 'Amazon',
        issue: 'AI recruitment system showed bias against women in technical roles',
        analysis: 'The system was trained on historical hiring data that reflected gender bias. It learned to discriminate based on gender-correlated features.',
        lessons: [
          'Bias in training data perpetuates historical discrimination',
          'AI systems can amplify existing biases at scale',
          'Transparency about AI use in hiring is critical',
          'Regular bias audits are essential',
        ],
        regulatoryImplications: 'Would be classified as high-risk under Annex III (employment), requiring bias assessment and human oversight',
      },
      {
        title: 'COMPAS Recidivism Algorithm',
        company: 'Equifax/ProPublica',
        issue: 'Predictive algorithm used in criminal justice showed racial bias in recidivism predictions',
        analysis: 'The algorithm predicted higher recidivism rates for Black defendants compared to White defendants with similar criminal histories.',
        lessons: [
          'Algorithmic bias can have severe consequences in criminal justice',
          'Fairness metrics must be carefully selected and monitored',
          'Transparency in algorithmic decision-making is crucial',
          'Human oversight and appeal mechanisms are essential',
        ],
        regulatoryImplications: 'Would be classified as high-risk under Annex III (law enforcement), requiring fairness assessment and human review',
      },
    ],
    practicalExercises: [
      {
        title: 'Risk Categorization Exercise',
        description: 'Analyze 5 AI systems and categorize them according to EU AI Act risk tiers',
        duration: 2,
        objectives: [
          'Apply risk-based approach to real-world AI systems',
          'Identify high-risk characteristics',
          'Understand regulatory implications of risk classification',
        ],
        deliverable: 'Risk categorization report with justification for each system',
      },
      {
        title: 'Prohibited Practice Identification',
        description: 'Review case studies and identify which prohibited practices are being violated',
        duration: 1.5,
        objectives: [
          'Recognize prohibited AI practices in real scenarios',
          'Understand enforcement implications',
          'Apply Article 5 requirements',
        ],
        deliverable: 'Analysis of violations and recommended corrective actions',
      },
    ],
    assessmentQuestions: 15,
    passScore: 70,
  },

  {
    id: 'ceasai-module-2-risk-assessment',
    title: 'High-Risk AI System Assessment and Compliance',
    description: 'Detailed assessment of high-risk AI systems under Annex III categories with compliance requirements',
    tier: 'professional',
    durationHours: 10,
    objectives: [
      'Master assessment of all 8 Annex III high-risk categories',
      'Understand technical documentation requirements',
      'Conduct risk assessments and mitigation planning',
      'Evaluate conformity assessment procedures',
      'Understand post-market monitoring requirements',
    ],
    topics: [
      'Annex III high-risk categories (1-8)',
      'Biometric systems (remote identification, emotion recognition)',
      'Critical infrastructure AI systems',
      'Education and vocational training systems',
      'Employment and worker management systems',
      'Essential services (creditworthiness, insurance, emergency)',
      'Law enforcement systems',
      'Migration and border control systems',
      'Administration of justice and democratic processes',
      'Technical documentation requirements',
      'Risk assessment and management',
      'Post-market monitoring and incident reporting',
    ],
    caseStudies: [
      {
        title: 'Clearview AI Facial Recognition Privacy Violation',
        company: 'Clearview AI',
        issue: 'Unauthorized collection of billions of facial images from social media for law enforcement use',
        analysis: 'Company scraped facial images without consent, violating privacy rights and data protection regulations',
        lessons: [
          'Data collection must comply with GDPR and consent requirements',
          'Biometric data requires special protection',
          'Law enforcement use of AI requires legal basis and oversight',
          'Transparency about data sources is essential',
        ],
        regulatoryImplications: 'Violates Annex III (law enforcement) and GDPR requirements; would face significant fines',
      },
      {
        title: 'Predictive Policing in UK',
        company: 'Various UK Police Forces',
        issue: 'Predictive policing algorithms showing bias against minority communities',
        analysis: 'Systems trained on historical crime data that reflected biased policing patterns, perpetuating discrimination',
        lessons: [
          'Historical data can embed systemic bias',
          'Fairness assessment must include demographic analysis',
          'Community impact assessment is essential',
          'Transparency and accountability mechanisms are critical',
        ],
        regulatoryImplications: 'Would be classified as high-risk under Annex III (law enforcement), requiring fairness assessment',
      },
    ],
    practicalExercises: [
      {
        title: 'Annex III Category Assessment',
        description: 'Conduct comprehensive assessment of high-risk AI system across multiple Annex III categories',
        duration: 4,
        objectives: [
          'Apply Annex III requirements to real systems',
          'Identify compliance gaps',
          'Develop remediation plans',
        ],
        deliverable: 'Detailed compliance assessment report',
      },
      {
        title: 'Technical Documentation Review',
        description: 'Review and evaluate technical documentation for completeness and accuracy',
        duration: 2,
        objectives: [
          'Understand documentation requirements',
          'Identify missing information',
          'Assess documentation quality',
        ],
        deliverable: 'Documentation review report with recommendations',
      },
    ],
    assessmentQuestions: 20,
    passScore: 75,
  },

  {
    id: 'ceasai-module-3-compliance',
    title: 'EU AI Act Compliance Implementation',
    description: 'Practical guidance on implementing EU AI Act compliance in organizations',
    tier: 'professional',
    durationHours: 9,
    objectives: [
      'Develop compliance implementation strategies',
      'Establish governance structures for AI systems',
      'Create compliance documentation and procedures',
      'Implement monitoring and incident reporting',
      'Understand conformity assessment procedures',
    ],
    topics: [
      'Compliance implementation roadmap',
      'Governance structures and roles',
      'Documentation and record-keeping',
      'Monitoring and incident reporting',
      'Conformity assessment procedures',
      'Notified body engagement',
      'Post-market surveillance',
      'Compliance auditing and verification',
      'Training and awareness programs',
      'Incident response procedures',
    ],
    caseStudies: [
      {
        title: 'Healthcare AI Diagnostic System Bias',
        company: 'Major Healthcare Provider',
        issue: 'AI diagnostic system showing bias against minority patients',
        analysis: 'Training data underrepresented minority populations, leading to lower accuracy for these groups',
        lessons: [
          'Training data must be representative of all populations',
          'Performance metrics must be evaluated by demographic group',
          'Clinical validation must include diverse populations',
          'Ongoing monitoring is essential',
        ],
        regulatoryImplications: 'Would require bias assessment and mitigation under Annex III requirements',
      },
    ],
    practicalExercises: [
      {
        title: 'Compliance Roadmap Development',
        description: 'Develop a 12-month compliance implementation roadmap for an organization',
        duration: 3,
        objectives: [
          'Prioritize compliance activities',
          'Allocate resources effectively',
          'Establish timelines and milestones',
        ],
        deliverable: 'Comprehensive compliance roadmap document',
      },
      {
        title: 'Governance Framework Design',
        description: 'Design governance structures and procedures for AI system oversight',
        duration: 2.5,
        objectives: [
          'Establish clear roles and responsibilities',
          'Create decision-making procedures',
          'Implement oversight mechanisms',
        ],
        deliverable: 'Governance framework document',
      },
    ],
    assessmentQuestions: 18,
    passScore: 75,
  },

  {
    id: 'ceasai-module-4-governance',
    title: 'AI Governance and Regulatory Framework',
    description: 'Strategic guidance on AI governance structures, regulatory relationships, and policy development',
    tier: 'advanced',
    durationHours: 10,
    objectives: [
      'Understand AI governance frameworks and structures',
      'Develop organizational AI governance policies',
      'Engage with regulatory authorities',
      'Participate in standards development',
      'Influence AI policy and regulation',
    ],
    topics: [
      'AI governance frameworks and models',
      'Regulatory landscape and authorities',
      'Standards development and harmonization',
      'International AI governance',
      'Stakeholder engagement strategies',
      'Policy development and advocacy',
      'Regulatory compliance and reporting',
      'Risk management and governance',
      'Ethical AI governance',
      'Emerging governance challenges',
    ],
    caseStudies: [
      {
        title: 'Autonomous Vehicle Governance',
        company: 'Multiple OEMs',
        issue: 'Lack of clear governance framework for autonomous vehicle safety and liability',
        analysis: 'Different jurisdictions have different requirements, creating fragmented governance landscape',
        lessons: [
          'Harmonized governance frameworks are essential for global AI systems',
          'Safety standards must be clear and enforceable',
          'Liability frameworks must be clearly defined',
          'Ongoing monitoring and adaptation are necessary',
        ],
        regulatoryImplications: 'Requires coordination between national authorities and international standards bodies',
      },
    ],
    practicalExercises: [
      {
        title: 'AI Governance Policy Development',
        description: 'Develop comprehensive AI governance policy for an organization',
        duration: 4,
        objectives: [
          'Create governance structures',
          'Define roles and responsibilities',
          'Establish decision-making procedures',
        ],
        deliverable: 'Comprehensive AI governance policy document',
      },
      {
        title: 'Regulatory Engagement Strategy',
        description: 'Develop strategy for engaging with regulatory authorities',
        duration: 2,
        objectives: [
          'Identify key regulatory contacts',
          'Develop engagement plan',
          'Prepare regulatory submissions',
        ],
        deliverable: 'Regulatory engagement strategy document',
      },
    ],
    assessmentQuestions: 16,
    passScore: 75,
  },

  {
    id: 'ceasai-module-5-assessment',
    title: 'Conformity Assessment Procedures and Methodologies',
    description: 'Technical procedures for conducting conformity assessments of high-risk AI systems',
    tier: 'professional',
    durationHours: 12,
    objectives: [
      'Master conformity assessment procedures (Modules A-D)',
      'Conduct technical evaluation of AI systems',
      'Perform bias and fairness testing',
      'Evaluate cybersecurity and robustness',
      'Issue conformity certificates',
    ],
    topics: [
      'Conformity assessment modules (A, B, C, D)',
      'Module A: Internal control procedures',
      'Module B: EU type-examination',
      'Module C: Conformity to type',
      'Module D: Quality assurance',
      'Technical evaluation procedures',
      'Bias and fairness testing',
      'Cybersecurity assessment',
      'Robustness and adversarial testing',
      'Documentation and record-keeping',
      'Certification and marking procedures',
    ],
    caseStudies: [
      {
        title: 'Bias Testing in Recruitment AI',
        company: 'Tech Company',
        issue: 'Recruitment AI system showing gender bias in candidate screening',
        analysis: 'Systematic testing revealed lower scores for female candidates with equivalent qualifications',
        lessons: [
          'Bias testing must be comprehensive and systematic',
          'Multiple fairness metrics should be evaluated',
          'Testing must include diverse demographic groups',
          'Results must inform mitigation strategies',
        ],
        regulatoryImplications: 'Requires bias assessment and mitigation under conformity assessment procedures',
      },
    ],
    practicalExercises: [
      {
        title: 'Conformity Assessment Project',
        description: 'Conduct full conformity assessment of high-risk AI system',
        duration: 6,
        objectives: [
          'Apply conformity assessment procedures',
          'Conduct technical evaluation',
          'Perform testing and validation',
          'Issue assessment report',
        ],
        deliverable: 'Complete conformity assessment report',
      },
      {
        title: 'Bias Testing Lab',
        description: 'Conduct bias testing on AI system using practical tools and methodologies',
        duration: 3,
        objectives: [
          'Apply bias testing methodologies',
          'Use bias testing tools',
          'Analyze results and identify issues',
        ],
        deliverable: 'Bias testing report with findings and recommendations',
      },
    ],
    assessmentQuestions: 22,
    passScore: 75,
  },

  {
    id: 'ceasai-module-6-documentation',
    title: 'Technical Documentation and Record-Keeping',
    description: 'Requirements and best practices for AI system documentation and compliance records',
    tier: 'professional',
    durationHours: 8,
    objectives: [
      'Understand technical documentation requirements',
      'Create comprehensive AI system documentation',
      'Establish record-keeping procedures',
      'Maintain compliance documentation',
      'Prepare for regulatory inspections',
    ],
    topics: [
      'Technical documentation requirements',
      'System design and architecture documentation',
      'Data documentation and management',
      'Training and testing documentation',
      'Performance and accuracy documentation',
      'Risk assessment documentation',
      'Mitigation measures documentation',
      'Post-market monitoring documentation',
      'Incident reporting and documentation',
      'Record retention and management',
      'Regulatory inspection preparation',
    ],
    caseStudies: [
      {
        title: 'Inadequate Documentation in Medical AI',
        company: 'Medical Device Company',
        issue: 'Insufficient documentation of AI system performance and validation',
        analysis: 'Regulatory inspection revealed gaps in clinical validation documentation and performance reporting',
        lessons: [
          'Documentation must be comprehensive and detailed',
          'Performance metrics must be clearly documented',
          'Validation procedures must be documented',
          'Changes and updates must be tracked',
        ],
        regulatoryImplications: 'Regulatory violation requiring corrective actions and documentation improvements',
      },
    ],
    practicalExercises: [
      {
        title: 'Technical Documentation Development',
        description: 'Create comprehensive technical documentation for AI system',
        duration: 3,
        objectives: [
          'Document system architecture and design',
          'Document data and training procedures',
          'Document performance and validation',
        ],
        deliverable: 'Complete technical documentation package',
      },
      {
        title: 'Record-Keeping System Design',
        description: 'Design record-keeping system for compliance documentation',
        duration: 2,
        objectives: [
          'Establish record categories',
          'Define retention periods',
          'Create access controls',
        ],
        deliverable: 'Record-keeping system documentation',
      },
    ],
    assessmentQuestions: 14,
    passScore: 70,
  },

  {
    id: 'ceasai-module-7-incidents',
    title: 'Incident Response and Post-Market Monitoring',
    description: 'Procedures for monitoring AI systems post-market and responding to incidents',
    tier: 'professional',
    durationHours: 9,
    objectives: [
      'Establish post-market monitoring procedures',
      'Identify and report incidents',
      'Conduct incident investigations',
      'Implement corrective actions',
      'Communicate with regulators and stakeholders',
    ],
    topics: [
      'Post-market monitoring requirements',
      'Incident identification and classification',
      'Incident reporting procedures',
      'Incident investigation methodologies',
      'Root cause analysis',
      'Corrective action development',
      'Regulatory notification requirements',
      'Stakeholder communication',
      'Continuous improvement from incidents',
      'Incident database and analytics',
    ],
    caseStudies: [
      {
        title: 'Discrimination Incident in Hiring System',
        company: 'Recruitment Platform',
        issue: 'Users reported discrimination in AI-powered hiring recommendations',
        analysis: 'Investigation revealed system was recommending candidates based on protected characteristics',
        lessons: [
          'Incident monitoring systems must be in place',
          'User feedback mechanisms are essential',
          'Investigation procedures must be thorough',
          'Corrective actions must address root causes',
        ],
        regulatoryImplications: 'Requires incident reporting to authorities and implementation of corrective measures',
      },
    ],
    practicalExercises: [
      {
        title: 'Incident Investigation Simulation',
        description: 'Investigate simulated AI system incident and develop response plan',
        duration: 3,
        objectives: [
          'Apply investigation procedures',
          'Conduct root cause analysis',
          'Develop corrective actions',
        ],
        deliverable: 'Incident investigation report and response plan',
      },
      {
        title: 'Post-Market Monitoring System Design',
        description: 'Design post-market monitoring system for AI system',
        duration: 2.5,
        objectives: [
          'Define monitoring procedures',
          'Establish alert thresholds',
          'Create reporting mechanisms',
        ],
        deliverable: 'Post-market monitoring system documentation',
      },
    ],
    assessmentQuestions: 17,
    passScore: 75,
  },

  {
    id: 'ceasai-module-8-advanced',
    title: 'Advanced Topics and Emerging Challenges',
    description: 'Advanced topics including foundation models, generative AI, international harmonization, and future trends',
    tier: 'advanced',
    durationHours: 11,
    objectives: [
      'Understand emerging AI technologies and their regulatory implications',
      'Address foundation models and large language models',
      'Navigate international AI governance landscape',
      'Anticipate future regulatory developments',
      'Develop adaptive governance strategies',
    ],
    topics: [
      'Foundation models and large language models',
      'Generative AI and AI-generated content',
      'Multimodal AI systems',
      'Autonomous systems and robotics',
      'AI and cybersecurity',
      'AI and climate change',
      'AI and human rights',
      'International AI governance',
      'Standards harmonization',
      'Emerging regulatory frameworks',
      'Future of AI regulation',
    ],
    caseStudies: [
      {
        title: 'ChatGPT and Foundation Model Governance',
        company: 'OpenAI',
        issue: 'Regulatory uncertainty around governance of large foundation models',
        analysis: 'Foundation models have broad applications and potential harms, creating governance challenges',
        lessons: [
          'Foundation models require specific governance approaches',
          'Transparency about model capabilities and limitations is essential',
          'Downstream use cases must be considered',
          'International coordination is necessary',
        ],
        regulatoryImplications: 'EU AI Act addresses foundation models with specific transparency requirements',
      },
      {
        title: 'Deepfakes and Synthetic Media',
        company: 'Multiple Platforms',
        issue: 'Proliferation of deepfakes and synthetic media raising concerns about misinformation',
        analysis: 'AI-generated content can deceive and manipulate at scale, with significant societal impacts',
        lessons: [
          'Synthetic media detection and labeling are essential',
          'Platform responsibility for content moderation',
          'User awareness and media literacy are important',
          'Regulatory frameworks must balance innovation and safety',
        ],
        regulatoryImplications: 'Requires transparency requirements and potentially new regulatory approaches',
      },
    ],
    practicalExercises: [
      {
        title: 'Foundation Model Assessment',
        description: 'Assess governance and compliance of foundation model',
        duration: 4,
        objectives: [
          'Understand foundation model characteristics',
          'Assess governance requirements',
          'Identify compliance gaps',
        ],
        deliverable: 'Foundation model assessment report',
      },
      {
        title: 'Future Governance Strategy Development',
        description: 'Develop adaptive governance strategy for emerging AI technologies',
        duration: 3,
        objectives: [
          'Anticipate future developments',
          'Develop adaptive strategies',
          'Plan for regulatory changes',
        ],
        deliverable: 'Future governance strategy document',
      },
    ],
    assessmentQuestions: 19,
    passScore: 75,
  },
];

/**
 * Get module by ID
 */
export function getCEASAIModule(moduleId: string): TrainingModule | undefined {
  return ceasaiTrainingModules.find(m => m.id === moduleId);
}

/**
 * Get all modules for a tier
 */
export function getCEASAIModulesByTier(tier: 'fundamentals' | 'professional' | 'advanced'): TrainingModule[] {
  return ceasaiTrainingModules.filter(m => m.tier === tier);
}

/**
 * Get total assessment questions across all modules
 */
export function getTotalAssessmentQuestions(): number {
  return ceasaiTrainingModules.reduce((total, module) => total + module.assessmentQuestions, 0);
}

/**
 * Get total training hours across all modules
 */
export function getTotalTrainingHours(): number {
  return ceasaiTrainingModules.reduce((total, module) => total + module.durationHours, 0);
}
