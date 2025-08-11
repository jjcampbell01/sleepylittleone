import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, MessageCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareCardProps {
  score: number;
  babyName?: string;
}

export function ShareCard({ score, babyName }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  
  const shareText = `I just got ${babyName ? `${babyName}'s` : 'my baby\'s'} Sleep Readiness Index: ${score}/100! 🌙✨ 

Get your free personalized sleep plan at [your-domain]/sleep-planner

#BabySleep #SleepTraining #ParentLife`;

  const shareUrl = window.location.origin + '/sleep-planner';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText + '\n\n' + shareUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareOnSocial = (platform: string) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=Check out my baby's sleep plan&body=${encodedText}%0A%0A${encodedUrl}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Share2 className="h-4 w-4" />
          Share Your Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-3 bg-secondary/30 rounded-lg text-sm">
          {shareText.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            Copy
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareOnSocial('whatsapp')}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareOnSocial('email')}
            className="flex items-center gap-2"
          >
            <Mail className="h-3 w-3" />
            Email
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => shareOnSocial('facebook')}
            className="flex items-center gap-2"
          >
            <Share2 className="h-3 w-3" />
            Facebook
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}