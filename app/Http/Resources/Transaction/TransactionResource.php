<?php

namespace App\Http\Resources\Transaction;

use App\Http\Resources\Account\AccountResource;
use App\Http\Resources\Category\TransactionCategoryResource;
use App\Http\Resources\Payee\PayeeResource;
use App\Http\Resources\TransactionType\TransactionTypeResource;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'date'=> $this->date,
            'amount'=>$this->amount,
            'notes'=>$this->notes,
            'void'=>$this->isVoid(),
            'category'=>new TransactionCategoryResource($this->whenLoaded('category')),
            'payee'=> new PayeeResource($this->whenLoaded('payee')),
            'account'=>new AccountResource($this->whenLoaded('account')),
            'transaction_type'=>new TransactionTypeResource($this->whenLoaded('transactionType')),
            'created_at'=>$this->created_at->diffForHumans()
        ];
    }
}
