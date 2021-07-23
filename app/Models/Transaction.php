<?php

namespace App\Models;

use App\Traits\AuthUserScopeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory, AuthUserScopeTrait;

    public function isVoid()
    {
        return $this->void == true;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function payee()
    {
        return $this->belongsTo(Payee::class);
    }

    public function transactionType()
    {
        return $this->belongsTo(TransactionType::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
