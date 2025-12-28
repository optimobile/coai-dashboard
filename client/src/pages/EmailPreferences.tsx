import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Bell, Settings } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState({
    welcomeEmails: true,
    courseRecommendations: true,
    examPrepGuides: true,
    successStories: true,
    certificationUpdates: true,
    frequency: 'weekly' as 'daily' | 'weekly' | 'biweekly' | 'monthly',
  });

  const { data: userPrefs, isLoading } = trpc.emailOnboarding.getUserPreferences.useQuery();
  const updateMutation = trpc.emailOnboarding.updateEmailPreferences.useMutation();

  useEffect(() => {
    if (userPrefs) {
      setPreferences({
        welcomeEmails: userPrefs.welcomeEmails ?? true,
        courseRecommendations: userPrefs.courseRecommendations ?? true,
        examPrepGuides: userPrefs.examPrepGuides ?? true,
        successStories: userPrefs.successStories ?? true,
        certificationUpdates: userPrefs.certificationUpdates ?? true,
        frequency: userPrefs.frequency ?? 'weekly',
      });
    }
  }, [userPrefs]);

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(preferences);
      // Show success message
      console.log('Email preferences updated successfully');
    } catch (error) {
      console.error('Failed to update email preferences:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Email Preferences</h1>
          <p className="text-gray-600">Manage your email communication settings and notification frequency</p>
        </div>

        {/* Email Categories */}
        <div className="space-y-6">
          {/* Welcome Emails */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-green-500" />
                <div>
                  <CardTitle>Welcome Emails</CardTitle>
                  <CardDescription>Receive onboarding and welcome messages</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={preferences.welcomeEmails}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('welcomeEmails', checked)
                  }
                />
                <span className="text-sm text-gray-600">
                  {preferences.welcomeEmails ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Course Recommendations */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <CardTitle>Course Recommendations</CardTitle>
                  <CardDescription>Get personalized course suggestions based on your interests</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={preferences.courseRecommendations}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('courseRecommendations', checked)
                  }
                />
                <span className="text-sm text-gray-600">
                  {preferences.courseRecommendations ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Exam Prep Guides */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-purple-500" />
                <div>
                  <CardTitle>Exam Prep Guides</CardTitle>
                  <CardDescription>Receive study materials and exam preparation tips</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={preferences.examPrepGuides}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('examPrepGuides', checked)
                  }
                />
                <span className="text-sm text-gray-600">
                  {preferences.examPrepGuides ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Success Stories */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <div>
                  <CardTitle>Success Stories</CardTitle>
                  <CardDescription>Learn from certified analysts' experiences and achievements</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={preferences.successStories}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('successStories', checked)
                  }
                />
                <span className="text-sm text-gray-600">
                  {preferences.successStories ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Certification Updates */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-red-500" />
                <div>
                  <CardTitle>Certification Updates</CardTitle>
                  <CardDescription>Get notified about new certifications and program updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={preferences.certificationUpdates}
                  onCheckedChange={(checked) =>
                    handlePreferenceChange('certificationUpdates', checked)
                  }
                />
                <span className="text-sm text-gray-600">
                  {preferences.certificationUpdates ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Email Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>Email Frequency</CardTitle>
              <CardDescription>How often would you like to receive emails?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(['daily', 'weekly', 'biweekly', 'monthly'] as const).map((freq) => (
                  <div key={freq} className="flex items-center gap-3">
                    <input
                      type="radio"
                      id={freq}
                      name="frequency"
                      value={freq}
                      checked={preferences.frequency === freq}
                      onChange={(e) =>
                        handlePreferenceChange('frequency', e.target.value)
                      }
                      className="w-4 h-4 text-green-600"
                    />
                    <label htmlFor={freq} className="text-sm font-medium text-gray-700 capitalize">
                      {freq === 'daily' && 'Daily'}
                      {freq === 'weekly' && 'Weekly'}
                      {freq === 'biweekly' && 'Bi-weekly'}
                      {freq === 'monthly' && 'Monthly'}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
}
