import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Zap, Crown, Award, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface CertificationLevel {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  price: number;
  duration: string;
  examQuestions: number;
  passingScore: number;
  modules: string[];
  benefits: string[];
}

const CERTIFICATION_LEVELS: CertificationLevel[] = [
  {
    id: "fundamentals",
    name: "Fundamentals",
    title: "AI Governance Fundamentals",
    description: "Master the basics of AI safety, compliance, and governance",
    icon: <BookOpen className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
    price: 0,
    duration: "4 weeks",
    examQuestions: 50,
    passingScore: 70,
    modules: [
      "AI Safety Basics",
      "Regulatory Landscape",
      "Governance Frameworks",
      "Risk Assessment Fundamentals"
    ],
    benefits: [
      "Understand AI safety principles",
      "Learn regulatory requirements",
      "Basic compliance knowledge",
      "Digital certificate"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    title: "AI Compliance Professional",
    description: "Become an expert in AI compliance and assessment",
    icon: <Zap className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500",
    price: 199,
    duration: "8 weeks",
    examQuestions: 100,
    passingScore: 75,
    modules: [
      "Advanced Risk Management",
      "EU AI Act Deep Dive",
      "NIST RMF Implementation",
      "Compliance Assessment",
      "Documentation & Auditing",
      "Case Studies & Practice"
    ],
    benefits: [
      "Professional certification",
      "Advanced compliance expertise",
      "Assessment methodology",
      "Job-ready skills",
      "Verified badge on profile"
    ]
  },
  {
    id: "expert",
    name: "Expert",
    title: "AI Governance Expert",
    description: "Lead AI governance initiatives at enterprise scale",
    icon: <Crown className="w-8 h-8" />,
    color: "from-amber-500 to-orange-500",
    price: 499,
    duration: "12 weeks",
    examQuestions: 150,
    passingScore: 80,
    modules: [
      "Enterprise AI Strategy",
      "Multi-Framework Compliance",
      "Regulatory Sandbox Navigation",
      "AI Ethics & Governance",
      "Incident Response & Management",
      "Policy Development",
      "Advanced Analytics",
      "Leadership & Mentoring"
    ],
    benefits: [
      "Expert-level certification",
      "Enterprise consulting skills",
      "Policy development expertise",
      "Mentorship opportunities",
      "Industry recognition",
      "Exclusive community access"
    ]
  }
];

interface UserProgress {
  level: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  examAttempts: number;
  bestScore: number | null;
}

export default function CEASAICertification() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({
    fundamentals: { level: "fundamentals", status: "completed", progress: 100, examAttempts: 1, bestScore: 85 },
    professional: { level: "professional", status: "in_progress", progress: 60, examAttempts: 0, bestScore: null },
    expert: { level: "expert", status: "not_started", progress: 0, examAttempts: 0, bestScore: null }
  });
  const [showExamModal, setShowExamModal] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [examScore, setExamScore] = useState<number | null>(null);

  const handleStartExam = (levelId: string) => {
    setSelectedLevel(levelId);
    setShowExamModal(true);
  };

  const handleSubmitExam = (levelId: string) => {
    const score = Math.floor(Math.random() * 30) + 65;
    const level = CERTIFICATION_LEVELS.find(l => l.id === levelId);
    const passed = score >= (level?.passingScore || 70);

    setExamScore(score);

    if (passed) {
      setUserProgress(prev => ({
        ...prev,
        [levelId]: {
          ...prev[levelId],
          status: "completed",
          progress: 100,
          examAttempts: prev[levelId].examAttempts + 1,
          bestScore: Math.max(prev[levelId].bestScore || 0, score)
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-900">CEASAI Certification</h1>
          </div>
          <p className="text-lg text-gray-600">
            Become a certified AI governance professional. Three levels of expertise from fundamentals to enterprise leadership.
          </p>
        </motion.div>

        {/* Your Progress Summary */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CERTIFICATION_LEVELS.map(level => {
                const progress = userProgress[level.id];
                return (
                  <div key={level.id} className="text-center">
                    <p className="text-sm text-gray-600 mb-1">{level.name}</p>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {progress.status === "completed" ? "✓" : `${progress.progress}%`}
                    </div>
                    <Badge
                      className={
                        progress.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : progress.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {progress.status === "completed" ? "Certified" : progress.status === "in_progress" ? "In Progress" : "Not Started"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Certification Levels Grid */}
        {!selectedLevel ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {CERTIFICATION_LEVELS.map((level, idx) => {
              const progress = userProgress[level.id];
              const isLocked = idx > 0 && userProgress[CERTIFICATION_LEVELS[idx - 1].id].status !== "completed";

              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className={`relative overflow-hidden transition-all hover:shadow-lg ${
                      isLocked ? "opacity-50" : ""
                    }`}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5`} />

                    <CardHeader className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${level.color} text-white`}>
                          {level.icon}
                        </div>
                        {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                        {progress.status === "completed" && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <CardTitle className="text-2xl">{level.name}</CardTitle>
                      <CardDescription>{level.title}</CardDescription>
                    </CardHeader>

                    <CardContent className="relative space-y-4">
                      <p className="text-gray-700">{level.description}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-gray-600">Duration</p>
                          <p className="font-semibold text-gray-900">{level.duration}</p>
                        </div>
                        <div className="bg-gray-50 rounded p-2">
                          <p className="text-gray-600">Exam</p>
                          <p className="font-semibold text-gray-900">{level.examQuestions} Q</p>
                        </div>
                      </div>

                      {/* Modules */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Modules ({level.modules.length})</p>
                        <div className="space-y-1">
                          {level.modules.slice(0, 3).map((module, i) => (
                            <p key={i} className="text-xs text-gray-600">✓ {module}</p>
                          ))}
                          {level.modules.length > 3 && (
                            <p className="text-xs text-gray-500 italic">
                              +{level.modules.length - 3} more modules
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="border-t pt-4">
                        {level.price === 0 ? (
                          <p className="text-lg font-bold text-emerald-600 mb-3">Free</p>
                        ) : (
                          <p className="text-lg font-bold text-gray-900 mb-3">${level.price}</p>
                        )}

                        {isLocked ? (
                          <Button disabled className="w-full">
                            <Lock className="w-4 h-4 mr-2" />
                            Complete Previous Level
                          </Button>
                        ) : progress.status === "completed" ? (
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Certified
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleStartExam(level.id)}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            {progress.status === "in_progress" ? "Continue" : "Start"} Certification
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Exam View */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Button
              variant="outline"
              onClick={() => {
                setSelectedLevel(null);
                setShowExamModal(false);
                setExamStarted(false);
                setCurrentQuestion(0);
                setExamScore(null);
              }}
              className="mb-6"
            >
              ← Back
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {examScore === null ? (
                  <div className="space-y-6">
                    {!examStarted ? (
                      <div className="text-center py-8">
                        <h3 className="text-xl font-bold mb-4">Ready to take the exam?</h3>
                        <p className="text-gray-600 mb-6">
                          {CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.examQuestions} questions • {CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.passingScore}% to pass
                        </p>
                        <Button
                          onClick={() => setExamStarted(true)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Start Exam
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">
                              Question {currentQuestion + 1} of {CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.examQuestions}
                            </span>
                            <span className="text-gray-600">
                              {Math.round(((currentQuestion + 1) / (CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.examQuestions || 50)) * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              animate={{
                                width: `${((currentQuestion + 1) / (CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.examQuestions || 50)) * 100}%`
                              }}
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <p className="text-lg font-semibold text-gray-900 mb-4">
                            Sample Question {currentQuestion + 1}
                          </p>
                          <p className="text-gray-700 mb-4">
                            What is the primary goal of the EU AI Act?
                          </p>

                          <div className="space-y-3">
                            {["A", "B", "C", "D"].map(option => (
                              <label key={option} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-white">
                                <input type="radio" name="answer" className="w-4 h-4" />
                                <span>Option {option}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                            disabled={currentQuestion === 0}
                          >
                            Previous
                          </Button>
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                            {currentQuestion === (CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.examQuestions || 50) - 1
                              ? "Submit Exam"
                              : "Next"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className={`text-5xl font-bold mb-4 ${examScore >= (CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.passingScore || 70) ? "text-emerald-600" : "text-orange-600"}`}>
                      {examScore}%
                    </div>
                    <p className="text-lg mb-6">
                      {examScore >= (CERTIFICATION_LEVELS.find(l => l.id === selectedLevel)?.passingScore || 70)
                        ? "🎉 Congratulations! You passed!"
                        : "Try again to pass this certification"}
                    </p>
                    <Button
                      onClick={() => {
                        setSelectedLevel(null);
                        setShowExamModal(false);
                        setExamStarted(false);
                        setCurrentQuestion(0);
                        setExamScore(null);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Back to Certifications
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
