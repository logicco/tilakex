<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        DB::table('currencies')->insert([
            'name'=>'Canada',
            'code'=>'CAD',
            'symbol'=>'$',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('transaction_types')->insert([
            'name'=>'withdraw',
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('users')->insert([
            'name'=>'Bhav',
            'email'=>'chaukidar@protonmail.com',
            'password'=>bcrypt('password'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
        DB::table('users')->insert([
            'name'=>'Joe',
            'email'=>'xboxic@protonmail.com',
            'password'=>bcrypt('password'),
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

//        DB::table('categories')->insert([
//            'name'=>'food',
//            'user_id'=>1,
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);
//        DB::table('categories')->insert([
//            'name'=>'bills',
//            'user_id'=>2,
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);
//
//        DB::table('payees')->insert([
//            'name'=>'freshco',
//            'user_id'=>1,
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);
//        DB::table('payees')->insert([
//            'name'=>'bills',
//            'user_id'=>2,
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);
//
//        DB::table('accounts')->insert([
//            'name'=>'finance',
//            'user_id'=>1,
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);
//
//        DB::table('accounts')->insert([
//            'name'=>'finance',
//            'user_id'=>2,
//            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
//            'updated_at' => Carbon::now()->format('Y-m-d H:i:s')
//        ]);

    }
}
