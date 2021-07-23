<?php

namespace App\Http\Requests\Transaction;

use App\Rules\ExistsForUser;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $userId = (int) auth()->id();
        return [
            'amount'=>'required|numeric|min:0|not_in:0',
            'date'=>'required|date',
            'notes'=>'nullable|string|max:255',
            'void'=>'boolean',
            'category_id' => ['required', 'integer', Rule::exists('categories', 'id')->where('user_id', $userId)],
            'payee_id' => ['required', 'integer', Rule::exists('payees', 'id')->where('user_id', $userId)],
            'transaction_type_id'=>'required|integer|exists:transaction_types,id',
        ];
    }
}
