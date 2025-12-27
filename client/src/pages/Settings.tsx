/*
 * CSOAI Settings Page
 * User and organization settings
 */

import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Building, Bell, Shield, Key, Palette, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

const settingsSections = [
  {
    title: "Profile",
    description: "Manage your personal information",
    icon: User,
  },
  {
    title: "Organization",
    description: "Company and team settings",
    icon: Building,
  },
  {
    title: "Notifications",
    description: "Configure alert preferences",
    icon: Bell,
  },
  {
    title: "Security",
    description: "Password and authentication",
    icon: Shield,
  },
  {
    title: "API Keys",
    description: "Manage API access tokens",
    icon: Key,
  },
  {
    title: "Appearance",
    description: "Theme and display settings",
    icon: Palette,
  },
];

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold font-primary leading-relaxed">Settings</h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Settings Navigation */}
          <div className="space-y-2">
            {settingsSections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15, delay: idx * 0.03 }}
                >
                  <Button
                    variant={idx === 0 ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => toast.info(`${section.title} settings`, { description: "Feature coming soon" })}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="text-left">
                      <p className="font-medium leading-relaxed">{section.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{section.description}</p>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile Settings
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="Admin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="User" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@coai.example" />
                  </div>

                  {/* Organization */}
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" defaultValue="CSOAI Demo Corp" />
                  </div>

                  <Separator />

                  {/* Preferences */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Preferences</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium leading-relaxed">Email Notifications</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Receive email alerts for compliance updates
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium leading-relaxed">Council Vote Alerts</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Get notified when votes require attention
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium leading-relaxed">Watchdog Reports</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Alerts for new public incident reports
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <Separator />

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button onClick={() => toast.success("Settings saved")}>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
