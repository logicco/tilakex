<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Payee\StoreFormRequest;
use App\Http\Requests\Payee\UpdateFormRequest;
use App\Http\Resources\Payee\PayeeResource;
use App\Models\Payee;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

class PayeeController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(PayeeResource::collection($request->user()->payees()->get()));
    }

    public function store(StoreFormRequest $request)
    {
        try {
            $payee = new Payee();
            $payee->name = $request->name;
            $payee->user()->associate($request->user());
            $payee->saveOrFail();

        }catch (\Exception) {
            abort('500', 'failed to save payee');
        }

        return response()->json(new PayeeResource($payee), 201);
    }

    public function update(Payee $payee, UpdateFormRequest $request)
    {
        $this->authorize('touch', $payee);

        try {
            $payee->name = $request->name;
            $payee->saveOrFail();

        }catch (\Exception) {
            abort('500', 'failed to update payee');
        }

        return response()->json(new PayeeResource($payee));
    }

    public function detail(Payee $payee)
    {
        $this->authorize('touch', $payee);
        return new PayeeResource($payee);
    }

    public function delete(Payee $payee)
    {
        $this->authorize('touch',$payee);


        try {
            $payee->delete();
        }catch (QueryException) {
            abort(500, "Failed to delete $payee->name because it has transactions. Please delete transactions first");
        }catch(\Exception) {
            abort(500, "Failed to delete payee");
        }

        return response()->json(new PayeeResource($payee));
    }
}
