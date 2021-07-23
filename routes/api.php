<?php

use App\Http\Controllers\ReportingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PayeeController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;

/*
 * ***************************
 * PUBLIC ROUTES
 * ***************************
 */


Route::get('/', function (){
   return response()->json([
      'message'=>'Welcome to Tilakex API'
   ]);
})->middleware('web');

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verifyEmail'])
            ->middleware('signed')
            ->name('verification.verify');

//User must not be logged in
Route::middleware('guest')->group(function() {
    Route::prefix('auth')->group(function (){
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
        Route::post('forgot-password', [VerificationController::class, 'forgotPassword']);
        Route::post('login', [AuthController::class, 'webAuthenticate']);
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login-token', [AuthController::class, 'tokenAuthenticate']);
    });
});


/*
 * ***************************
 * AUTH ROUTES
 * ***************************
 */
Route::middleware('auth:sanctum')->group(function (){

    /**
     * Auth
     */
    Route::post('auth/logout', [AuthController::class, 'logout']);


    /**
     * Email verification
     */
    Route::prefix('email')->group(function() {

        Route::get('verify', function () {
            return response()->json(["message" => "Email must be verified"]);
        })->name('verification.notice');

        Route::post('verification-notification', [VerificationController::class, 'resendVerificationEmail'])
                ->middleware('throttle:6,1')
                ->name('verification.send');
    });


    /**
     * User
     */
    Route::prefix('user')->group(function (){
        Route::get('/', [UserController::class, 'details']);
        Route::put('profile', [UserController::class, 'update']);
        Route::put('change-password', [UserController::class, 'changePassword']);
    });


    /**
     * Dashboard
     */

    Route::get('/dashboard', function (){
        return response()->json(['value'=>1]);
    });

    /**
     * Payee
     */
    Route::prefix('payees')->group(function (){
        Route::get('/', [PayeeController::class, 'index']);
        Route::post('/', [PayeeController::class, 'store']);
        Route::get('/{payee}', [PayeeController::class, 'detail']);
        Route::put('/{payee}', [PayeeController::class, 'update']);
        Route::delete('/{payee}', [PayeeController::class, 'delete']);
    });

    Route::prefix('accounts')->group(function (){
        Route::get('/', [AccountController::class, 'index']);
        Route::post('/', [AccountController::class, 'store']);

        Route::prefix('{account}')->group(function (){
            Route::get('/', [AccountController::class, 'detail']);
            Route::put('/', [AccountController::class, 'update']);
            Route::delete('', [AccountController::class, 'delete']);

            Route::prefix('transactions')->group(function (){
                Route::get('/',[TransactionController::class, 'index']);
                Route::post('/',[TransactionController::class, 'store']);
                Route::get('/{transaction}',[TransactionController::class, 'detail']);
                Route::put('/{transaction}',[TransactionController::class, 'update']);
                Route::delete('/{transaction}',[TransactionController::class, 'delete']);
            });
        });

    });

    Route::prefix('categories')->group(function (){
        Route::get('/', [CategoryController::class, 'index']);
        Route::get('/all', [CategoryController::class, 'all']);
        Route::post('/', [CategoryController::class, 'store']);
        Route::get('/{category}', [CategoryController::class, 'detail']);
        Route::put('/{category}', [CategoryController::class, 'update']);
        Route::delete('/{category}', [CategoryController::class, 'delete']);
        Route::post('/{category}/add', [CategoryController::class, 'addChild']);
    });

    Route::prefix('reporting')->group(function (){
        Route::get('monthly-breakdown',[ReportingController::class,'monthlyBreakdown']);
    });
});





