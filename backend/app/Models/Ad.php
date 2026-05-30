<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ad extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ad_set_id',
        'name',
        'platform_ad_id',
        'status',
        'creative_url',
    ];

    public function adSet()
    {
        return $this->belongsTo(AdSet::class);
    }

    public function dailyMetrics()
    {
        return $this->hasMany(DailyMetric::class);
    }
}
