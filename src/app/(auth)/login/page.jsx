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
                router.push('/'); // Rota de redirecionamento após login bem-sucedido
            }

        } catch (err) {
            renderError("Erro ao tentar conectar ao servidor de autenticação.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <div className="p-8 bg-white shadow-lg rounded-lg max-w-sm w-full space-y-4">
                <h1 className="text-2xl text-black font-bold text-center">Login</h1>

                {error && (
                    <div className="text-red-500 text-sm text-center p-2 border border-red-200 rounded">
                        {error}
                    </div>
                )}

                <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema}>
                    {({values, handleSubmit, isValid}) => (
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            
                            <Input required name={'email'} type="email" placeholder="Seu Email"></Input>
                            <Input required name={'password'} type="password" placeholder="Sua Senha" autoComplete="off"></Input>
                            
                            <div className="flex justify-center mt-6">
                                <Button 
                                    type="submit" 
                                    text={isSubmitting ? "ENTRANDO..." : "ENTRAR"} 
                                    disabled={isSubmitting || !isValid} 
                                    className="bg-blue-600 text-white p-2 px-6 rounded hover:bg-blue-700 disabled:opacity-50"
                                />
                            </div>
                            
                            <p className="text-sm text-center text-gray-600 pt-2">
                                Não possui uma conta?
                                <Link href="/register" className="text-blue-600 font-bold ml-1 hover:underline">Registre-se</Link>
                            </p>
                        </form>
                    )}
                </Formik>
            </div>
        </main>
    );
}