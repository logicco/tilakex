<?php


namespace App\Traits;


trait AuthUserScopeTrait
{
    public function scopeAuthUser($query)
    {
        return $query->where('user_id', '=', auth()->id());
    }
}
