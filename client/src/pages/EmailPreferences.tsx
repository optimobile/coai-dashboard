import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Bell, Settings, Newspaper } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function EmailPreferences() {
  const [preferences, setPreferences] = useState({
    optIn: true,
    marketingEmails: true,
    productUpdates: true,
    weeklyDigest: true,
  });

  const { data: userPrefs, isLoading } = trpc.emailOnboarding.getUserPreferences.useQuery();
  const updateMutation = trpc.emailOnboarding.updateEmailPreferences.useMutation();

  useEffect(() => {
    if (userPrefs) {
      setPreferences({
        optIn: Boolean(userPrefs.optIn),
        marketingEmails: Boolean(userPrefs.marketingEmails),
        productUpdates: Boolean(userPrefs.productUpdates),
        weeklyDigest: Boolean(userPrefs.weeklyDigest),
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Preferences</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your email communication settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Opt-In */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-green-500" />
              <div>
                <CardTitle>Email Communications</CardTitle>
                <CardDescription>Receive all email communications from CSOAI</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={preferences.optIn}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('optIn', checked)
                }
              />
              <span className="text-sm text-gray-600">
                {preferences.optIn ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Marketing Emails */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <CardTitle>Marketing Emails</CardTitle>
                <CardDescription>Receive promotional content and special offers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={preferences.marketingEmails}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('marketingEmails', checked)
                }
              />
              <span className="text-sm text-gray-600">
                {preferences.marketingEmails ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Product Updates */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-purple-500" />
              <div>
                <CardTitle>Product Updates</CardTitle>
                <CardDescription>Stay informed about new features and improvements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={preferences.productUpdates}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('productUpdates', checked)
                }
              />
              <span className="text-sm text-gray-600">
                {preferences.productUpdates ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Digest */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Newspaper className="h-5 w-5 text-orange-500" />
              <div>
                <CardTitle>Weekly Digest</CardTitle>
                <CardDescription>Get a weekly summary of AI safety news and updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={preferences.weeklyDigest}
                onCheckedChange={(checked) =>
                  handlePreferenceChange('weeklyDigest', checked)
                }
              />
              <span className="text-sm text-gray-600">
                {preferences.weeklyDigest ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
}
