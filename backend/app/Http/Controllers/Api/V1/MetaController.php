<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AdAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MetaController extends Controller
{
    public function authUrl()
    {
        $appId = env('META_APP_ID');
        // using frontend callback URL
        $redirectUri = env('FRONTEND_URL', 'http://localhost:5173') . '/meta/callback';
        $apiVersion = env('META_API_VERSION', 'v19.0');

        $url = "https://www.facebook.com/{$apiVersion}/dialog/oauth?" . http_build_query([
            'client_id' => $appId,
            'redirect_uri' => $redirectUri,
            'scope' => 'ads_management,ads_read',
            'response_type' => 'code'
        ]);

        return response()->json(['url' => $url]);
    }

    public function callback(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $appId = env('META_APP_ID');
        $appSecret = env('META_APP_SECRET');
        $redirectUri = env('FRONTEND_URL', 'http://localhost:5173') . '/meta/callback';
        $apiVersion = env('META_API_VERSION', 'v19.0');

        // Exchange code for access token
        $response = Http::get("https://graph.facebook.com/{$apiVersion}/oauth/access_token", [
            'client_id' => $appId,
            'redirect_uri' => $redirectUri,
            'client_secret' => $appSecret,
            'code' => $request->code,
        ]);

        if (!$response->successful()) {
            return response()->json(['error' => 'Failed to obtain access token', 'details' => $response->json()], 400);
        }

        $accessToken = $response->json('access_token');
        
        $user = $request->user();
        $user->update(['meta_access_token' => $accessToken]);

        // Fetch user's ad accounts
        $accountsResponse = Http::get("https://graph.facebook.com/{$apiVersion}/me/adaccounts", [
            'access_token' => $accessToken,
            'fields' => 'name,account_id,id,timezone_name,currency,account_status'
        ]);

        if ($accountsResponse->successful()) {
            $accounts = $accountsResponse->json('data') ?? [];
            foreach ($accounts as $acc) {
                AdAccount::updateOrCreate(
                    ['platform' => 'meta', 'platform_account_id' => $acc['id']],
                    [
                        'user_id' => $user->id,
                        'name' => $acc['name'] ?? 'Unnamed Account',
                        'timezone' => $acc['timezone_name'] ?? 'UTC',
                        'currency' => $acc['currency'] ?? 'USD',
                        'status' => (isset($acc['account_status']) && $acc['account_status'] == 1) ? 'ACTIVE' : 'DISABLED',
                    ]
                );
            }
        }

        return response()->json(['message' => 'Meta account connected successfully']);
    }

    public function accounts(Request $request)
    {
        return response()->json(
            $request->user()->adAccounts()->where('platform', 'meta')->get()
        );
    }
}
