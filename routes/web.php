<?php

use Illuminate\Support\Facades\Route;


Route::get('/',function(){
    return view('welcome');
})->name('react.home');

Route::view('/{path?}', 'welcome')
     ->where('path', '.*');
