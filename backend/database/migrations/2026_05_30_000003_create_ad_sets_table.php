<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained()->cascadeOnDelete();
            
            $table->string('name');
            $table->string('platform_adset_id')->index();
            $table->decimal('daily_budget', 12, 2)->nullable();
            $table->string('status')->default('ACTIVE');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['campaign_id', 'platform_adset_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_sets');
    }
};
