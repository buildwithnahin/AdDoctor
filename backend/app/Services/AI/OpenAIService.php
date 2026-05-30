<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    /**
     * Enhance rule-based insights with human-friendly OpenAI explanations.
     */
    public function enhanceInsight(array $technicalData): array
    {
        $apiKey = env('OPENAI_API_KEY');
        
        if (empty($apiKey)) {
            // Fallback to strict rule-based strings if no API key is provided
            return $technicalData;
        }

        $prompt = "You are an expert Meta Ads media buyer. I have a technical rule-based diagnosis for an ad performance issue. " .
                  "Please rewrite the 'description', 'root_cause', and 'recommendation' to be highly human-friendly, " .
                  "simple, and actionable for a business owner without losing the core metric context.\n\n" .
                  "Technical Data:\n" .
                  "- Title: {$technicalData['title']}\n" .
                  "- Description: {$technicalData['description']}\n" .
                  "- Root Cause: {$technicalData['root_cause']}\n" .
                  "- Recommendation: {$technicalData['recommendation']}\n\n" .
                  "Respond strictly in valid JSON format with three exact string keys: 'description', 'root_cause', 'recommendation'.";

        try {
            $response = Http::withToken($apiKey)
                ->timeout(15)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-4o-mini',
                    'response_format' => ['type' => 'json_object'],
                    'messages' => [
                        [
                            'role' => 'system', 
                            'content' => 'You are a helpful expert marketing AI designed to output JSON.'
                        ],
                        [
                            'role' => 'user', 
                            'content' => $prompt
                        ]
                    ],
                    'temperature' => 0.6,
                ]);

            if ($response->successful()) {
                $aiContent = json_decode($response->json('choices.0.message.content'), true);
                
                // Merge AI text if API succeeded perfectly
                if (isset($aiContent['description'], $aiContent['root_cause'], $aiContent['recommendation'])) {
                    $technicalData['description'] = $aiContent['description'];
                    $technicalData['root_cause'] = $aiContent['root_cause'];
                    $technicalData['recommendation'] = $aiContent['recommendation'];
                }
            } else {
                Log::error("OpenAI Enhancement error: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("OpenAIService Exception: " . $e->getMessage());
        }

        return $technicalData;
    }
}
