import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Lock, Play, Award } from "lucide-react";
import { motion } from "framer-motion";

const WATCHDOG_MODULES = [
  {
    id: 1,
    title: "Incident Identification",
    description: "Learn to recognize AI safety incidents and potential risks",
    duration: "15 min",
    questions: 8,
    content: `
## What is an AI Safety Incident?

An AI safety incident occurs when an AI system behaves in unexpected or harmful ways. This includes:

- **Bias & Discrimination**: AI making unfair decisions based on protected characteristics
- **Privacy Violations**: Unauthorized data collection or exposure
- **Safety Failures**: AI systems causing physical or financial harm
- **Misinformation**: AI generating false or misleading information
- **Manipulation**: AI systems designed to deceive or manipulate users

## Common Examples

1. **Hiring AI**: Systematically rejecting qualified candidates from certain demographics
2. **Content Moderation**: Inconsistent enforcement of community guidelines
3. **Medical Diagnosis**: AI providing incorrect diagnoses for certain patient groups
4. **Autonomous Vehicles**: Safety system failures in edge cases
5. **Financial Systems**: Algorithmic trading causing market instability

## How to Identify Incidents

- Unexpected system behavior
- Disproportionate impact on certain groups
- Data leaks or privacy concerns
- System failures in critical situations
- User complaints about unfair treatment

## Your Role as a Watchdog

You help identify and report these incidents to improve AI safety globally.
    `,
    passingScore: 60
  },
  {
    id: 2,
    title: "Severity Assessment",
    description: "Understand how to evaluate the severity of AI safety issues",
    duration: "12 min",
    questions: 7,
    content: `
## Severity Levels

AI safety incidents are classified into four severity levels:

### CRITICAL (Red)
- Immediate risk to human safety
- Large-scale privacy breaches
- Systemic discrimination affecting millions
- Examples: Autonomous vehicle safety failures, mass data leaks

### HIGH (Orange)
- Significant harm to users or society
- Affects hundreds or thousands of people
- Regulatory violations
- Examples: Hiring discrimination, medical misdiagnosis patterns

### MEDIUM (Yellow)
- Potential for harm if not addressed
- Affects specific user groups
- Policy violations
- Examples: Biased content recommendations, inconsistent moderation

### LOW (Green)
- Minor issues with limited impact
- Affects small user groups
- Best practice violations
- Examples: UI inconsistencies, minor accuracy issues

## Assessment Criteria

1. **Scale**: How many people are affected?
2. **Impact**: What is the potential harm?
3. **Reversibility**: Can the damage be undone?
4. **Urgency**: How quickly must this be addressed?

## Practical Examples

- Facial recognition failing for certain ethnicities → HIGH
- Chatbot using outdated information → MEDIUM
- Recommendation system showing similar content → LOW
- Autonomous vehicle collision → CRITICAL
    `,
    passingScore: 60
  },
  {
    id: 3,
    title: "Evidence Collection",
    description: "Learn how to gather and document evidence for incident reports",
    duration: "10 min",
    questions: 6,
    content: `
## What Counts as Evidence?

Strong evidence helps regulators and researchers understand and fix AI safety issues:

### Digital Evidence
- Screenshots of problematic outputs
- System logs and error messages
- API responses and data
- Performance metrics showing disparities

### Contextual Information
- When the incident occurred (date/time)
- How many times it happened
- Which users or groups were affected
- What the expected behavior should have been

### Documentation
- Written descriptions of what happened
- User complaints or feedback
- Internal communications about the issue
- Historical data showing patterns

## How to Collect Evidence

1. **Capture the moment**: Take screenshots or recordings
2. **Document context**: Note when, where, and who
3. **Gather data**: Collect relevant logs or metrics
4. **Preserve authenticity**: Don't alter or manipulate evidence
5. **Organize clearly**: Make it easy for reviewers to understand

## What NOT to Include

- Personal information (names, emails, phone numbers)
- Proprietary business secrets
- Copyrighted content (unless fair use)
- Unverified claims or speculation

## Privacy Considerations

- Anonymize personal data
- Redact sensitive information
- Focus on the AI behavior, not the people
- Comply with GDPR and local privacy laws

## Example Report

**Incident**: Hiring AI rejects qualified female candidates
**Evidence**: 
- 50 screenshots of rejection reasons
- Statistical analysis showing 80% female rejection rate
- Comparison with male candidate acceptance rate (60%)
- Timeline showing when pattern started
    `,
    passingScore: 60
  },
  {
    id: 4,
    title: "Reporting Best Practices",
    description: "Master the art of submitting clear, actionable incident reports",
    duration: "13 min",
    questions: 7,
    content: `
## The Reporting Process

### Step 1: Choose the Right Platform
- Use the Watchdog Hub for AI safety incidents
- Select the appropriate category
- Determine severity level
- Decide on anonymity level

### Step 2: Write a Clear Title
Good titles are specific and descriptive:
- ✅ "Facial recognition system fails for dark skin tones"
- ❌ "AI is broken"
- ✅ "Hiring chatbot discriminates against non-English speakers"
- ❌ "Bad AI"

### Step 3: Provide Context
Include:
- What AI system was involved?
- What was it supposed to do?
- What actually happened?
- When did this occur?
- How many people were affected?

### Step 4: Attach Evidence
- Screenshots or recordings
- Data files or logs
- Performance metrics
- Comparison data

### Step 5: Suggest Solutions
- What should be fixed?
- How would you improve it?
- What's the ideal outcome?

## Report Quality Checklist

- [ ] Clear, descriptive title
- [ ] Specific incident description
- [ ] Relevant evidence attached
- [ ] Severity level indicated
- [ ] Impact clearly explained
- [ ] Timeline provided
- [ ] Affected groups identified
- [ ] Suggested improvements included

## Legal & Ethical Considerations

- Report in good faith
- Don't include personal data
- Respect privacy and confidentiality
- Follow responsible disclosure practices
- Comply with local laws

## What Happens After Reporting

1. **Initial Review**: Team checks for completeness
2. **Investigation**: Researchers analyze the incident
3. **Verification**: Attempt to reproduce the issue
4. **Response**: Company/regulator takes action
5. **Follow-up**: You receive updates on resolution

## Impact of Good Reporting

Your reports help:
- Identify systemic AI safety issues
- Improve AI systems globally
- Protect vulnerable populations
- Hold companies accountable
- Advance AI safety standards
    `,
    passingScore: 60
  }
];

