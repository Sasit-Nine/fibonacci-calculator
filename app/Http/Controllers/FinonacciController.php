<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Fibonacci;
use App\Jobs\CalculateFibonacci;
use Illuminate\Support\Facades\Redis;
class FinonacciController extends Controller
{
    public function calculate(Request $request)
    {
        $validatedData = $request->validate([
            'index' => 'required|integer|min:0',
            'user_id' => 'required|integer'
        ]);
        $fibonacci = Fibonacci::where('index', $validatedData['index'])->where('user_id', $validatedData['user_id'])
        ->first();
        if($fibonacci){
            return response()->json(['message' => 'You have already submitted this index.'], 200);
        }
        $fibonacci = Fibonacci::create([
            'user_id' => $validatedData['user_id'],
            'index' => $validatedData['index'],
            'status' => 'pending'
        ]);
        CalculateFibonacci::dispatch($validatedData['index'],$validatedData['user_id']);
        return response()->json([
            'message' => 'Fibonacci calculation started.',
            'fibonacci_id' => $fibonacci->id
        ]);
    }

    public function getResult($user_id)
    {
        $fibonacciRecords = Fibonacci::where('user_id', $user_id)->where('status','complete')->pluck('index');

        if ($fibonacciRecords->isEmpty()) {
            return response()->json(['message' => 'No Fibonacci records found for this user'], 404);
        }
        $redisData = [];
        foreach($fibonacciRecords as $i){
            $cacheKey = "fibonacci:$i";
            $cacheValue = Redis::get($cacheKey);
            if($cacheValue !== null){
                $redisData[] = "For index $i, fibonacci value is " . (string) $cacheValue;
            }else{
                $redisData[] = "For index $i, fibonacci value not found in Redis";
            }
        }
        return response()->json(['MySQL' => $fibonacciRecords, 'RedisData' => $redisData]);
    }
}
