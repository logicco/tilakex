<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginFormRequest;
use App\Http\Requests\Auth\RegisterFormRequest;
use App\Http\Requests\Auth\ResetPasswordFormRequest;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function resetPassword(ResetPasswordFormRequest $request)
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        if($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => "Password has been successfully reset"]);
        }else{
            abort(500, "Failed to reset password");
        }
    }

    //Use this to for mobile device authentication
    public function tokenAuthenticate(Request $request)
    {
        return response()->json();
        // $credentials = $request->only('email', 'password');

        // $user = User::where('email',$credentials['email'])->first();

        // //check password
        // if(!$user || !Hash::check($credentials['password'], $user->password)) {
        //     return response()->json([
        //         'message'=>'invalid credentials'
        //     ], 422);
        // }

        // $authToken = $user->createToken('authToken')->plainTextToken;

        // return response()->json(
        //     ['message'=>'login successful', 'token'=>$authToken]
        // );
    }

    public function register(RegisterFormRequest $request)
    {

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        return response()->json([
            'message'=>"Registeration Successfull, We have also sent you verification email at $user->email",
        ], 201);
    }

    //Use this to authenticate web clients
    public function webAuthenticate(LoginFormRequest $request)
    {

        $credentials = $request->only('email', 'password');

        if(Auth::attempt($credentials)) {
            return response()->json(new UserResource(auth()->user()),200);
        }

        return response()->json(['message'=>'invalid credentials'], 422);

    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(
            ['message'=>'logout successful']
        );
    }
}
