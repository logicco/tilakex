<?php

namespace App\Traits;

trait CreatedDateTrait {

    public function createdDate()
    {
        return $this->created_at == null ? 'N/A':$this->created_at->diffForHumans();
    }

}
