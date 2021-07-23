<?php

namespace App\Http\Controllers;

use App\Http\Requests\Transaction\StoreFormRequest;
use App\Http\Requests\Transaction\UpdateFormRequest;
use App\Http\Resources\Account\AccountResource;
use App\Http\Resources\Transaction\TransactionResource;
use App\Models\Account;
use App\Models\Transaction;
use Illuminate\Http\Request;
use App\Util;

class TransactionController extends Controller
{
    public function index(Account $account, Request $request)
    {
        $this->authorize('touch', $account);
        $account->load('currency');

        $sortList = ['date', 'name'];
        $filterTypesList = [0,1,2];
        $filterDatesList = ["all","current_month", "last_month", "last_3_months"];

        $sortCol = 'date';
        $totalResults = 12;
        $filterType = 0;
        $filterDate = $filterDatesList[0];
        $filterPayees = null;
        $filterCategories = null;


        if(in_array($request->sort, $sortList, true)) {
            $sortCol = $request->sort;
        }
        if(in_array($request->type, $filterTypesList)) {
            $filterType = (int) $request->type;
        }
        if(in_array($request->date, $filterDatesList, true)) {
            $filterDate = $request->date;
        }

        $betweenDate = Util::generateDateBetween($filterDate);

        $splitedPayees = explode(',',$request->payees);
        $splitedCategories = explode(',', $request->categories);

        if(Util::is_int_array($splitedPayees)) {
           $filterPayees = $splitedPayees;
        }

        if(Util::is_int_array($splitedCategories)) {
            $filterCategories  = $splitedCategories;
        }

        $transactions = Transaction::query()
                        ->with(['payee', 'category.parent', 'transactionType'])
                        ->where('user_id', $request->user()->id)
                        ->where('account_id', $account->id);

        if($filterType != $filterTypesList[0]) {
            $transactions->where('transaction_type_id', $filterType);
        }

        if($filterPayees !== null) {
            $transactions->whereIn('payee_id', $filterPayees);
        }

        if($filterCategories !== null) {
            $transactions->whereIn('category_id', $filterCategories);
        }

        if($betweenDate !== null) {
            $transactions->whereBetween('date', $betweenDate);
        }

        $transactions->latest($sortCol);


        return response()->json([
            'account' => new AccountResource($account),
            'transactions' => TransactionResource::collection($transactions->paginate($totalResults))->response()->getData(true)
        ]);
    }

    public function store(Account $account, StoreFormRequest $request)
    {
        $this->authorize('touch', $account);

        try {
            $transaction = new Transaction();
            $transaction->amount = $request->amount;
            $transaction->date = $request->date;
            if ($request->has('void')) {
                $transaction->void = $request->void;
            }
            $transaction->notes = $request->notes;
            $transaction->account()->associate($account);
            $transaction->category_id = $request->category_id;
            $transaction->payee_id = $request->payee_id;
            $transaction->transaction_type_id = $request->transaction_type_id;
            $transaction->user()->associate($request->user());
            $transaction->saveOrFail();

        }catch (\Exception){
            abort(500, 'Failed to save transaction');
        }

        return response()->json(new TransactionResource($transaction->load(['payee', 'category.parent', 'transactionType'])), 201);
    }

    public function update(Account $account, Transaction $transaction, UpdateFormRequest $request)
    {
        $this->authorize('touch', $account);
        $this->authorize('touch', [$transaction, $account]);

        try {
            $transaction->amount = $request->amount;
            $transaction->date = $request->date;
            if($request->has('void')) {
                $transaction->void = $request->void;
            }
            $transaction->notes = $request->notes;
            $transaction->account()->associate($account);
            $transaction->category_id = $request->category_id;
            $transaction->payee_id = $request->payee_id;
            $transaction->transaction_type_id = $request->transaction_type_id;
            $transaction->saveOrFail();

        }catch (\Exception){
            abort(500, 'Failed to update transaction');
        }

        return response()->json(new TransactionResource($transaction->load(['payee', 'category.parent', 'transactionType'])), 200);

    }

    public function detail(Account $account, Transaction $transaction)
    {
        $this->authorize('touch', $account);
        $this->authorize('touch', [$transaction, $account]);

        $transaction->load(['payee', 'category.parent', 'transactionType', 'account.currency']);

        return new TransactionResource($transaction);
    }

    public function delete(Account $account, Transaction $transaction)
    {
        $this->authorize('touch', $account);
        $this->authorize('touch', [$transaction, $account]);

        try {
            $transaction->delete();
        }catch(\Exception){
            abort(500, "failed to delete transactions");
        }

        return response()->json(new TransactionResource($transaction));
    }


}
