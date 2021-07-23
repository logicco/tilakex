<?php

namespace App\Http\Resources\Account;

use App\Http\Resources\Currency\CurrencyResource;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'=>$this->id,
            'name'=>$this->name,
            'is_default'=>(boolean) $this->is_default,
            'currency'=>new CurrencyResource($this->whenLoaded('currency')),
            'created_at'=>$this->createdDate(),
        ];
    }
}
