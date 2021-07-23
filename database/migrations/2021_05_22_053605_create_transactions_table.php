<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->decimal('amount', 10,2,true);
            $table->date('date');
            $table->string('notes')->nullable();
            $table->boolean('void')->default(false);
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('payee_id');
            $table->unsignedBigInteger('account_id');
            $table->unsignedBigInteger('transaction_type_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->foreign('transaction_type_id')->references('id')->on('transaction_types');
            $table->foreign('account_id')->references('id')->on('accounts')->cascadeOnDelete();
            $table->foreign('payee_id')->references('id')->on('payees');
            $table->foreign('category_id')->references('id')->on('categories');
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
