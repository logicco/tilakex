<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Profile\ChangePasswordFormRequest;
use App\Http\Requests\Profile\UpdateFormRequest;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function details(Request $request)
    {
        return response()->json(new UserResource($request->user()));
    }

    public function changePassword(ChangePasswordFormRequest $request)
    {
        $user = $request->user();

        $passwordMatches = Hash::check($request->old_password, $user->password);

        if(!$passwordMatches) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        try {
            $user->password = Hash::make($request->new_password);
            $user->saveOrFail();
        } catch (\Exception) {
            abort(500, "Failed to change password");
        }

        return response()->json(['message' => 'Password has been successfully changed']);
    }

    //update user profile
    public function update(UpdateFormRequest $request)
    {
        $user = $request->user();
        $didEmailChange = $request->email !== $user->email;

        if($didEmailChange) {
            $emailExists = User::where('email', '=' ,$request->email)->exists();

            if($emailExists) {
                return response()->json([
                    'message' => '',
                    'errors' => [
                        'email' => [
                            "$request->email already exists"
                        ]
                    ]
                ], 422);
            }
        }

        try {
            $user->name = $request->name;

            if($didEmailChange) {
                $user->email  = $request->email;
                $user->email_verified_at = null;
            }
            $user->saveOrFail();

            if($didEmailChange) {
                event(new Registered($user));
            }

        } catch (\Exception) {
            abort(500, "Failed to update profile");
        }

        return response()->json(new UserResource($user));
    }
}
