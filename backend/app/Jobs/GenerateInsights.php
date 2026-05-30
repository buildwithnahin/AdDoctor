<?php

namespace App\Jobs;

use App\Services\AI\InsightEngine;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateInsights implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Execute the job.
     */
    public function handle(InsightEngine $engine): void
    {
        Log::info("GenerateInsights: Starting Insight Engine analysis...");
        
        try {
            $engine->runAnalysis();
            Log::info("GenerateInsights: Analysis completed and insights stored.");
        } catch (\Exception $e) {
            Log::error("GenerateInsights Error: " . $e->getMessage());
        }
    }
}
