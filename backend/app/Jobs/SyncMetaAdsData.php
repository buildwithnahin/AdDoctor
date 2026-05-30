<?php

namespace App\Jobs;

use App\Models\AdAccount;
use App\Models\Campaign;
use App\Models\AdSet;
use App\Models\Ad;
use App\Models\DailyMetric;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncMetaAdsData implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $apiVersion;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        $this->apiVersion = env('META_API_VERSION', 'v19.0');
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info("SyncMetaAdsData: Started daily sync process.");

        // Loop chunks for efficient memory
        AdAccount::where('platform', 'meta')->where('status', 'ACTIVE')->chunkById(100, function ($accounts) {
            foreach ($accounts as $account) {
                try {
                    $this->syncAccount($account);
                } catch (\Exception $e) {
                    Log::error("SyncMetaAdsData Error for account {$account->id}: " . $e->getMessage());
                }
            }
        });

        Log::info("SyncMetaAdsData: Completed daily sync process.");
    }

    protected function syncAccount(AdAccount $account)
    {
        $accessToken = $account->user->meta_access_token;
        if (!$accessToken) {
            Log::warning("SyncMetaAdsData: No access token for User {$account->user_id}. Skipping Account {$account->id}");
            return;
        }

        Log::info("SyncMetaAdsData: Syncing Account {$account->id} ({$account->name})");

        // 1. Fetch & Store Campaigns
        $campaignsData = $this->fetchFromMeta($account->platform_account_id, 'campaigns', [
            'fields' => 'id,name,status,objective',
        ], $accessToken);

        foreach ($campaignsData as $campData) {
            $campaign = Campaign::updateOrCreate(
                ['ad_account_id' => $account->id, 'platform_campaign_id' => $campData['id']],
                [
                    'name' => $campData['name'],
                    'status' => $campData['status'] ?? 'ACTIVE',
                    'objective' => $campData['objective'] ?? null,
                ]
            );

            // 2. Fetch & Store AdSets
            $adsetsData = $this->fetchFromMeta($campData['id'], 'adsets', [
                'fields' => 'id,name,status,daily_budget',
            ], $accessToken);

            foreach ($adsetsData as $adsetData) {
                $adset = AdSet::updateOrCreate(
                    ['campaign_id' => $campaign->id, 'platform_adset_id' => $adsetData['id']],
                    [
                        'name' => $adsetData['name'],
                        'status' => $adsetData['status'] ?? 'ACTIVE',
                        'daily_budget' => isset($adsetData['daily_budget']) ? ($adsetData['daily_budget'] / 100) : null,
                    ]
                );

                // 3. Fetch & Store Ads
                $adsData = $this->fetchFromMeta($adsetData['id'], 'ads', [
                    'fields' => 'id,name,status,creative{image_url}',
                ], $accessToken);

                foreach ($adsData as $adData) {
                    $ad = Ad::updateOrCreate(
                        ['ad_set_id' => $adset->id, 'platform_ad_id' => $adData['id']],
                        [
                            'name' => $adData['name'],
                            'status' => $adData['status'] ?? 'ACTIVE',
                            'creative_url' => $adData['creative']['image_url'] ?? null,
                        ]
                    );

                    // 4. Fetch Insights (Daily Metrics) for Yesterday
                    $this->syncAdInsights($ad, $accessToken);
                }
            }
        }
    }

    protected function syncAdInsights(Ad $ad, $accessToken)
    {
        // Sync data for the last completed day (yesterday)
        $datePreset = 'yesterday';
        
        $insightsData = $this->fetchFromMeta($ad->platform_ad_id, 'insights', [
            'fields' => 'impressions,clicks,spend,ctr,cpc,cpm,frequency,date_start',
            'date_preset' => $datePreset,
            'time_increment' => 1 // Daily breakdown
        ], $accessToken);

        foreach ($insightsData as $insight) {
            DailyMetric::updateOrCreate(
                [
                    'ad_id' => $ad->id,
                    'date' => Carbon::parse($insight['date_start'])->toDateString()
                ],
                [
                    'impressions' => $insight['impressions'] ?? 0,
                    'clicks' => $insight['clicks'] ?? 0,
                    'spend' => $insight['spend'] ?? 0.00,
                    'ctr' => $insight['ctr'] ?? 0.00,
                    'cpc' => $insight['cpc'] ?? 0.00,
                    'cpm' => $insight['cpm'] ?? 0.00,
                    'frequency' => $insight['frequency'] ?? 0.00,
                ]
            );
        }
    }

    protected function fetchFromMeta($nodeId, $endpoint, $params, $accessToken)
    {
        $params['access_token'] = $accessToken;
        
        $response = Http::get("https://graph.facebook.com/{$this->apiVersion}/{$nodeId}/{$endpoint}", $params);

        if ($response->successful()) {
            return $response->json('data') ?? [];
        }

        Log::error("Meta API Error for Node {$nodeId} / {$endpoint}: " . $response->body());
        return [];
    }
}
