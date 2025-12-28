import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, X, Send, CheckCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type FeedbackCategory = 'training' | 'ui' | 'features' | 'other';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>('features');
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  
  const submitFeedbackMutation = trpc.feedback.submit.useMutation();
  
  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    try {
      await submitFeedbackMutation.mutateAsync({
        category,
        feedback: feedback.trim(),
        email: email.trim() || undefined,
      });
      
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFeedback('');
        setEmail('');
        setCategory('features');
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    }
  };
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
        title="Send feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Send Feedback</CardTitle>
            <CardDescription>Help us improve CSOAI</CardDescription>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        </CardHeader>
        
        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mb-3" />
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                Thank you!
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your feedback helps us build a better platform.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Feedback Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="training">Training Modules</option>
                  <option value="ui">User Interface</option>
                  <option value="features">Features & Functionality</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              {/* Feedback Text */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Your Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  rows={4}
                />
              </div>
              
              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  We'll use this to follow up if needed
                </p>
              </div>
              
              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={submitFeedbackMutation.isPending}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                {submitFeedbackMutation.isPending ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Feedback
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
