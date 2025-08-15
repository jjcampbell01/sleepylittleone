import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';

type PillarScores = {
  pressure: number;
  settling: number;
  nutrition: number;
  environment: number;
  consistency: number;
};

type TonightPlan = {
  wakeTime: string;
  napSchedule?: { startTime: string; endTime?: string }[];
  bedTimeWindow: { earliest: string; latest?: string };
  routineSteps: string[];
  keyTips: string[];
};

type RoadmapWeek = { focus: string; tasks: string[] };

type Props = {
  score: number;
  babyName: string;
  ageMonths: number;
  ageWeeks: number;
  scores: PillarScores;
  tonightPlan: TonightPlan;
  roadmap: RoadmapWeek[];
  formData: any;
};

function encodePayload<T>(obj: T): string {
  try {
    // base64-encode a URI-safe JSON (no extra deps)
    const json = JSON.stringify(obj);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error('encode error', e);
    return '';
  }
}

export const ShareCard: React.FC<Props> = ({
  score,
  babyName,
  ageMonths,
  ageWeeks,
  scores,
  tonightPlan,
  roadmap,
  formData,
}) => {
  // Construct a share payload that the SharedPlan page can render directly
  const payload = {
    meta: { v: 1 },
    babyName,
    ageMonths,
    ageWeeks,
    scores: {
      overall: score,
      sleepPressure: scores?.pressure ?? 0,
      settling: scores?.settling ?? 0,
      nutrition: scores?.nutrition ?? 0,
      environment: scores?.environment ?? 0,
      consistency: scores?.consistency ?? 0,
    },
    tonightPlan: {
      wakeUpTime: tonightPlan?.wakeTime || '',
      napTimes: Array.isArray(tonightPlan?.napSchedule)
        ? tonightPlan.napSchedule.map(n => n?.startTime || '').filter(Boolean)
        : [],
      bedtime: tonightPlan?.bedTimeWindow?.earliest || '',
      routineSteps: Array.isArray(tonightPlan?.routineSteps) ? tonightPlan.routineSteps : [],
      keyTips: Array.isArray(tonightPlan?.keyTips) ? tonightPlan.keyTips : [],
    },
    roadmap: Array.isArray(roadmap)
      ? roadmap.map((w, i) => ({
          week: i + 1,
          focus: w?.focus || '',
          tasks: Array.isArray(w?.tasks) ? w.tasks : [],
        }))
      : [],
    formData: formData || {},
  };

  const data = encodePayload(payload);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const shareUrl = `${origin}/plan?data=${data}`;

  const copyLinkOnly = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Baby's Sleep Plan", url: shareUrl });
      } catch {
        // ignored
      }
    } else {
      copyLinkOnly();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share your plan</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-3">
        <Button onClick={copyLinkOnly} className="flex items-center gap-2">
          <Copy className="h-4 w-4" />
          Copy link
        </Button>
        <Button variant="outline" onClick={shareNative} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShareCard;
