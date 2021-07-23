<?php

namespace App\Models;

use App\Traits\AuthUserScopeTrait;
use App\Traits\CreatedDateTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory, AuthUserScopeTrait, CreatedDateTrait;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function scopeAuth($query, $id)
    {
        return $query->where('user_id', $id);
    }
}
