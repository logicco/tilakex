<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Password;

class VerificationController extends Controller
{
    //sends forgot password email
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        Password::sendResetLink($request->only('email'));
        return response()->json(['message'=>"Password reset link has been sent"]);
    }

    public function resendVerificationEmail(Request $request)
    {
        if($request->user()->isEmailVerified()) {
            return response()->json([
                "message" => "Your email is already verified",
            ], 500);
        }
        $request->user()->sendEmailVerificationNotification();

        return response()->json(['message' => 'Verification link sent!']);
    }

    public function verifyEmail(Request $request){

        try {
            $user = User::findOrFail($request->route('id'));

            if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
                throw new AuthorizationException();
            }

        } catch (\Exception) {
            abort(403, "This action cannot be performed");
        }

        try {
            if ($user->markEmailAsVerified()) event(new Verified($user));
        } catch (\Exception) {
            abort(500, "Something went wrong");
        }

        return response()->json(["message" => "Your email is successfully verified"]);
    }
}
