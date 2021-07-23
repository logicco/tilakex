<?php

namespace App\Policies;

use App\Models\Payee;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PayeePolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function touch(User $user, Payee $payee)
    {
        return $user->id === $payee->user_id;
    }
}
