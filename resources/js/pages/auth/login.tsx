import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [processing, setProcessing] = useState(false);


    return (
        <AuthLayout title="Welcome to Fibonacci Calculator" description="Log in to your account">
            <Head title="Log in" />
            <Button 
                type="button" 
                className="w-full cursor-pointer" 
                tabIndex={4} 
                disabled={processing}
                onClick={async()=>{
                    setProcessing(true)
                    try{
                        window.location.href = '/auth/google';
                    }catch(error){
                        console.log('Google Button Login : ',error)
                    }finally{
                        setProcessing(false)
                    }
                }}
            >
                        {processing && <LoaderCircle className="h-auto animate-spin" />}
                        <i className="fa fa-google mr-2 text-white text-lg"></i>
                        Log in with Google
            </Button>
            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
