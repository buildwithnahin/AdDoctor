<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            
            $table->string('name');
            $table->string('platform')->default('meta'); // meta, google, etc.
            $table->string('platform_account_id')->index(); // ID from external API
            
            $table->string('timezone')->nullable();
            $table->string('currency', 3)->default('USD');
            $table->string('status')->default('ACTIVE'); // ACTIVE, DISABLED
            
            $table->timestamps();
            $table->softDeletes();
            
            // Scalability Index
            $table->unique(['platform', 'platform_account_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_accounts');
    }
};
