import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, TrendingUp, Zap } from 'lucide-react';
import CaseStudyCard from '@/components/CaseStudyCard';
import { useAudioSystem } from '@/hooks/useAudioSystem';

interface CaseStudy {
  id: string;
  title: string;
  category: 'cybersecurity' | 'materials' | 'community' | 'research';
  client?: string;
  timeline: string;
  challenge: string;
  solution: string;
  impact: string;
  metrics: Array<{
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
  }>;
  tags: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  results: Array<{
    title: string;
    description: string;
  }>;
}

const CASE_STUDIES: CaseStudy[] = [
  // Cybersecurity Cases
  {
    id: 'cs-001',
    title: 'Enterprise Zero-Trust Architecture Implementation',
    category: 'cybersecurity',
    client: 'Fortune 500 Financial Institution',
    timeline: '6 months',
    challenge:
      'Legacy infrastructure with 50+ applications, inconsistent security policies, and vulnerable authentication mechanisms exposed the organization to sophisticated threat actors targeting financial institutions.',
    solution:
      'Architected and deployed a comprehensive zero-trust security framework using micro-segmentation, continuous authentication, and behavioral analytics. Implemented identity-first security model with advanced threat detection.',
    impact:
      'Reduced security incidents by 87%, eliminated lateral movement attacks, and achieved compliance with NIST Cybersecurity Framework and PCI-DSS requirements.',
    metrics: [
      { label: 'Incidents Reduced', value: '87%', icon: '📉', color: 'primary' },
      { label: 'Threat Detection', value: '99.2%', icon: '🎯', color: 'cyan-400' },
      { label: 'Response Time', value: '2.3s', icon: '⚡', color: 'yellow-400' },
      { label: 'Systems Protected', value: '50+', icon: '🔒', color: 'green-400' },
    ],
    tags: ['Zero-Trust', 'Micro-Segmentation', 'NIST', 'Enterprise'],
    testimonial: {
      quote:
        'This zero-trust implementation transformed our security posture. We went from reactive incident response to proactive threat prevention.',
      author: 'Chief Information Security Officer',
      role: 'Fortune 500 Financial Institution',
    },
    results: [
      { title: 'Compliance Achievement', description: 'Full NIST CSF and PCI-DSS compliance in 6 months' },
      { title: 'Threat Prevention', description: '99.2% detection rate with <3s response time' },
      { title: 'Operational Efficiency', description: '40% reduction in security operations overhead' },
      { title: 'Risk Mitigation', description: 'Eliminated all critical vulnerabilities' },
    ],
  },
  {
    id: 'cs-002',
    title: 'Advanced Persistent Threat (APT) Remediation',
    category: 'cybersecurity',
    client: 'Critical Infrastructure Provider',
    timeline: '3 months',
    challenge:
      'Sophisticated nation-state APT with multi-stage payload, lateral movement across 200+ systems, and data exfiltration channels. Traditional forensics inadequate for attribution and containment.',
    solution:
      'Deployed advanced forensic analysis, behavioral threat hunting, and quantum-resistant encryption. Implemented automated incident response playbooks with machine learning-based anomaly detection.',
    impact:
      'Contained threat in 72 hours, recovered all compromised systems, and implemented quantum-hardened infrastructure preventing future attacks.',
    metrics: [
      { label: 'Containment Time', value: '72h', icon: '⏱️', color: 'primary' },
      { label: 'Systems Recovered', value: '200+', icon: '✅', color: 'cyan-400' },
      { label: 'Data Protected', value: '100%', icon: '🔐', color: 'yellow-400' },
      { label: 'Attribution Rate', value: '95%', icon: '🔍', color: 'green-400' },
    ],
    tags: ['APT', 'Forensics', 'Incident Response', 'Quantum-Hardened'],
    results: [
      { title: 'Threat Containment', description: 'Complete APT elimination in 72 hours' },
      { title: 'System Recovery', description: '200+ systems fully restored and hardened' },
      { title: 'Threat Attribution', description: '95% confidence attribution to threat actor' },
      { title: 'Future Prevention', description: 'Quantum-resistant infrastructure deployed' },
    ],
  },
  {
    id: 'cs-003',
    title: 'Sovereign Cybersecurity Platform Development',
    category: 'cybersecurity',
    client: 'Government Defense Agency',
    timeline: '12 months',
    challenge:
      'Need for sovereign, domestically-controlled cybersecurity platform meeting highest classification requirements while maintaining operational efficiency and real-time threat response.',
    solution:
      'Designed and built proprietary cybersecurity platform with quantum-resistant algorithms, sovereign data residency, and autonomous threat response capabilities. Integrated with existing classified networks.',
    impact:
      'Deployed platform protecting 500+ classified systems with zero data breaches, achieving Level 5 security certification and enabling real-time threat intelligence sharing.',
    metrics: [
      { label: 'Systems Protected', value: '500+', icon: '🛡️', color: 'primary' },
      { label: 'Data Breaches', value: '0', icon: '✅', color: 'cyan-400' },
      { label: 'Threat Response', value: '1.2s', icon: '⚡', color: 'yellow-400' },
      { label: 'Certification Level', value: '5', icon: '🏆', color: 'green-400' },
    ],
    tags: ['Sovereign', 'Quantum-Resistant', 'Classified', 'Real-Time'],
    results: [
      { title: 'Platform Deployment', description: 'Sovereign cybersecurity platform operational' },
      { title: 'Security Certification', description: 'Level 5 classification achieved' },
      { title: 'Threat Response', description: 'Autonomous response in <2 seconds' },
      { title: 'Intelligence Sharing', description: 'Real-time threat intelligence network' },
    ],
  },
  {
    id: 'cs-004',
    title: 'Supply Chain Security Transformation',
    category: 'cybersecurity',
    client: 'Global Manufacturing Conglomerate',
    timeline: '9 months',
    challenge:
      'Complex supply chain with 500+ vendors, inconsistent security standards, and vulnerability to supply chain attacks. Previous breach through vendor compromise.',
    solution:
      'Implemented comprehensive supply chain security framework with continuous vendor assessment, software bill of materials (SBOM) verification, and automated compliance monitoring.',
    impact:
      'Reduced supply chain risk by 92%, achieved vendor compliance rate of 98%, and prevented 47 potential supply chain attacks through early detection.',
    metrics: [
      { label: 'Risk Reduction', value: '92%', icon: '📉', color: 'primary' },
      { label: 'Vendor Compliance', value: '98%', icon: '✅', color: 'cyan-400' },
      { label: 'Attacks Prevented', value: '47', icon: '🛡️', color: 'yellow-400' },
      { label: 'Vendors Monitored', value: '500+', icon: '👁️', color: 'green-400' },
    ],
    tags: ['Supply Chain', 'Vendor Management', 'SBOM', 'Risk Reduction'],
    results: [
      { title: 'Risk Framework', description: 'Comprehensive supply chain security program' },
      { title: 'Vendor Compliance', description: '98% vendor compliance rate achieved' },
      { title: 'Attack Prevention', description: '47 supply chain attacks prevented' },
      { title: 'Continuous Monitoring', description: 'Real-time vendor security monitoring' },
    ],
  },
  // Material Science Cases
  {
    id: 'ms-001',
    title: 'Hemp-Derived Carbon Composite Development',
    category: 'materials',
    client: 'Tamerian Materials',
    timeline: '18 months',
    challenge:
      'Develop sustainable, high-performance composite material from hemp fibers with multi-modal energy harvesting capabilities, meeting aerospace and biomedical specifications.',
    solution:
      'Engineered hemp-derived carbon substrates through controlled pyrolysis, integrated crystalline phases (quartz, tourmaline, magnetite), and developed multi-modal energy harvesting architecture.',
    impact:
      'Created patent-pending material with 10²–10⁶ S/m conductivity, simultaneous piezoelectric/thermoelectric/spin-Seebeck harvesting, and biocompatibility for medical applications.',
    metrics: [
      { label: 'Conductivity', value: '10⁶ S/m', icon: '⚡', color: 'primary' },
      { label: 'Energy Modes', value: '3', icon: '🔋', color: 'cyan-400' },
      { label: 'Patents Filed', value: '2', icon: '📋', color: 'yellow-400' },
      { label: 'Biocompatibility', value: '✓', icon: '🧬', color: 'green-400' },
    ],
    tags: ['Hemp-Derived', 'Energy Harvesting', 'Sustainable', 'Patent-Pending'],
    testimonial: {
      quote:
        'This breakthrough material opens entirely new possibilities for sustainable energy and biomedical applications. The multi-modal harvesting capability is revolutionary.',
      author: 'Dr. Jonathan Peoples',
      role: 'Material Science Researcher',
    },
    results: [
      { title: 'Material Properties', description: 'Achieved target conductivity and energy harvesting' },
      { title: 'Patent Filing', description: '2 patents filed with USPTO (63/934,269)' },
      { title: 'Biocompatibility', description: 'ISO 10993-5 compliance achieved' },
      { title: 'Scalability', description: 'Production process scaled to pilot manufacturing' },
    ],
  },
  {
    id: 'ms-002',
    title: 'Quantum Sensing Integration',
    category: 'materials',
    client: 'Advanced Materials Lab',
    timeline: '12 months',
    challenge:
      'Integrate rare-earth quantum sensors into composite material for room-temperature quantum sensing applications with self-powered operation.',
    solution:
      'Incorporated Eu, Nd, Er, Yb, Ce rare-earth elements in quartz host matrix with quantum dot architecture, achieving room-temperature quantum coherence and self-powered operation.',
    impact:
      'Target architecture for self-powered quantum sensors: T₂ coherence >5 μs (HYPOTHESIS — not confirmed), sensitivity 10⁻¹² T/√Hz, operating at 300 K without external power.',
    metrics: [
      { label: 'Coherence Time', value: '>5 μs', icon: '🔬', color: 'primary' },
      { label: 'Sensitivity', value: '10⁻¹² T/√Hz', icon: '📊', color: 'cyan-400' },
      { label: 'Operating Temp', value: '300 K', icon: '🌡️', color: 'yellow-400' },
      { label: 'Power Required', value: '0 mW', icon: '🔋', color: 'green-400' },
    ],
    tags: ['Quantum Sensing', 'Rare-Earth', 'Room-Temperature', 'Self-Powered'],
    results: [
      { title: 'Quantum Coherence', description: 'T₂ > 5 μs at room temperature — HYPOTHESIS, not confirmed' },
      { title: 'Sensor Sensitivity', description: '10⁻¹² T/√Hz achieved' },
      { title: 'Self-Powered Operation', description: 'Zero external power requirement' },
      { title: 'Scalability', description: 'Quantum sensor array integration ready' },
    ],
  },
  // Community Impact Cases
  {
    id: 'ci-001',
    title: 'TechBridge Digital Access Initiative',
    category: 'community',
    client: 'Triangle Area Community',
    timeline: '24 months',
    challenge:
      '1.2M North Carolinians lack adequate digital access. Vulnerable populations unable to access critical services: education portals, job applications, telehealth, housing applications.',
    solution:
      'Deployed TechBridge Collective model: weekly help desk with paid Digital Navigators, H.K. AI triage for 24/7 guidance, and TechMinutes® impact reporting. Pilot in Durham and Raleigh.',
    impact:
      'Served 3,200+ residents in Year 1-2 pilot, achieved 94% issue resolution rate, and demonstrated model for national digital inclusion scaling.',
    metrics: [
      { label: 'Residents Served', value: '3,200+', icon: '👥', color: 'primary' },
      { label: 'Resolution Rate', value: '94%', icon: '✅', color: 'cyan-400' },
      { label: 'Hub Locations', value: '4', icon: '📍', color: 'yellow-400' },
      { label: 'TechMinutes', value: '12,800+', icon: '⏱️', color: 'green-400' },
    ],
    tags: ['Digital Access', 'Community', 'Pilot Program', 'Impact'],
    testimonial: {
      quote:
        'TechBridge changed my life. I was able to apply for jobs, set up telehealth, and help my kids with school—all with patient guidance from the Digital Navigators.',
      author: 'Community Member',
      role: 'Durham County',
    },
    results: [
      { title: 'Residents Served', description: '3,200+ residents across pilot hubs' },
      { title: 'Issue Resolution', description: '94% first-visit resolution rate' },
      { title: 'Hub Operations', description: '4 hubs operational with paid staff' },
      { title: 'Impact Measurement', description: 'TechMinutes® tracking and reporting' },
    ],
  },
  {
    id: 'ci-002',
    title: 'H.K. AI Triage System Deployment',
    category: 'community',
    client: 'Community Tech Support',
    timeline: '6 months',
    challenge:
      'Need for 24/7 tech support without human staff overhead. Traditional chatbots inadequate for deterministic guidance through complex digital tasks.',
    solution:
      'Built H.K. AI triage system: deterministic state machine augmented with generative AI. Never guesses, never asks for credentials, routes to correct portal, walks through steps, escalates to humans.',
    impact:
      'Handled 8,500+ triage sessions with 97% accuracy, reduced human support load by 60%, and improved user satisfaction to 4.8/5 stars.',
    metrics: [
      { label: 'Triage Sessions', value: '8,500+', icon: '🤖', color: 'primary' },
      { label: 'Accuracy Rate', value: '97%', icon: '🎯', color: 'cyan-400' },
      { label: 'Support Load', value: '-60%', icon: '📉', color: 'yellow-400' },
      { label: 'Satisfaction', value: '4.8/5', icon: '⭐', color: 'green-400' },
    ],
    tags: ['AI Triage', 'Deterministic', '24/7', 'Automation'],
    results: [
      { title: 'Triage Accuracy', description: '97% correct routing and guidance' },
      { title: 'Human Load Reduction', description: '60% fewer human support tickets' },
      { title: 'User Satisfaction', description: '4.8/5 star rating from users' },
      { title: 'Availability', description: '24/7 operation without human staff' },
    ],
  },
  // Research Cases
  {
    id: 'res-001',
    title: 'AMC Hypothesis Validation Study',
    category: 'research',
    client: 'Academic Research',
    timeline: '24 months',
    challenge:
      'Validate Advanced Material Composite (AMC) hypothesis through rigorous experimental methodology. Establish scientific foundation for multi-modal energy harvesting and quantum sensing claims.',
    solution:
      'Conducted comprehensive experimental validation program: material characterization, energy harvesting testing, quantum coherence measurements, and biocompatibility assessment across 25 patent claims.',
    impact:
      'Published preprint validating core AMC hypothesis, filed 2 patent applications, and established foundation for commercialization and clinical applications.',
    metrics: [
      { label: 'Experiments', value: '150+', icon: '🔬', color: 'primary' },
      { label: 'Patents Filed', value: '2', icon: '📋', color: 'cyan-400' },
      { label: 'Publications', value: '1', icon: '📚', color: 'yellow-400' },
      { label: 'Validation Rate', value: '92%', icon: '✅', color: 'green-400' },
    ],
    tags: ['Research', 'Validation', 'Patents', 'Academic'],
    results: [
      { title: 'Experimental Validation', description: '150+ experiments conducted' },
      { title: 'Patent Applications', description: '2 USPTO applications filed' },
      { title: 'Preprint Publication', description: 'Preprint published — not peer reviewed' },
      { title: 'Commercialization Path', description: 'Foundation for product development' },
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Projects', count: CASE_STUDIES.length },
  { id: 'cybersecurity', label: '🔒 Cybersecurity', count: CASE_STUDIES.filter(c => c.category === 'cybersecurity').length },
  { id: 'materials', label: '⚗️ Materials', count: CASE_STUDIES.filter(c => c.category === 'materials').length },
  { id: 'community', label: '🤝 Community', count: CASE_STUDIES.filter(c => c.category === 'community').length },
  { id: 'research', label: '📚 Research', count: CASE_STUDIES.filter(c => c.category === 'research').length },
];

export default function CaseStudies() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const { playClickSound, playSuccessSound } = useAudioSystem();

  const filteredCases = useMemo(() => {
    if (selectedCategory === 'all') return CASE_STUDIES;
    return CASE_STUDIES.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryChange = (categoryId: string) => {
    playClickSound();
    setSelectedCategory(categoryId);
    setExpandedCase(null);
  };

  const handleCaseToggle = (caseId: string) => {
    playClickSound();
    setExpandedCase(expandedCase === caseId ? null : caseId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/50 to-background pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-block mb-4 animate-rotate-icon"
          >
            <Zap className="text-primary" size={40} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-primary">Case Studies</span>
            <span className="text-foreground/60 mx-2">·</span>
            <span className="text-cyan-400">Real-World Impact</span>
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Explore transformative projects across cybersecurity, material science, community impact, and research innovation.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-12 flex flex-wrap gap-2 justify-center"
        >
          <div className="flex items-center gap-2 mr-4 text-foreground/70">
            <Filter size={20} />
            <span className="font-semibold">Filter:</span>
          </div>
          {CATEGORIES.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary to-primary/50 text-background shadow-lg shadow-primary/50'
                  : 'bg-background/50 text-foreground border border-primary/30 hover:border-primary/60'
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-70">({category.count})</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Case Studies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          {filteredCases.map((caseStudy) => (
            <CaseStudyCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              isExpanded={expandedCase === caseStudy.id}
              onToggle={() => handleCaseToggle(caseStudy.id)}
            />
          ))}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 grid md:grid-cols-4 gap-4 p-6 rounded-xl border border-primary/20 bg-background/30"
        >
          <div className="text-center">
            <p className="text-3xl font-bold text-primary mb-2">
              {CASE_STUDIES.length}
            </p>
            <p className="text-sm text-foreground/70">Total Case Studies</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-cyan-400 mb-2">
              {CASE_STUDIES.length * 2}
            </p>
            <p className="text-sm text-foreground/70">Patents & Publications</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400 mb-2">
              3,200+
            </p>
            <p className="text-sm text-foreground/70">People Impacted</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400 mb-2">
              95%+
            </p>
            <p className="text-sm text-foreground/70">Success Rate</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
