<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyMetric extends Model
{
    use HasFactory;

    protected $fillable = [
        'ad_id',
        'date',
        'impressions',
        'clicks',
        'spend',
        'ctr',
        'cpc',
        'cpm',
        'frequency',
    ];

    protected $casts = [
        'date' => 'date',
        'spend' => 'decimal:4',
        'ctr' => 'decimal:4',
        'cpc' => 'decimal:4',
        'cpm' => 'decimal:4',
        'frequency' => 'decimal:4',
    ];

    public function ad()
    {
        return $this->belongsTo(Ad::class);
    }
}
