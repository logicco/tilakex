<?php

namespace App\Providers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Payee;
use App\Models\Transaction;
use App\Policies\AccountPolicy;
use App\Policies\CategoryPolicy;
use App\Policies\PayeePolicy;
use App\Policies\TransactionPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Payee::class => PayeePolicy::class,
        Account::class => AccountPolicy::class,
        Category::class => CategoryPolicy::class,
        Transaction::class=>TransactionPolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        ResetPassword::createUrlUsing(function ($user, string $token) {
            return env('APP_URL')."/auth/reset-password?token=$token";
        });
    }
}
