import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, MessageCircle, Mail, Link, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareCardProps {
  score: number;
  babyName?: string;
  ageMonths: number;
  ageWeeks?: number;
  scores: any;
  tonightPlan: any;
  roadmap: any;
  formData: any;
}

export function ShareCard({ 
  score, 
  babyName, 
  ageMonths, 
  ageWeeks, 
  scores, 
  tonightPlan, 
  roadmap, 
  formData 
}: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showBabyName, setShowBabyName] = useState(false);
  const [consentAnalytics, setConsentAnalytics] = useState(false);
  
  const shareText = shareUrl 
    ? `I just got ${babyName ? `${babyName}'s` : 'my baby\'s'} Sleep Readiness Index: ${score}/100! 🌙✨ 

Check out the personalized sleep plan: ${shareUrl}

#BabySleep #SleepTraining #ParentLife`
    : `I just got ${babyName ? `${babyName}'s` : 'my baby\'s'} Sleep Readiness Index: ${score}/100! 🌙✨ 

Get your free personalized sleep plan at ${window.location.origin}/sleep-planner

#BabySleep #SleepTraining #ParentLife`;

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const sanitizeInputData = (data: any) => {
    // Remove personal information for public sharing
    const { email, parentName, ...sanitized } = data;
    return sanitized;
  };

  const createShareableLink = async () => {
    setIsCreating(true);
    try {
      const slug = generateSlug();
      const sanitizedInput = sanitizeInputData(formData);
      
      const derivedData = {
        scores,
        tonightPlan,
        roadmap
      };

      const { error } = await supabase
        .from('public_sleep_plans')
        .insert({
          slug,
          age_months: ageMonths,
          age_weeks: ageWeeks,
          input_data: sanitizedInput,
          derived_data: derivedData,
          baby_name_public: showBabyName ? babyName : null,
          consent_analytics: consentAnalytics
        });

      if (error) {
        console.error('Error creating shareable plan:', error);
        toast.error('Failed to create shareable link');
        return;
      }

      const newShareUrl = `${window.location.origin}/plan/${slug}`;
      setShareUrl(newShareUrl);
      
      // Track creation if analytics consent given
      if (consentAnalytics) {
        await supabase
          .from('sleep_plan_analytics')
          .insert({
            plan_slug: slug,
            event_type: 'share_link_created',
            user_agent: navigator.userAgent,
            referrer: document.referrer
          });
      }

      toast.success('Shareable link created!');
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to create shareable link');
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = shareUrl 
        ? shareText 
        : shareText + '\n\n' + window.location.origin + '/sleep-planner';
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareOnSocial = async (platform: string) => {
    // Track share if analytics consent and shareUrl exists
    if (shareUrl && consentAnalytics) {
      const slug = shareUrl.split('/plan/')[1];
      await supabase
        .from('sleep_plan_analytics')
        .insert({
          plan_slug: slug,
          event_type: `share_${platform}`,
          user_agent: navigator.userAgent,
          referrer: document.referrer
        });
    }

    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl || window.location.origin + '/sleep-planner');
    
    // Try Web Share API first (mobile)
    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: `${babyName ? `${babyName}'s` : 'Baby'} Sleep Plan`,
          text: shareText,
          url: shareUrl || window.location.origin + '/sleep-planner'
        });
        return;
      } catch (err) {
        // Fallback to social sharing
      }
    }
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}`,
      email: `mailto:?subject=Check out ${babyName ? `${babyName}'s` : 'this baby\'s'} sleep plan&body=${encodedText}`
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
      <CardContent className="space-y-4">
        {!shareUrl ? (
          <div className="space-y-4">
            <div className="p-3 bg-secondary/30 rounded-lg text-sm">
              <p className="font-medium mb-2">Create a shareable link to:</p>
              <ul className="space-y-1 text-xs">
                <li>• Send to partners, family, or caregivers</li>
                <li>• Keep track of views and engagement</li>
                <li>• Share on social media</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-name" 
                  checked={showBabyName}
                  onCheckedChange={(checked) => setShowBabyName(checked === true)}
                />
                <label htmlFor="show-name" className="text-sm">
                  Show {babyName ? babyName + "'s" : "baby's"} name on public page
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="consent-analytics" 
                  checked={consentAnalytics}
                  onCheckedChange={(checked) => setConsentAnalytics(checked === true)}
                />
                <label htmlFor="consent-analytics" className="text-sm">
                  Allow anonymous analytics to improve our service
                </label>
              </div>
            </div>
            
            <Button 
              onClick={createShareableLink}
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Link...
                </>
              ) : (
                <>
                  <Link className="h-4 w-4 mr-2" />
                  Create Shareable Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                ✅ Shareable link created!
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Anyone with this link can view the sleep plan
              </p>
            </div>
            
            <div className="p-3 bg-secondary/30 rounded-lg text-sm break-all">
              {shareUrl}
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                Copy Link
              </Button>
              
              {navigator.share && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareOnSocial('native')}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-3 w-3" />
                  Share
                </Button>
              )}
              
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}