<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Redis;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use App\Models\Fibonacci;
use Illuminate\Support\Facades\Log;

class CalculateFibonacci implements ShouldQueue, ShouldBeUnique
{
    use Queueable, Dispatchable, SerializesModels, InteractsWithQueue;
    protected $index;
    protected $user_id;
    public function __construct(int $index,$user_id)
    {
        $this->index = $index;
        $this->user_id = $user_id;
    }
    public function handle(): void
    {
        $cacheKey = "fibonacci:{$this->index}";
        $cacheValue = Redis::get($cacheKey);

        if($cacheValue){
            Log::info("Cache hit for key: {$cacheKey}, value: {$cacheValue}");
            $fibonacciValue = (int) $cacheValue;
        }else{
            Log::info("Cache miss for key: {$cacheKey}, calculating Fibonacci...");
            $fibonacciValue = $this->calculateFibonacci($this->index);
            Redis::set($cacheKey,$fibonacciValue);
        }

        $fibonacci = Fibonacci::where('index', $this->index)->where('user_id', $this->user_id)->first();
        if ($fibonacci) {
            $fibonacci->update([
                'status' => 'complete'
            ]);
        }
    }

    private function calculateFibonacci($n)
    {
        if($n <= 1){
            return gmp_strval($n);
        }
        $prev = gmp_init(0);
        $curr = gmp_init(1);
        for ($i=2; $i<=$n; $i++){
            $temp = $curr;
            $curr = gmp_add($prev,$curr);
            $prev = $temp;
        }
        return gmp_strval($curr);
    }
}
