<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\CategoryStorePostRequest;
use App\Http\Resources\Category\BaseCategoryResource;
use App\Http\Resources\Category\SubCategoryResource;
use App\Models\Category;
use App\Http\Resources\Category\CategoryResource;
use App\Http\Resources\Category\TransactionCategoryResource;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = $request->user()->categories()->with('children', 'parent')->whereNull('parent_id')->orderBy('name')->get();
        return response()->json(CategoryResource::collection($categories));
    }

    public function all(Request $request)
    {
        $categories = $request->user()->categories()->with('parent')->get();
        return response()->json(TransactionCategoryResource::collection($categories));
    }

    public function store(CategoryStorePostRequest $request)
    {
        try {
            $category = new Category();
            $category->name = $request->name;
            $category->user()->associate($request->user());
            $category->saveOrFail();
        }catch (\Exception) {
            abort(500, 'Could not save category');
        }

        return response()->json(new CategoryResource($category->load('children')), 201);
    }

    public function update(Category $category, CategoryStorePostRequest $request)
    {
        $this->authorize('touch', $category);

        try {
            $category->name = $request->name;
            $category->saveOrFail();
        }catch (\Exception) {
            abort(500, 'Could not update category');
        }

        if($category->isChildren()) {
            return response()->json(new SubCategoryResource($category->load('parent')));
        }

        return response()->json(new CategoryResource($category->load('children')));

    }

    public function addChild(Category $category, CategoryStorePostRequest $request)
    {
        $this->authorize('touch', $category);


        if($category->isChildren()) {
            abort(500, "$category->name is sub category and cannot have children");
        }

        try {
            $childCategory = new Category();
            $childCategory->name = $request->name;
            $childCategory->parent()->associate($category);
            $childCategory->user()->associate($request->user());
            $childCategory->saveOrFail();
        }catch (\Exception) {
            abort(500, 'Could not save category');
        }

        return response()->json([
            'parent_id' => $category->id,
            'inserted' => new BaseCategoryResource($childCategory)
        ], 201);
    }


    public function detail(Category $category)
    {
        $this->authorize('touch', $category);

        if ($category->isChildren()) {
            return new SubCategoryResource($category->load('parent'));
        }
        return response()->json(new CategoryResource($category->load('children')));
    }

    public function delete(Category $category, Request $request)
    {
        $this->authorize('touch', $category);

        DB::transaction(function () use($category) {
            try {
                if ($category->isParent()) {
                    $category->children()->delete();
                }
                $category->delete();
            }catch (QueryException) {
                abort(500, "Failed to delete $category->name because it has transactions.");
            }catch (\Exception) {
                abort(500, "Failed to delete transaction.");
            }
        });

        return $this->index($request);
    }
}
