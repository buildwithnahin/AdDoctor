<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class InsightController extends Controller
{
    public function index(Request $request)
    {
        // Fetch user's insights
        $insights = $request->user()
            ->insights()
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate or mock performance summary for hackathon demo
        // In a real scenario, this would aggregate DailyMetric data across the user's accounts.
        $summary = [
            'ctr_change' => '-12.4%', // Dummy realistic data representing a drop
            'cpc_change' => '+15.2%',
            'spend_summary' => '$1,240.50'
        ];

        return response()->json([
            'insights' => $insights,
            'summary' => $summary
        ]);
    }
}
