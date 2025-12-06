'use client'
import Link from "next/link";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { signIn } from 'next-auth/react'; 
import { useRouter } from 'next/navigation'; 

export default function Login() {
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Email inválido.').required('Email é obrigatório.'),
        password: Yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres.').required('Senha é obrigatória.'),
    });

    function renderError(msg) {
        setError(msg);
        setTimeout(() => {
            setError("");
        }, 3000);
    }
    
    async function handleSubmit(values){
        setIsSubmitting(true);
        setError("");

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
            });

            if (result.error) {
                renderError(result.error); 
            } else {
                router.push('/'); 
            }

        } catch (error) {
            renderError("Erro de conexão com o servidor.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main id="login" className="min-h-screen w-full flex items-center justify-center">
             
            <div id="div_login" className="w-full md:w-1/2 flex items-center flex-col justify-center p-8">
                <div>
                    <div className="flex flex-col items-left w-auto">
                        <h1 className="text-5xl text-black font-bold mb-2">Login</h1>
                    
                        <p className="text-md mb-2 text-gray-600">
                            Não possui uma conta?
                            <Link href="/register" className="text-green-800 font-bold ml-1 hover:underline">Registre-se</Link>
                        </p>
                    </div>
                

                    {error && (
                        <div className="text-red-500 text-sm text-center p-2 border border-red-200 rounded">
                            {error}
                        </div>
                    )}
                    <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema}>
                        {({values, handleSubmit: formikSubmit, isValid}) => (
                            <form onSubmit={formikSubmit} noValidate className="space-y-4 max-w-md">
                
                                <Input required name={'email'} type="email" placeholder="Seu Email"></Input>
                                <Input required name={'password'} type="password" placeholder="Sua Senha" autoComplete="off"></Input>
                
                                <div className="flex justify-center mt-6">
                                    <Button
                                        type="submit"
                                        text={isSubmitting ? "ENTRANDO..." : "ENTRAR"}
                                        disabled={isSubmitting || !isValid}
                                        className="w-full bg-[#1B4A3A] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>   
            </div>
            
            <div id="lado_direito_login" className="hidden md:flex min-h-screen md:w-1/2 flex items-center justify-center bg-green-900 p-8">
                <img src="images/Untitled design (8).png" alt="Login Illustration" className="max-w-md h-auto" />
            </div>
        </main>
    );
}