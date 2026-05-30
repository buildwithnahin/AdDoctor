<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ad_set_id')->constrained()->cascadeOnDelete();
            
            $table->string('name');
            $table->string('platform_ad_id')->index();
            $table->string('status')->default('ACTIVE');
            $table->text('creative_url')->nullable(); // Good for AI analysis referencing visuals
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['ad_set_id', 'platform_ad_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ads');
    }
};
