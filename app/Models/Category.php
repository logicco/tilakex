<?php

namespace App\Models;

use App\Traits\AuthUserScopeTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, AuthUserScopeTrait;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function isParent()
    {
        return $this->parent_id == null;
    }

    public function isChildren()
    {
        return !$this->isParent();
    }

    public function createdDate()
    {
        return $this->created_at == null ? 'N/A': $this->created_at->diffForHumans();
    }


}
