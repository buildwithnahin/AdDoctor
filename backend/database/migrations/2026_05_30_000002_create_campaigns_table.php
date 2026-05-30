<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_account_id')->constrained()->cascadeOnDelete();
            
            $table->string('name');
            $table->string('platform_campaign_id')->index();
            $table->string('objective')->nullable();
            $table->string('status')->default('ACTIVE'); // ACTIVE, PAUSED, DELETED
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['ad_account_id', 'platform_campaign_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
