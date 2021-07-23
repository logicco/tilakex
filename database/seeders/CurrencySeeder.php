<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('currencies')->insert([
            'name'=>'Usa',
            'code'=>'USD',
            'symbol'=>'$'
        ]);
        DB::table('currencies')->insert([
            'name'=>'Canada',
            'code'=>'CAD',
            'symbol'=>'$'
        ]);
    }
}
