<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Version 1 API Routes
Route::prefix('v1')->group(function () {
    
    // Public Auth Routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        // Meta Ads routes
        Route::get('/meta/auth-url', [App\Http\Controllers\Api\V1\MetaController::class, 'authUrl']);
        Route::post('/meta/callback', [App\Http\Controllers\Api\V1\MetaController::class, 'callback']);
        Route::get('/meta/accounts', [App\Http\Controllers\Api\V1\MetaController::class, 'accounts']);
        
        // Insights Dashboard
        Route::get('/insights', [App\Http\Controllers\Api\V1\InsightController::class, 'index']);
    });
});
