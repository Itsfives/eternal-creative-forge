import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Send, X, AlertCircle, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CommunicationComposerProps {
  projects: Array<{ id: string; name: string }>;
  onSend: (messageData: {
    project_id?: string;
    subject?: string;
    message: string;
    message_type: 'general' | 'milestone' | 'feedback_request' | 'approval_needed';
    priority: 'low' | 'normal' | 'high' | 'urgent';
  }) => Promise<void>;
  loading?: boolean;
}

const CommunicationComposer: React.FC<CommunicationComposerProps> = ({
  projects,
  onSend,
  loading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    project_id: '',
    subject: '',
    message: '',
    message_type: 'general' as const,
    priority: 'normal' as const
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSend({
        project_id: formData.project_id || undefined,
        subject: formData.subject || undefined,
        message: formData.message,
        message_type: formData.message_type,
        priority: formData.priority
      });

      // Reset form and close modal
      setFormData({
        project_id: '',
        subject: '',
        message: '',
        message_type: 'general',
        priority: 'normal'
      });
      setIsOpen(false);

      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to Send",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageTypeOptions = [
    { value: 'general', label: 'General Communication' },
    { value: 'feedback_request', label: 'Feedback Request' },
    { value: 'approval_needed', label: 'Approval Needed' },
    { value: 'milestone', label: 'Milestone Update' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'normal', label: 'Normal', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-seagram-green hover:bg-seagram-green/90">
          <MessageCircle className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Message to Team</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project (Optional)</label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, project_id: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md">
                  <SelectItem value="">No specific project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message Type</label>
              <Select
                value={formData.message_type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, message_type: value }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-md">
                  {messageTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject (Optional)</label>
            <Input
              placeholder="Enter subject line..."
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              className="bg-background"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message *</label>
            <Textarea
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="min-h-[120px] bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: option.value as any }))}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    formData.priority === option.value
                      ? option.color + ' ring-2 ring-primary'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {(formData.priority as string) === 'urgent' && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Urgent Priority Selected</p>
                <p className="text-red-700">This message will be flagged for immediate attention.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading || !formData.message.trim()}
              className="bg-seagram-green hover:bg-seagram-green/90"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CommunicationComposer;