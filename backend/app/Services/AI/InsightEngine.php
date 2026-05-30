<?php

namespace App\Services\AI;

use App\Models\User;
use App\Models\Ad;
use App\Models\Insight;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class InsightEngine
{
    /**
     * Run the analysis globally for all users with ad accounts.
     */
    public function runAnalysis()
    {
        $users = User::whereHas('adAccounts')->get();
        // Typically compare yesterday to the day before yesterday
        $date = Carbon::yesterday()->toDateString();
        $prevDate = Carbon::yesterday()->subDay()->toDateString();

        foreach ($users as $user) {
            $this->analyzeUser($user, $date, $prevDate);
        }
    }

    /**
     * Analyze performance drops for a specific user's ads.
     */
    public function analyzeUser(User $user, $date, $prevDate)
    {
        // Fetch all ads belonging to this user with metrics for the specific comparison dates
        $ads = Ad::whereHas('adSet.campaign.adAccount', function($q) use ($user) {
            $q->where('user_id', $user->id);
        })->with(['dailyMetrics' => function($q) use ($date, $prevDate) {
            $q->whereIn('date', [$date, $prevDate]);
        }])->get();

        foreach ($ads as $ad) {
            $metricsT1 = $ad->dailyMetrics->firstWhere('date', $prevDate);
            $metricsT0 = $ad->dailyMetrics->firstWhere('date', $date);

            if (!$metricsT1 || !$metricsT0) {
                continue; // Not enough data to compare
            }

            $this->evaluateRules($user, $ad, $metricsT0, $metricsT1, $date);
        }
    }

    /**
     * Apply heuristics and rules to determine ad performance changes.
     */
    protected function evaluateRules(User $user, Ad $ad, $t0, $t1, $date)
    {
        $ctrChange = $t1->ctr > 0 ? ($t0->ctr - $t1->ctr) / $t1->ctr : 0;
        $cpcChange = $t1->cpc > 0 ? ($t0->cpc - $t1->cpc) / $t1->cpc : 0;
        
        $spendChange = $t1->spend > 0 ? ($t0->spend - $t1->spend) / $t1->spend : 0;
        $clicksChange = $t1->clicks > 0 ? ($t0->clicks - $t1->clicks) / $t1->clicks : 0;

        // 1. Ad Fatigue Detected (Frequency > 4 + CTR drop)
        if ($t0->frequency > 4 && $ctrChange < 0) {
            $this->createInsight($user, $date, [
                'title' => 'Ad fatigue detected',
                'description' => "Ad '{$ad->name}' reached a high frequency ({$t0->frequency}), causing its CTR to drop.",
                'severity' => 'high',
                'root_cause' => 'Audience is saturated and seeing the exact same ad too many times.',
                'recommendation' => 'Refresh creatives or expand the ad set audience immediately.'
            ]);
        }
        // 2. Possible Creative Fatigue (CTR drop > 20% standalone)
        elseif ($ctrChange < -0.20) {
            $this->createInsight($user, $date, [
                'title' => 'Possible creative fatigue',
                'description' => "Ad '{$ad->name}' saw a significant CTR drop of " . round(abs($ctrChange)*100, 1) . "% yesterday.",
                'severity' => 'medium',
                'root_cause' => 'The ad creatives are losing their initial appeal or the audience is losing interest.',
                'recommendation' => 'Test new primary texts, headlines, or switch out visual creatives to regain engagement.'
            ]);
        }

        // 3. Audience Competition Increased (CPC increase > 20%)
        if ($cpcChange > 0.20) {
            $this->createInsight($user, $date, [
                'title' => 'Audience competition increased',
                'description' => "Cost Per Click for Ad '{$ad->name}' increased sharply by " . round($cpcChange*100, 1) . "%.",
                'severity' => 'medium',
                'root_cause' => 'Auction competition jumped within your targeted audience, driving up cost.',
                'recommendation' => 'Monitor ROAS closely. Consider testing less saturated lookalike audiences or interests.'
            ]);
        }

        // 4. Landing Page Issue Likely (Spend stable ±5% + proxy conversions [clicks] down > 15%)
        if (abs($spendChange) <= 0.05 && $clicksChange < -0.15) {
            $this->createInsight($user, $date, [
                'title' => 'Landing page issue likely',
                'description' => "Spend for Ad '{$ad->name}' remained stable, but traffic leading to downstream conversions dropped by " . round(abs($clicksChange)*100, 1) . "%.",
                'severity' => 'high',
                'root_cause' => 'Inefficient spend preventing funnel progress. Possible disruption in post-click experience.',
                'recommendation' => 'Verify landing page uptime, load speed, and tracking pixel setup.'
            ]);
        }
    }

    /**
     * Store the insight avoiding exact duplicates.
     */
    protected function createInsight(User $user, $date, array $data)
    {
        Insight::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => $date,
                'title' => $data['title'],
                'description' => $data['description'],
            ],
            [
                'severity' => $data['severity'],
                'root_cause' => $data['root_cause'],
                'recommendation' => $data['recommendation'],
            ]
        );
    }
}
