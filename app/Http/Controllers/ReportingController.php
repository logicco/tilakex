<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportingController extends Controller
{
    public function monthlyBreakdown(Request $request)
    {

        if(!$request->has('date')) {
            return response()->json([], 404);
        }

        $account = ( (int) $request->account ) < 1 ? null : (int) $request->account;

        $allowed_by_param = ["category", "payee"];
        $by = in_array($request->by, $allowed_by_param) ? $request->by : null;

        $date = explode(',', $request->date);

        if(count($date) !== 2) {
            return response()->json([], 404);
        }

        $month = ( (int) $date[0] ) < 1 ? null :  (int) $date[0];
        $year = ( (int) $date[1] ) < 1 ? null :  (int) $date[1];


        if($by === null || $month === null || $year === null || $account === null) {
            return response()->json([], 404);
        }

        $select = "";
        $plural = "";
        if ($by === "payee") {
            $select = "transactions.payee_id as id, payees.name, SUM(amount) AS total_expenses";
            $plural = "payees";
        }else{
            $select = "transactions.category_id as id, categories.name, categories.parent_id AS parent_id, SUM(amount) AS total_expenses";
            $plural = "categories";
        }

        $incomeTransactions = DB::table('transactions')
                        ->select(DB::raw("$select"))
                        ->join("$plural", "$plural.id", "=", "transactions.${by}_id")
                        ->where('transactions.user_id', $request->user()->id)
                        ->where('transactions.account_id', $account)
                        ->where('transaction_type_id', 2)
                        ->whereMonth('date', $month)
                        ->whereYear('date', $year)
                        ->groupBy("transactions.${by}_id")
                        ->get()
                        ->toArray();

        $expenseTransactions = DB::table('transactions')
                        ->select(DB::raw($select))
                        ->join("$plural", "$plural.id", "=", "transactions.${by}_id")
                        ->where('transactions.user_id', $request->user()->id)
                        ->where('transactions.account_id', $account)
                        ->where('transaction_type_id', 1)
                        ->whereMonth('date', $month)
                        ->whereYear('date', $year)
                        ->groupBy("transactions.${by}_id")
                        ->get()
                        ->toArray();


        if(count($incomeTransactions) === 0 && count($expenseTransactions) === 0) {
            return response()->json([]);
        }

        $totalExpenses = 0;
        $totalIncomes = 0;

        foreach($incomeTransactions as $transaction) {
            $totalIncomes += $transaction->total_expenses;
        }
        foreach($expenseTransactions as $transaction) {
            $totalExpenses += $transaction->total_expenses;
        }


       // dd($expenseTransactions);

        return response()->json([
            'income' => [
                'data' => $by === "category" ? $this->categoryTransformer($incomeTransactions) : $incomeTransactions,
                'total' => $totalIncomes,
            ],
            'expense' => [
                'data' => $by === "category" ? $this->categoryTransformer($expenseTransactions) : $expenseTransactions,
                'total' => $totalExpenses
            ],
            'fetched' => $by
        ]);
    }


    public function categoryTransformer(array $array) : array
    {
       $parentArr = [];
       $nonParentArr = [];
       foreach($array as $arr) {
            $arr->total_expenses = (int) $arr->total_expenses;
           if($arr->parent_id === null) {
               array_push($parentArr, $arr);
           }else{
               array_push($nonParentArr, $arr);
           }
       }

      // dd($parentArr, $nonParentArr);

       foreach($parentArr as $parent) {
           $id = $parent->id;
           $children = [];
           $parentTotal = 0;
           foreach($nonParentArr as $npr) {
               if($npr->parent_id === $id) {
                   array_push($children, $npr);
                   $parentTotal += $npr->total_expenses;
               }
           }
           $parent->children = $children;
           if($parentTotal !== 0) {
                $parent->total_expenses += $parentTotal;
           }
       }

      // dd($array, $parentArr, $nonParentArr);

       return count($parentArr) > 0 ? $parentArr : $nonParentArr;
    }
}
