<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert([
            'name'=>'Horror'
        ]);
        DB::table('categories')->insert([
            'name'=>'Comedy'
        ]);
        DB::table('categories')->insert([
            'name'=>'Action'
        ]);
        DB::table('categories')->insert([
            'name'=>'Vlog'
        ]);
        DB::table('categories')->insert([
            'name'=>'Love'
        ]);
    }
}
