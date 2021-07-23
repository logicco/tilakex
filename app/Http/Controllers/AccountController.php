<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\AccountPostRequest;
use App\Http\Resources\Account\AccountResource;
use App\Models\Account;
use App\Models\Currency;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $accounts = $request->user()->accounts()->with('currency')->get();
        return response()->json(AccountResource::collection($accounts));
    }

    public function store(AccountPostRequest $request)
    {
        try {
            $currency = Currency::findOrFail($request->currency_id);
        }catch (\Exception){
            return response()->json([
                "errors" => [
                    "currency_id" => ["Unable to find currency"]
                ]
            ], 421);
        }

        $account = new Account();
        $account->name = $request->name;

        try {
            $account->currency()->associate($currency);
            $account->user()->associate($request->user());
            $account->saveOrFail();
        }catch (\Exception){
            abort(500, 'unable to save account');
        }

        return response()->json(new AccountResource($account), 201);

    }

    public function update(Account $account, AccountPostRequest $request)
    {
        $this->authorize('touch', $account);

        try {
            $currency = Currency::findOrFail($request->currency_id);
        }catch (\Exception){
            abort(500, "unable to find currency");
        }

        try {
            $account->name = $request->name;
            $account->currency()->associate($currency);
            $account->saveOrFail();
        }catch (\Exception $e){
            abort(500, "Unable to save account");
        }

        return response()->json(new AccountResource($account->load('currency')));
    }

    public function detail(Account $account)
    {
        $this->authorize('touch', $account);
        return response()->json(new AccountResource($account->load('currency')));
    }

    public function delete(Account $account)
    {
        $this->authorize('touch', $account);

        try{
            $account->delete();
        }catch(\Exception) {
            abort(500, "Failed to delete account");
        }
        return response()->json(new AccountResource($account));
    }
}
