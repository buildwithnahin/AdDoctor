<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InsightController extends Controller
{
    public function index(Request $request)
    {
        // For testing/demonstration: Return non-tech friendly LLM style insights directly
        $insights = [
            [
                'id' => 1,
                'severity' => 'high',
                'title' => 'People are scrolling past your ad without clicking',
                'description' => 'Your ad reached 5,000 people today, but only 12 clicked on it. This is much lower than normal.',
                'root_cause' => 'The image or video you used isn\'t catching attention, or the headline doesn\'t clearly explain what you are selling.',
                'recommendation' => 'Action required: Pause this ad. Try creating a new ad with a brighter, more eye-catching image. Make sure your text clearly says "50% Off" or what you are offering in the first line.'
            ],
            [
                'id' => 2,
                'severity' => 'medium',
                'title' => 'You are spending money, but the clicks are getting expensive',
                'description' => 'Each click on your website link is now costing you $2.50, which is double compared to last week.',
                'root_cause' => 'You are showing the ad to the same small group of people too many times, and they are tired of seeing it.',
                'recommendation' => 'Action required: Edit your ad settings. Change the "Audience" targeting to reach new people, or increase the age range/location to find fresh customers.'
            ],
            [
                'id' => 3,
                'severity' => 'low',
                'title' => 'Good job! Your new checkout campaign is working well',
                'description' => 'People who clicked on your ad yesterday bought 3 items. Your cost per sale is very healthy.',
                'root_cause' => 'The latest video ad effectively showed how the product works in real life.',
                'recommendation' => 'Action required: Don\'t change anything right now. Let this ad keep running to get more steady sales.'
            ]
        ];

        // Dummy performance summary
        $summary = [
            'ctr_change' => 'Low Interest', 
            'cpc_change' => 'Too Expensive',
            'spend_summary' => '$140.50'
        ];

        return response()->json([
            'insights' => $insights,
            'summary' => $summary
        ]);
    }
}