type ModuleStatus = "locked" | "available" | "completed";

export default function WatchdogTraining() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const getModuleStatus = (moduleId: number): ModuleStatus => {
    if (completedModules.has(moduleId)) return "completed";
    if (moduleId === 1 || completedModules.has(moduleId - 1)) return "available";
    return "locked";
  };

  const handleCompleteModule = (moduleId: number) => {
    const newCompleted = new Set(completedModules);
    newCompleted.add(moduleId);
    setCompletedModules(newCompleted);
    setSelectedModule(null);
  };

  const handleSubmitQuiz = (moduleId: number) => {
    const module = WATCHDOG_MODULES.find(m => m.id === moduleId);
    if (!module) return;

    // Calculate score (mock - in real app, validate against correct answers)
    const correctAnswers = Math.ceil((module.questions * 70) / 100);
    const userCorrect = Object.keys(quizAnswers).length >= correctAnswers ? correctAnswers : Object.keys(quizAnswers).length;
    const score = Math.round((userCorrect / module.questions) * 100);

    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= module.passingScore) {
      setTimeout(() => {
        handleCompleteModule(moduleId);
        setShowQuiz(false);
        setQuizSubmitted(false);
        setQuizAnswers({});
      }, 2000);
    }
  };

  const allModulesCompleted = completedModules.size === WATCHDOG_MODULES.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-900">Watchdog Training</h1>
          </div>
          <p className="text-lg text-gray-600">
            Learn to identify and report AI safety incidents. Free training for all community members.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <Card className="mb-8 bg-white border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Your Progress</h3>
              <span className="text-sm font-medium text-emerald-600">
                {completedModules.size} of {WATCHDOG_MODULES.length} modules completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-emerald-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completedModules.size / WATCHDOG_MODULES.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        {!selectedModule ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {WATCHDOG_MODULES.map((module) => {
              const status = getModuleStatus(module.id);
              const isCompleted = completedModules.has(module.id);

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: module.id * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      status === "locked"
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-emerald-400"
                    } ${isCompleted ? "border-emerald-400 bg-emerald-50" : ""}`}
                    onClick={() => status !== "locked" && setSelectedModule(module.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl text-gray-900">
                            {module.title}
                          </CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                        {isCompleted && (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        )}
                        {status === "locked" && (
                          <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⏱️ {module.duration}</span>
                        <span>📝 {module.questions} questions</span>
                      </div>
                      {status !== "locked" && !isCompleted && (
                        <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
                          <Play className="w-4 h-4 mr-2" />
                          Start Module
                        </Button>
                      )}
                      {isCompleted && (
                        <Badge className="mt-4 bg-emerald-100 text-emerald-800">
                          ✓ Completed
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Module Content View */
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {WATCHDOG_MODULES.find(m => m.id === selectedModule)?.title}
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedModule(null);
                    setShowQuiz(false);
                    setQuizSubmitted(false);
                    setQuizAnswers({});
                  }}
                >
                  Back to Modules
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!showQuiz ? (
                <div>
                  <div className="prose prose-sm max-w-none mb-8">
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {WATCHDOG_MODULES.find(m => m.id === selectedModule)?.content}
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowQuiz(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 w-full"
                  >
                    Take Quiz
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-6">Module Quiz</h3>
                  {!quizSubmitted ? (
                    <div>
                      <div className="space-y-6 mb-8">
                        {Array.from({ length: WATCHDOG_MODULES.find(m => m.id === selectedModule)?.questions || 0 }).map((_, idx) => (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <p className="font-semibold mb-3">Question {idx + 1}</p>
                            <div className="space-y-2">
                              {["A", "B", "C", "D"].map((option) => (
                                <label key={option} className="flex items-center gap-3 cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`q${idx}`}
                                    value={option}
                                    onChange={(e) => setQuizAnswers({ ...quizAnswers, [idx]: option.charCodeAt(0) })}
                                    className="w-4 h-4"
                                  />
                                  <span>Option {option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => handleSubmitQuiz(selectedModule)}
                        className="bg-emerald-600 hover:bg-emerald-700 w-full"
                      >
                        Submit Quiz
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className={`text-4xl font-bold mb-4 ${quizScore >= 60 ? "text-emerald-600" : "text-orange-600"}`}>
                        {quizScore}%
                      </div>
                      <p className="text-lg mb-6">
                        {quizScore >= 60 ? "🎉 Congratulations! You passed!" : "Try again to pass this module"}
                      </p>
                      {quizScore >= 60 && (
                        <p className="text-sm text-gray-600">Redirecting to next module...</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Completion Certificate */}
        {allModulesCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-8 text-center text-white"
          >
            <Award className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Training Complete!</h2>
            <p className="text-lg mb-6">
              You've earned your Watchdog Training Certificate
            </p>
            <Button className="bg-white text-emerald-600 hover:bg-gray-100">
              Download Certificate
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
