/**
 * CEASAI Specialization Tracks
 * 8 domain-specific specialization tracks with advanced assessments and practical labs
 */

export interface SpecializationTrack {
  id: string;
  title: string;
  description: string;
  category: string;
  durationHours: number;
  prerequisites: string[];
  learningOutcomes: string[];
  modules: SpecializationModule[];
  practicalLabs: PracticalLab[];
  assessmentType: 'exam' | 'project' | 'combined';
  passScore: number;
  certificateTitle: string;
}

export interface SpecializationModule {
  title: string;
  duration: number;
  topics: string[];
  caseStudies: string[];
}

export interface PracticalLab {
  title: string;
  description: string;
  duration: number;
  objectives: string[];
  tools: string[];
  deliverable: string;
}

export const ceasaiSpecializationTracks: SpecializationTrack[] = [
  {
    id: 'ceasai-spec-biometrics',
    title: 'Biometric Systems Specialist',
    description: 'Advanced expertise in assessing and governing biometric AI systems including facial recognition, fingerprint analysis, and emotion recognition',
    category: 'Biometric Systems',
    durationHours: 40,
    prerequisites: ['CEASAI Professional Tier'],
    learningOutcomes: [
      'Understand biometric technology fundamentals and limitations',
      'Assess facial recognition systems for accuracy and bias',
      'Evaluate emotion recognition systems and ethical concerns',
      'Conduct privacy impact assessments for biometric data',
      'Develop biometric system governance policies',
      'Assess compliance with GDPR and biometric data protection',
    ],
    modules: [
      {
        title: 'Biometric Technology Fundamentals',
        duration: 6,
        topics: [
          'Facial recognition technology and algorithms',
          'Fingerprint and iris recognition',
          'Emotion recognition and sentiment analysis',
          'Liveness detection and spoofing prevention',
          'Accuracy metrics and performance evaluation',
          'Limitations and failure modes',
        ],
        caseStudies: ['Clearview AI Privacy Violation', 'Amazon Rekognition Bias', 'Facial Recognition in Law Enforcement'],
      },
      {
        title: 'Biometric System Assessment',
        duration: 8,
        topics: [
          'Accuracy and false positive/negative rates',
          'Bias testing across demographic groups',
          'Privacy and data protection assessment',
          'Security and spoofing resistance',
          'Regulatory compliance evaluation',
          'Risk assessment and mitigation',
        ],
        caseStudies: ['Gender and Racial Bias in Facial Recognition', 'Biometric Data Breaches', 'Unauthorized Biometric Collection'],
      },
      {
        title: 'Biometric Data Protection and Privacy',
        duration: 6,
        topics: [
          'GDPR requirements for biometric data',
          'Consent and legal basis for processing',
          'Data minimization and purpose limitation',
          'Retention and deletion procedures',
          'International data transfer restrictions',
          'Privacy impact assessments',
        ],
        caseStudies: ['GDPR Enforcement Actions', 'Biometric Data Breaches', 'Unauthorized Biometric Processing'],
      },
      {
        title: 'Biometric Governance and Policy',
        duration: 8,
        topics: [
          'Governance frameworks for biometric systems',
          'Organizational policies and procedures',
          'Transparency and disclosure requirements',
          'User rights and consent management',
          'Incident response procedures',
          'Regulatory compliance monitoring',
        ],
        caseStudies: ['Biometric System Governance Best Practices', 'Policy Development Case Studies'],
      },
      {
        title: 'Advanced Topics and Emerging Issues',
        duration: 6,
        topics: [
          'Multimodal biometric systems',
          'Continuous authentication systems',
          'Behavioral biometrics',
          'Emerging privacy-preserving technologies',
          'Future regulatory developments',
          'Ethical considerations and human rights',
        ],
        caseStudies: ['Emerging Biometric Technologies', 'Human Rights Concerns'],
      },
    ],
    practicalLabs: [
      {
        title: 'Facial Recognition Bias Testing',
        description: 'Conduct bias testing on facial recognition system using real-world datasets',
        duration: 8,
        objectives: [
          'Apply bias testing methodologies',
          'Use facial recognition testing tools',
          'Analyze performance across demographic groups',
          'Document findings and recommendations',
        ],
        tools: ['Python', 'Face Recognition Libraries', 'Bias Testing Tools', 'Statistical Analysis'],
        deliverable: 'Bias testing report with demographic performance analysis',
      },
      {
        title: 'Privacy Impact Assessment',
        description: 'Conduct privacy impact assessment for biometric system',
        duration: 6,
        objectives: [
          'Identify privacy risks',
          'Assess GDPR compliance',
          'Develop mitigation strategies',
          'Create privacy documentation',
        ],
        tools: ['Privacy Assessment Framework', 'GDPR Compliance Checklist', 'Documentation Templates'],
        deliverable: 'Privacy impact assessment report',
      },
    ],
    assessmentType: 'combined',
    passScore: 75,
    certificateTitle: 'CEASAI Biometric Systems Specialist',
  },

  {
    id: 'ceasai-spec-infrastructure',
    title: 'Critical Infrastructure Specialist',
    description: 'Advanced expertise in assessing AI systems in critical infrastructure including digital systems, transportation, and utilities',
    category: 'Critical Infrastructure',
    durationHours: 50,
    prerequisites: ['CEASAI Professional Tier'],
    learningOutcomes: [
      'Understand critical infrastructure systems and AI applications',
      'Assess AI systems for safety and security in critical infrastructure',
      'Conduct risk assessments for critical infrastructure AI',
      'Develop resilience and redundancy strategies',
      'Understand regulatory requirements for critical infrastructure',
      'Assess cybersecurity and resilience of AI systems',
    ],
    modules: [
      {
        title: 'Critical Infrastructure Overview',
        duration: 6,
        topics: [
          'Critical infrastructure sectors and systems',
          'Digital infrastructure and networks',
          'Transportation systems (rail, aviation, maritime)',
          'Utilities (electricity, water, gas)',
          'AI applications in critical infrastructure',
          'Interdependencies and cascading failures',
        ],
        caseStudies: ['Power Grid Failures', 'Transportation System Disruptions', 'Utility System Outages'],
      },
      {
        title: 'Safety and Security Assessment',
        duration: 8,
        topics: [
          'Safety-critical system assessment',
          'Failure mode analysis',
          'Cybersecurity assessment',
          'Resilience and redundancy evaluation',
          'Attack surface analysis',
          'Mitigation strategies',
        ],
        caseStudies: ['Critical Infrastructure Cyberattacks', 'AI System Failures in Infrastructure'],
      },
      {
        title: 'Risk Management for Critical Infrastructure',
        duration: 8,
        topics: [
          'Risk identification and assessment',
          'Consequence analysis',
          'Probability estimation',
          'Risk mitigation strategies',
          'Residual risk evaluation',
          'Continuous monitoring',
        ],
        caseStudies: ['Infrastructure Risk Management Case Studies'],
      },
      {
        title: 'Regulatory and Compliance Framework',
        duration: 8,
        topics: [
          'Critical infrastructure protection regulations',
          'NIS Directive and NIS2 requirements',
          'Sector-specific regulations',
          'Reporting and notification requirements',
          'Incident response procedures',
          'Compliance verification',
        ],
        caseStudies: ['Regulatory Compliance Case Studies'],
      },
      {
        title: 'Resilience and Business Continuity',
        duration: 8,
        topics: [
          'Resilience engineering principles',
          'Redundancy and failover strategies',
          'Business continuity planning',
          'Disaster recovery procedures',
          'Testing and validation',
          'Continuous improvement',
        ],
        caseStudies: ['Resilience Case Studies'],
      },
      {
        title: 'Advanced Topics',
        duration: 6,
        topics: [
          'Autonomous systems in infrastructure',
          'AI-enabled predictive maintenance',
          'Smart grid and smart city systems',
          'Emerging threats and vulnerabilities',
          'Future regulatory developments',
        ],
        caseStudies: ['Emerging Infrastructure Technologies'],
      },
    ],
    practicalLabs: [
      {
        title: 'Critical Infrastructure Risk Assessment',
        description: 'Conduct comprehensive risk assessment for critical infrastructure AI system',
        duration: 10,
        objectives: [
          'Identify critical infrastructure risks',
          'Assess AI system impact on infrastructure',
          'Develop risk mitigation strategies',
          'Create risk management plan',
        ],
        tools: ['Risk Assessment Framework', 'FMEA Tools', 'Risk Matrices', 'Documentation Templates'],
        deliverable: 'Risk assessment and management plan',
      },
      {
        title: 'Cybersecurity Assessment',
        description: 'Assess cybersecurity and resilience of critical infrastructure AI system',
        duration: 8,
        objectives: [
          'Identify cybersecurity vulnerabilities',
          'Assess attack surface',
          'Evaluate resilience measures',
          'Develop security recommendations',
        ],
        tools: ['Cybersecurity Assessment Framework', 'Vulnerability Assessment Tools', 'Security Testing Tools'],
        deliverable: 'Cybersecurity assessment report',
      },
    ],
    assessmentType: 'combined',
    passScore: 75,
    certificateTitle: 'CEASAI Critical Infrastructure Specialist',
  },

  {
    id: 'ceasai-spec-employment',
    title: 'Employment AI Specialist',
    description: 'Advanced expertise in assessing and governing AI systems used in employment including recruitment, performance evaluation, and worker monitoring',
    category: 'Employment and Worker Management',
    durationHours: 40,
    prerequisites: ['CEASAI Professional Tier'],
    learningOutcomes: [
      'Understand AI applications in employment and their impacts',
      'Assess recruitment AI systems for bias and fairness',
      'Evaluate performance evaluation systems',
      'Assess worker monitoring and surveillance systems',
      'Conduct employment law and compliance analysis',
      'Develop employment AI governance policies',
    ],
    modules: [
      {
        title: 'AI in Employment: Overview and Applications',
        duration: 6,
        topics: [
          'Recruitment AI systems',
          'Resume screening and candidate ranking',
          'Interview analysis and assessment',
          'Performance evaluation systems',
          'Worker monitoring and surveillance',
          'Compensation and promotion systems',
        ],
        caseStudies: ['Amazon Recruitment AI Bias', 'Automated Performance Evaluation', 'Worker Monitoring Systems'],
      },
      {
        title: 'Bias and Fairness in Employment AI',
        duration: 8,
        topics: [
          'Sources of bias in employment AI',
          'Fairness metrics and definitions',
          'Bias testing methodologies',
          'Demographic parity and equalized odds',
          'Intersectionality and compound bias',
          'Mitigation strategies',
        ],
        caseStudies: ['Gender Bias in Recruitment', 'Racial Bias in Performance Evaluation', 'Age Discrimination'],
      },
      {
        title: 'Employment Law and Compliance',
        duration: 8,
        topics: [
          'Anti-discrimination laws (Title VII, ADEA, ADA)',
          'Equal Employment Opportunity requirements',
          'GDPR and employment data protection',
          'Transparency requirements',
          'Consent and disclosure',
          'Right to explanation and appeal',
        ],
        caseStudies: ['Employment Law Violations', 'GDPR Enforcement Actions'],
      },
      {
        title: 'Worker Rights and Transparency',
        duration: 6,
        topics: [
          'Worker rights in AI-driven employment',
          'Transparency and disclosure requirements',
          'Consent and opt-out procedures',
          'Right to explanation',
          'Appeal and remediation procedures',
          'Human oversight and intervention',
        ],
        caseStudies: ['Worker Rights Case Studies'],
      },
      {
        title: 'Employment AI Governance and Policy',
        duration: 6,
        topics: [
          'Governance frameworks for employment AI',
          'Organizational policies and procedures',
          'Bias monitoring and auditing',
          'Incident response procedures',
          'Regulatory compliance monitoring',
          'Stakeholder engagement',
        ],
        caseStudies: ['Employment AI Governance Best Practices'],
      },
    ],
    practicalLabs: [
      {
        title: 'Recruitment AI Bias Testing',
        description: 'Conduct comprehensive bias testing on recruitment AI system',
        duration: 8,
        objectives: [
          'Apply bias testing methodologies',
          'Test for demographic bias',
          'Analyze fairness metrics',
          'Document findings and recommendations',
        ],
        tools: ['Python', 'Bias Testing Libraries', 'Statistical Analysis Tools'],
        deliverable: 'Bias testing report with fairness analysis',
      },
      {
        title: 'Employment Compliance Assessment',
        description: 'Conduct employment law and compliance assessment for AI system',
        duration: 6,
        objectives: [
          'Assess legal compliance',
          'Identify compliance gaps',
          'Develop remediation strategies',
          'Create compliance documentation',
        ],
        tools: ['Compliance Assessment Framework', 'Legal Compliance Checklist', 'Documentation Templates'],
        deliverable: 'Employment compliance assessment report',
      },
    ],
    assessmentType: 'combined',
    passScore: 75,
    certificateTitle: 'CEASAI Employment AI Specialist',
  },

  {
    id: 'ceasai-spec-finance',
    title: 'Financial Services Specialist',
    description: 'Advanced expertise in assessing AI systems in financial services including creditworthiness assessment, insurance, and fraud detection',
    category: 'Financial Services',
    durationHours: 45,
    prerequisites: ['CEASAI Professional Tier'],
    learningOutcomes: [
      'Understand AI applications in financial services',
      'Assess creditworthiness assessment systems',
      'Evaluate insurance risk assessment systems',
      'Assess fraud detection systems',
      'Conduct financial regulation compliance analysis',
      'Develop financial AI governance policies',
    ],
    modules: [
      {
        title: 'AI in Financial Services',
        duration: 6,
        topics: [
          'Creditworthiness assessment systems',
          'Credit scoring and rating',
          'Insurance risk assessment',
          'Fraud detection systems',
          'Trading and investment systems',
          'Customer profiling and targeting',
        ],
        caseStudies: ['Credit Scoring Bias', 'Insurance Discrimination', 'Fraud Detection Errors'],
      },
      {
        title: 'Creditworthiness Assessment',
        duration: 8,
        topics: [
          'Credit scoring methodologies',
          'Alternative data sources',
          'Bias in credit assessment',
          'Fairness and discrimination',
          'Transparency and explainability',
          'Regulatory requirements',
        ],
        caseStudies: ['Credit Scoring Discrimination', 'Alternative Data Bias'],
      },
      {
        title: 'Insurance and Risk Assessment',
        duration: 8,
        topics: [
          'Insurance risk assessment',
          'Underwriting systems',
          'Claims assessment',
          'Pricing discrimination',
          'Fairness in insurance',
          'Regulatory requirements',
        ],
        caseStudies: ['Insurance Discrimination', 'Risk Assessment Bias'],
      },
      {
        title: 'Financial Regulation and Compliance',
        duration: 8,
        topics: [
          'MiFID II requirements',
          'PSD2 and payment regulations',
          'GDPR and financial data',
          'Anti-money laundering (AML) requirements',
          'Know Your Customer (KYC) procedures',
          'Fair lending requirements',
        ],
        caseStudies: ['Financial Regulation Violations', 'Compliance Enforcement'],
      },
      {
        title: 'Financial AI Governance',
        duration: 7,
        topics: [
          'Governance frameworks for financial AI',
          'Risk management procedures',
          'Compliance monitoring',
          'Incident response',
          'Regulatory reporting',
          'Stakeholder management',
        ],
        caseStudies: ['Financial AI Governance Case Studies'],
      },
    ],
    practicalLabs: [
      {
        title: 'Credit Scoring Bias Assessment',
        description: 'Assess bias in credit scoring system',
        duration: 8,
        objectives: [
          'Analyze credit scoring algorithm',
          'Test for demographic bias',
          'Evaluate fairness metrics',
          'Document findings',
        ],
        tools: ['Python', 'Statistical Analysis', 'Bias Testing Tools'],
        deliverable: 'Credit scoring bias assessment report',
      },
      {
        title: 'Financial Compliance Assessment',
        description: 'Conduct comprehensive financial compliance assessment',
        duration: 7,
        objectives: [
          'Assess regulatory compliance',
          'Identify compliance gaps',
          'Develop remediation plan',
          'Create compliance documentation',
        ],
        tools: ['Compliance Framework', 'Regulatory Checklist', 'Documentation Templates'],
        deliverable: 'Financial compliance assessment report',
      },
    ],
    assessmentType: 'combined',
    passScore: 75,
    certificateTitle: 'CEASAI Financial Services Specialist',
  },

  {
    id: 'ceasai-spec-healthcare',
    title: 'Healthcare AI Specialist',
    description: 'Advanced expertise in assessing AI systems in healthcare including diagnostic systems, treatment recommendations, and patient monitoring',
    category: 'Healthcare',
    durationHours: 50,
    prerequisites: ['CEASAI Professional Tier'],
    learningOutcomes: [
      'Understand AI applications in healthcare',
      'Assess diagnostic AI systems',
      'Evaluate treatment recommendation systems',
      'Assess patient monitoring systems',
      'Conduct healthcare regulation compliance analysis',
      'Develop healthcare AI governance policies',
    ],
    modules: [
      {
        title: 'AI in Healthcare: Overview',
        duration: 6,
        topics: [
          'Diagnostic AI systems',
          'Medical imaging analysis',
          'Treatment recommendation systems',
          'Patient monitoring systems',
          'Drug discovery and development',
          'Healthcare operations and administration',
        ],
        caseStudies: ['Healthcare AI Diagnostic Bias', 'Treatment Recommendation Errors', 'Patient Monitoring Failures'],
      },
      {
        title: 'Diagnostic AI Assessment',
        duration: 8,
        topics: [
          'Diagnostic accuracy and validation',
          'Sensitivity and specificity',
          'Demographic bias in diagnostics',
          'Clinical validation procedures',
          'Regulatory requirements',
          'Transparency and explainability',
        ],
        caseStudies: ['Diagnostic AI Bias', 'Clinical Validation Case Studies'],
      },
      {
        title: 'Healthcare Regulation and Compliance',
        duration: 8,
        topics: [
          'Medical Device Regulation (MDR)',
          'In Vitro Diagnostic Regulation (IVDR)',
          'GDPR and healthcare data',
          'HIPAA and patient privacy',
          'Clinical validation requirements',
          'Post-market surveillance',
        ],
        caseStudies: ['Medical Device Compliance', 'Healthcare Data Breaches'],
      },
      {
        title: 'Clinical Validation and Testing',
        duration: 8,
        topics: [
          'Clinical trial design',
          'Validation methodologies',
          'Performance evaluation',
          'Real-world performance monitoring',
          'Adverse event reporting',
          'Continuous improvement',
        ],
        caseStudies: ['Clinical Validation Case Studies'],
      },
      {
        title: 'Healthcare AI Governance',
        duration: 8,
        topics: [
          'Governance frameworks for healthcare AI',
          'Ethical considerations',
          'Patient consent and rights',
          'Physician oversight and responsibility',
          'Incident response procedures',
          'Regulatory compliance monitoring',
        ],
        caseStudies: ['Healthcare AI Governance Best Practices'],
      },
      {
        title: 'Advanced Topics',
        duration: 6,
        topics: [
          'Personalized medicine and AI',
          'Mental health AI systems',
          'Pandemic response systems',
          'Emerging healthcare AI applications',
          'Future regulatory developments',
        ],
        caseStudies: ['Emerging Healthcare AI Technologies'],
      },
    ],
    practicalLabs: [
      {
        title: 'Diagnostic AI Bias Testing',
        description: 'Assess bias in diagnostic AI system across patient populations',
        duration: 10,
        objectives: [
          'Analyze diagnostic performance',
          'Test for demographic bias',
          'Evaluate clinical validity',
          'Document findings',
        ],
        tools: ['Python', 'Medical Data Analysis', 'Statistical Tools', 'Bias Testing'],
        deliverable: 'Diagnostic bias assessment report',
      },
      {
        title: 'Clinical Validation Assessment',
        description: 'Assess clinical validation of healthcare AI system',
        duration: 8,
        objectives: [
          'Review validation procedures',
          'Assess clinical evidence',
          'Evaluate performance metrics',
          'Identify validation gaps',
        ],
        tools: ['Clinical Validation Framework', 'Evidence Assessment Tools', 'Documentation Templates'],
        deliverable: 'Clinical validation assessment report',
      },
    ],
    assessmentType: 'combined',
    passScore: 75,
    certificateTitle: 'CEASAI Healthcare AI Specialist',
  },

  {
    id: 'ceasai-spec-law-enforcement',
    title: 'Law Enforcement and Justice Specialist',
    description: 'Advanced expertise in assessing AI systems in law enforcement and criminal justice including predictive policing, facial recognition, and risk assessment',
    category: 'Law Enforcement',
    durationHours: 50,
    prerequisites: ['CEASAI Professional Tier'],
    learningOutcomes: [
      'Understand AI applications in law enforcement',
      'Assess predictive policing systems',
      'Evaluate facial recognition in law enforcement',
      'Assess risk assessment and recidivism prediction systems',
      'Conduct criminal justice regulation compliance analysis',
      'Develop law enforcement AI governance policies',
    ],
    modules: [
      {
        title: 'AI in Law Enforcement and Justice',
        duration: 6,
        topics: [
          'Predictive policing systems',
          'Facial recognition in law enforcement',
          'Risk assessment and recidivism prediction',
          'Evidence evaluation systems',
          'Suspect identification systems',
          'Surveillance and monitoring systems',
        ],
        caseStudies: ['Predictive Policing Bias', 'COMPAS Recidivism Algorithm', 'Facial Recognition Errors'],
      },
      {
        title: 'Predictive Policing and Bias',
        duration: 8,
        topics: [
          'Predictive policing methodologies',
          'Historical bias in crime data',
          'Feedback loops and bias amplification',
          'Fairness assessment',
          'Community impact analysis',
          'Transparency and accountability',
        ],
        caseStudies: ['Predictive Policing Case Studies', 'Bias in Crime Data'],
      },
      {
        title: 'Risk Assessment in Criminal Justice',
        duration: 8,
        topics: [
          'Risk assessment methodologies',
          'Recidivism prediction',
          'Fairness and discrimination',
          'Transparency and explainability',
          'Human oversight and discretion',
          'Appeal and remediation procedures',
        ],
        caseStudies: ['COMPAS Algorithm', 'Risk Assessment Bias', 'Recidivism Prediction'],
      },
      {
        title: 'Criminal Justice Regulation and Rights',
        duration: 8,
        topics: [
          'Constitutional requirements',
          'Due process rights',
          'Right to counsel',
          'Right to explanation',
          'Right to appeal',
          'Transparency requirements',
          'GDPR and criminal justice data',
        ],
        caseStudies: ['Constitutional Violations', 'Due Process Cases'],
      },
      {
        title: 'Law Enforcement AI Governance',
        duration: 8,
        topics: [
          'Governance frameworks for law enforcement AI',
          'Oversight and accountability mechanisms',
          'Community engagement',
          'Transparency and public reporting',
          'Incident response procedures',
          'Continuous improvement',
        ],
        caseStudies: ['Law Enforcement AI Governance Case Studies'],
      },
      {
        title: 'Advanced Topics and Emerging Issues',
        duration: 6,
        topics: [
          'Autonomous systems in law enforcement',
          'Facial recognition regulation',
          'Surveillance and privacy',
          'Human rights concerns',
          'Future regulatory developments',
        ],
        caseStudies: ['Emerging Law Enforcement AI Issues'],
      },
    ],
    practicalLabs: [
      {
        title: 'Predictive Policing Bias Assessment',
        description: 'Assess bias in predictive policing system',
        duration: 10,
        objectives: [
          'Analyze predictive policing algorithm',
          'Test for demographic bias',
          'Assess fairness metrics',
          'Evaluate community impact',
        ],
        tools: ['Python', 'Crime Data Analysis', 'Statistical Tools', 'Bias Testing'],
        deliverable: 'Predictive policing bias assessment report',
      },
      {
        title: 'Risk Assessment Fairness Evaluation',
        description: 'Evaluate fairness of risk assessment system',
        duration: 8,
        objectives: [
          'Analyze risk assessment algorithm',
          'Test for demographic disparities',
          'Evaluate fairness definitions',
          'Assess transparency',
        ],
        tools: ['Risk Assessment Framework', 'Fairness Evaluation Tools', 'Statistical Analysis'],
        deliverable: 'Risk assessment fairness evaluation report',
      },
    ],
    assessmentType: 'combined',
    passScore: 75,
    certificateTitle: 'CEASAI Law Enforcement Specialist',
  },

  {
    id: 'ceasai-spec-governance',
    title: 'AI Governance and Policy Specialist',
    description: 'Advanced expertise in AI governance frameworks, policy development, and strategic leadership in AI safety and compliance',
    category: 'Governance',
    durationHours: 60,
    prerequisites: ['CEASAI Advanced Tier'],
    learningOutcomes: [
      'Develop comprehensive AI governance frameworks',
      'Lead AI policy development and implementation',
      'Engage with regulators and stakeholders',
      'Develop organizational AI strategies',
      'Lead organizational transformation for AI governance',
      'Influence regulatory and policy development',
    ],
    modules: [
      {
        title: 'AI Governance Frameworks and Models',
        duration: 8,
        topics: [
          'Governance framework design',
          'Organizational structures for AI governance',
          'Roles and responsibilities',
          'Decision-making procedures',
          'Oversight and accountability',
          'Risk management integration',
        ],
        caseStudies: ['AI Governance Case Studies'],
      },
      {
        title: 'Policy Development and Implementation',
        duration: 8,
        topics: [
          'Policy development processes',
          'Stakeholder engagement',
          'Policy implementation strategies',
          'Change management',
          'Training and awareness',
          'Monitoring and evaluation',
        ],
        caseStudies: ['Policy Development Case Studies'],
      },
      {
        title: 'Regulatory Engagement and Compliance',
        duration: 8,
        topics: [
          'Regulatory landscape',
          'Regulatory engagement strategies',
          'Compliance management',
          'Regulatory reporting',
          'Regulatory relationships',
          'Advocacy and influence',
        ],
        caseStudies: ['Regulatory Engagement Case Studies'],
      },
      {
        title: 'International AI Governance',
        duration: 8,
        topics: [
          'International AI governance frameworks',
          'OECD AI Principles',
          'UN AI governance initiatives',
          'Regional regulatory differences',
          'Standards harmonization',
          'Global coordination',
        ],
        caseStudies: ['International AI Governance Case Studies'],
      },
      {
        title: 'Organizational AI Strategy',
        duration: 8,
        topics: [
          'Strategic planning for AI',
          'AI capability development',
          'Organizational transformation',
          'Leadership and culture',
          'Stakeholder engagement',
          'Continuous improvement',
        ],
        caseStudies: ['Organizational AI Strategy Case Studies'],
      },
      {
        title: 'Advanced Topics and Leadership',
        duration: 8,
        topics: [
          'Thought leadership in AI governance',
          'Industry influence and advocacy',
          'Emerging governance challenges',
          'Future of AI regulation',
          'Ethical leadership',
          'Vision and strategy development',
        ],
        caseStudies: ['AI Governance Leadership Case Studies'],
      },
      {
        title: 'Capstone: AI Governance Strategy Development',
        duration: 12,
        topics: [
          'Comprehensive AI governance strategy development',
          'Organizational assessment',
          'Strategy formulation',
          'Implementation planning',
          'Stakeholder engagement',
          'Change management',
        ],
        caseStudies: ['Capstone Project Case Studies'],
      },
    ],
    practicalLabs: [
      {
        title: 'AI Governance Framework Development',
        description: 'Develop comprehensive AI governance framework for organization',
        duration: 12,
        objectives: [
          'Assess organizational needs',
          'Design governance structure',
          'Develop governance policies',
          'Create implementation plan',
        ],
        tools: ['Governance Framework Templates', 'Policy Development Tools', 'Strategic Planning Tools'],
        deliverable: 'Comprehensive AI governance framework document',
      },
      {
        title: 'Capstone Project: AI Governance Strategy',
        description: 'Develop complete AI governance strategy for organization',
        duration: 20,
        objectives: [
          'Assess organizational AI maturity',
          'Develop strategic vision',
          'Design governance structures',
          'Create implementation roadmap',
          'Develop stakeholder engagement plan',
        ],
        tools: ['Strategic Planning Tools', 'Governance Frameworks', 'Change Management Tools'],
        deliverable: 'Complete AI governance strategy document with implementation roadmap',
      },
    ],
    assessmentType: 'project',
    passScore: 75,
    certificateTitle: 'CEASAI AI Governance and Policy Specialist',
  },

  {
    id: 'ceasai-spec-technical',
    title: 'Technical Assessment Specialist',
    description: 'Advanced technical expertise in AI system assessment including architecture, model evaluation, and testing methodologies',
    category: 'Technical Assessment',
    durationHours: 50,
    prerequisites: ['CEASAI Professional Tier + Technical Background'],
    learningOutcomes: [
      'Understand AI system architecture and design',
      'Assess machine learning models and performance',
      'Conduct data quality and bias testing',
      'Perform cybersecurity and robustness testing',
      'Apply advanced testing methodologies',
      'Develop technical assessment procedures',
    ],
    modules: [
      {
        title: 'AI System Architecture and Design',
        duration: 8,
        topics: [
          'AI system architecture patterns',
          'Machine learning pipeline design',
          'Data engineering and management',
          'Model training and optimization',
          'Deployment and serving',
          'Monitoring and observability',
        ],
        caseStudies: ['Architecture Case Studies'],
      },
      {
        title: 'Machine Learning Model Assessment',
        duration: 8,
        topics: [
          'Model evaluation metrics',
          'Performance assessment',
          'Generalization and overfitting',
          'Model interpretability and explainability',
          'Uncertainty quantification',
          'Model robustness',
        ],
        caseStudies: ['Model Assessment Case Studies'],
      },
      {
        title: 'Data Quality and Bias Testing',
        duration: 8,
        topics: [
          'Data quality assessment',
          'Data bias identification',
          'Bias testing methodologies',
          'Fairness metrics and evaluation',
          'Demographic parity analysis',
          'Mitigation strategies',
        ],
        caseStudies: ['Data Bias Case Studies'],
      },
      {
        title: 'Cybersecurity and Robustness Testing',
        duration: 8,
        topics: [
          'Adversarial attacks and robustness',
          'Model poisoning and backdoor attacks',
          'Cybersecurity assessment',
          'Vulnerability identification',
          'Penetration testing',
          'Mitigation strategies',
        ],
        caseStudies: ['Cybersecurity Case Studies'],
      },
      {
        title: 'Advanced Testing Methodologies',
        duration: 8,
        topics: [
          'Stress testing and load testing',
          'Regression testing',
          'Scenario-based testing',
          'Edge case identification',
          'Failure mode analysis',
          'Test automation',
        ],
        caseStudies: ['Testing Methodology Case Studies'],
      },
      {
        title: 'Technical Assessment Procedures',
        duration: 6,
        topics: [
          'Assessment planning and scoping',
          'Technical documentation review',
          'Testing procedure development',
          'Results analysis and reporting',
          'Remediation recommendations',
          'Continuous monitoring',
        ],
        caseStudies: ['Assessment Procedure Case Studies'],
      },
    ],
    practicalLabs: [
      {
        title: 'Machine Learning Model Assessment Lab',
        description: 'Conduct comprehensive assessment of machine learning model',
        duration: 10,
        objectives: [
          'Evaluate model performance',
          'Test for bias and fairness',
          'Assess robustness',
          'Document findings',
        ],
        tools: ['Python', 'scikit-learn', 'TensorFlow', 'Fairness Libraries', 'Statistical Tools'],
        deliverable: 'Machine learning model assessment report',
      },
      {
        title: 'Data Quality and Bias Testing Lab',
        description: 'Conduct data quality assessment and bias testing',
        duration: 8,
        objectives: [
          'Assess data quality',
          'Test for data bias',
          'Evaluate fairness metrics',
          'Develop mitigation strategies',
        ],
        tools: ['Python', 'Data Analysis Tools', 'Bias Testing Libraries', 'Statistical Analysis'],
        deliverable: 'Data quality and bias testing report',
      },
      {
        title: 'Cybersecurity and Robustness Testing Lab',
        description: 'Test AI system for cybersecurity vulnerabilities and robustness',
        duration: 8,
        objectives: [
          'Identify cybersecurity vulnerabilities',
          'Test adversarial robustness',
          'Assess attack surface',
          'Develop security recommendations',
        ],
        tools: ['Python', 'Adversarial Testing Tools', 'Security Testing Tools', 'Penetration Testing Tools'],
        deliverable: 'Cybersecurity and robustness testing report',
      },
    ],
    assessmentType: 'combined',
    passScore: 75,
    certificateTitle: 'CEASAI Technical Assessment Specialist',
  },
];

/**
 * Get specialization track by ID
 */
export function getSpecializationTrack(trackId: string): SpecializationTrack | undefined {
  return ceasaiSpecializationTracks.find(t => t.id === trackId);
}

/**
 * Get all specialization tracks
 */
export function getAllSpecializationTracks(): SpecializationTrack[] {
  return ceasaiSpecializationTracks;
}

/**
 * Get specialization tracks by category
 */
export function getSpecializationTracksByCategory(category: string): SpecializationTrack[] {
  return ceasaiSpecializationTracks.filter(t => t.category === category);
}

/**
 * Get total hours for all specialization tracks
 */
export function getTotalSpecializationHours(): number {
  return ceasaiSpecializationTracks.reduce((total, track) => total + track.durationHours, 0);
}
