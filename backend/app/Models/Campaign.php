<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ad_account_id',
        'name',
        'platform_campaign_id',
        'status',
        'objective',
    ];

    public function adAccount()
    {
        return $this->belongsTo(AdAccount::class);
    }

    public function adSets()
    {
        return $this->hasMany(AdSet::class);
    }
}
