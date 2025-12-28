/**
 * Webhooks Management Page
 * Manage webhook subscriptions for rule updates and compliance events
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Copy, Trash2, TestTube, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WebhooksPage() {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const eventOptions = [
    { id: 'rule.created', label: 'Rule Created' },
    { id: 'rule.updated', label: 'Rule Updated' },
    { id: 'rule.deleted', label: 'Rule Deleted' },
    { id: 'framework.updated', label: 'Framework Updated' },
    { id: 'jurisdiction.updated', label: 'Jurisdiction Updated' },
    { id: 'compliance.requirement.changed', label: 'Compliance Requirement Changed' },
  ];

  // Fetch webhooks
  const { data: webhooks, refetch: refetchWebhooks } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      return await trpc.webhooks.getSubscriptions.query({});
    },
  });

  // Create webhook mutation
  const createWebhookMutation = useMutation({
    mutationFn: async () => {
      if (!webhookUrl || selectedEvents.length === 0) {
        throw new Error('Please enter a URL and select at least one event');
      }

      return await trpc.webhooks.createSubscription.mutate({
        url: webhookUrl,
        events: selectedEvents as any,
      });
    },
    onSuccess: (data) => {
      toast({
        title: 'Webhook Created',
        description: `Webhook subscription created successfully. Secret: ${data.secret}`,
      });
      setWebhookUrl('');
      setSelectedEvents([]);
      refetchWebhooks();
    },
  });

  // Update webhook mutation
  const updateWebhookMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return await trpc.webhooks.updateSubscription.mutate({
        subscriptionId,
        url: webhookUrl,
        events: selectedEvents as any,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Webhook Updated',
        description: 'Webhook subscription updated successfully',
      });
      setWebhookUrl('');
      setSelectedEvents([]);
      setEditingId(null);
      refetchWebhooks();
    },
  });

  // Delete webhook mutation
  const deleteWebhookMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return await trpc.webhooks.deleteSubscription.mutate({
        subscriptionId,
      });
    },
    onSuccess: () => {
      toast({
        title: 'Webhook Deleted',
        description: 'Webhook subscription deleted successfully',
      });
      refetchWebhooks();
    },
  });

  // Test webhook mutation
  const testWebhookMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      return await trpc.webhooks.testWebhook.mutate({
        subscriptionId,
      });
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? 'Test Successful' : 'Test Failed',
        description: data.message,
        variant: data.success ? 'default' : 'destructive',
      });
    },
  });

  // Fetch delivery history
  const { data: deliveryHistory } = useQuery({
    queryKey: ['webhookDelivery'],
    queryFn: async () => {
      if (!webhooks?.subscriptions[0]) return null;
      return await trpc.webhooks.getDeliveryHistory.query({
        subscriptionId: webhooks.subscriptions[0].id,
        limit: 10,
      });
    },
  });

  const handleToggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    );
  };

  const handleEdit = (webhook: any) => {
    setEditingId(webhook.id);
    setWebhookUrl(webhook.url);
    setSelectedEvents(webhook.events);
  };

  const handleCancel = () => {
    setEditingId(null);
    setWebhookUrl('');
    setSelectedEvents([]);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Webhooks</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage webhook subscriptions for real-time compliance updates
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="subscriptions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="delivery">Delivery History</TabsTrigger>
        </TabsList>

        {/* Subscriptions Tab */}
        <TabsContent value="subscriptions" className="space-y-6">
          {/* Create/Edit Webhook Card */}
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Webhook' : 'Create New Webhook'}</CardTitle>
              <CardDescription>
                Subscribe to compliance events and receive real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Webhook URL */}
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://your-domain.com/webhooks/compliance"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  type="url"
                />
                <p className="text-sm text-muted-foreground">
                  Must be a valid HTTPS URL that can receive POST requests
                </p>
              </div>

              {/* Event Selection */}
              <div className="space-y-3">
                <Label>Events to Subscribe</Label>
                <div className="space-y-2">
                  {eventOptions.map((event) => (
                    <div key={event.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={event.id}
                        checked={selectedEvents.includes(event.id)}
                        onCheckedChange={() => handleToggleEvent(event.id)}
                      />
                      <label
                        htmlFor={event.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {event.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    editingId
                      ? updateWebhookMutation.mutate(editingId)
                      : createWebhookMutation.mutate()
                  }
                  disabled={
                    !webhookUrl ||
                    selectedEvents.length === 0 ||
                    createWebhookMutation.isPending ||
                    updateWebhookMutation.isPending
                  }
                  className="flex-1"
                >
                  {editingId ? 'Update Webhook' : 'Create Webhook'}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Webhooks List */}
          {webhooks?.subscriptions && webhooks.subscriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Webhooks ({webhooks.subscriptions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.subscriptions.map((webhook: any) => (
                    <div key={webhook.id} className="p-4 border rounded-lg space-y-3">
                      {/* Webhook URL */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-mono text-sm break-all">{webhook.url}</p>
                          <p className="text-xs text-muted-foreground">
                            Created: {new Date(webhook.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={webhook.isActive ? 'default' : 'secondary'}>
                          {webhook.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      {/* Events */}
                      <div className="flex flex-wrap gap-1">
                        {webhook.events.map((event: string) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>

                      {/* Last Triggered */}
                      {webhook.lastTriggeredAt && (
                        <p className="text-xs text-muted-foreground">
                          Last triggered: {new Date(webhook.lastTriggeredAt).toLocaleString()}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(webhook)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => testWebhookMutation.mutate(webhook.id)}
                          disabled={testWebhookMutation.isPending}
                        >
                          <TestTube className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(webhook.id);
                            toast({
                              title: 'Copied',
                              description: 'Webhook ID copied to clipboard',
                            });
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteWebhookMutation.mutate(webhook.id)}
                          disabled={deleteWebhookMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {!webhooks?.subscriptions || webhooks.subscriptions.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No webhooks configured yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create your first webhook above to start receiving compliance updates
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Delivery History Tab */}
        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>
                View webhook delivery attempts and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deliveryHistory?.deliveries && deliveryHistory.deliveries.length > 0 ? (
                <div className="space-y-3">
                  {deliveryHistory.deliveries.map((delivery: any) => (
                    <div key={delivery.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          {delivery.status === 'delivered' && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                          {delivery.status === 'failed' && (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          {delivery.status === 'retrying' && (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className="font-mono text-sm">{delivery.eventType}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(delivery.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge
                          variant={
                            delivery.status === 'delivered'
                              ? 'default'
                              : delivery.status === 'failed'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {delivery.status}
                        </Badge>
                        {delivery.httpStatus && (
                          <p className="text-xs text-muted-foreground">
                            HTTP {delivery.httpStatus}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No delivery history yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
