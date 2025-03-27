import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
];

export default function Dashboard() {
    const { auth } = usePage<{ auth: any }>().props;
    const [mysqlData,setMySQLData] = useState(null)
    const [redisData,setRedisData] = useState(null)
    const [fiboNumber,setFiboNumber] = useState()
    const [errMessage,setErrMessage] = useState("")
    
    const fetchResult = async () => {
        try {
            const response = await axios.get(`/api/fibonacci/result/${auth?.user?.id}`,{
                headers: {
                    Authorization: `Bearer ${auth?.token}`
                }
            });
            setMySQLData(response.data.MySQL)
            setRedisData(response.data.RedisData);
        } catch (error) {
            console.error("Error fetching Fibonacci result:", error);
        }
    };
    const pollResult = () => {
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(`/api/fibonacci/result/${auth?.user?.id}`,{
                    headers: {
                        Authorization: `Bearer ${auth?.token}`
                    }
                });
                setMySQLData(response.data.MySQL);
                setRedisData(response.data.RedisData);

                if (response.data.RedisData.length > 0) {
                    clearInterval(interval);
                    setErrMessage("Success Calculate");

                    setTimeout(() => {
                        setErrMessage("");
                    }, 3000);

                }

            } catch (error) {
                console.error("Error fetching Fibonacci result:", error);
            }
        }, 2000);
        // setTimeout(() => {
        //     clearInterval(interval);
        //     setErrMessage("Calculate Failed");
        // }, 6);
    };
    useEffect(()=>{
        fetchResult()
    },[])

    const handleSubmit = async (index) => {
        try {
            const response = await axios.post(`/api/fibonacci/calculate`,
                {
                    index: index,
                    user_id: auth?.user?.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth?.token}`
                    }
                }
            );
            console.log(response)
            if(response.data.message==="You have already submitted this index." || response.data.message==="Fibonacci calculation started."){
                setErrMessage(response.data.message)
            }
            pollResult()
        } catch (error) {
            console.error("Error Sending Fibonacci :", error);
        }
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <p>Hello {auth?.user?.email}</p>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video rounded-xl border p-5">
                        <div className="pt-5 pr-40 pl-40">
                            <p className="font-sm text-4xl pb-5">Fibonacci Calculator</p>
                            <div className="grid gap-2">
                                <Label className="text-base" htmlFor="fibo">Enter Fibonacci Index</Label>
                                <Input
                                    id="fibo"
                                    type="number"
                                    className="mt-1 block w-full"
                                    required
                                    autoComplete="off"
                                    placeholder="Fibonacci Index"
                                    min="0"
                                    value={fiboNumber}
                                    onChange={(e)=> setFiboNumber(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "." || e.key === "-" || e.key === "e") {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <p className={errMessage==="You have already submitted this index." || errMessage==="Calculate Failed" ? "text-red-500" :errMessage==="Fibonacci calculation started." ? "text-green-500":errMessage==="Success Calculate"?"text-green-600 font-bold ":"text-gray-500"}>{errMessage?errMessage:"Submit After Fill Fibonacci Index"}</p>
                                <div className="w-max pt-3">
                                    <Button className="w-50" 
                                        onClick={() => {
                                            if (fiboNumber) {
                                                handleSubmit(fiboNumber)
                                            } else {
                                                setErrMessage("Please fill your index")
                                                console.log("Please fill your index")
                                            }
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </div>
                                {/* <InputError className="mt-2" message={errors.name} /> */}
                            </div>
                            <div className="grid gap-2 pt-8">
                                <Label className="text-base">Index I have seen (Sort in ascending order)</Label>
                                <div className="pr-5 pl-5">
                                    <p>{mysqlData?mysqlData.join(", "):'None'}</p>
                                </div>
                            </div>
                            <div className="grid gap-2 pt-8">
                                <Label className="text-base">Calculate Value (Sort in ascending order)</Label>
                                <div className="pr-5 pl-5">
                                    {redisData ? (
                                        redisData.map((item,index)=>(
                                            <p key={index}>{item}</p>
                                        ))
                                    ):(
                                        <p>None</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
