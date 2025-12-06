'use client'
import Link from "next/link";
import { Button } from "../../../components/button";
import { Input } from "../../../components/input";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const initialValues = {
        nome: '',
        email: '',
        password: '',
    };

    const validationSchema = Yup.object().shape({
        nome: Yup.string().required('Nome é obrigatório'), 
        email: Yup.string().email('Email inválido').required('Email é obrigatório'),
        password: Yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
    });

    function renderError(msg) {
        setError(msg);
        setTimeout(() => {
            setError("");
        }, 3000);
    }
    
    async function handleSubmit(values, { resetForm }){
        setIsSubmitting(true);
        setError("");

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.nome, 
                    email: values.email,
                    password: values.password,
                }),
            }); 
            
            const result = await res.json(); 

            if (res.status === 201) {
                alert(result.message || 'Cadastro realizado com sucesso!');
                router.push('/login');
            } 
            else { 
                renderError(result.message || 'Erro desconhecido ao cadastrar.');
                resetForm();
            }

        } catch (error) {
            renderError("Erro ao conectar ou cadastrar usuário.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center">
            <h1 class="text-5xl text-black font-bold mb-2">Registro</h1>
            <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema}>
                {({values, handleSubmit, isSubmitting: formikIsSubmitting}) => ( 
                    <form noValidate onSubmit={handleSubmit}>
                        <Input required name={'nome'} type="name"></Input>
                        <Input required name={'email'} type="email"></Input>
                        <Input required name={'password'} type="password" autoComplete="off"></Input>
                        
                        {error && (
                            <div className="text-red-500 text-sm text-center p-2 border border-red-200 rounded my-2">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex flex-col items-center justify-center mt-1 " >
                                {!values.nome && !values.email && !values.password && (
                                    <span className="text-red-500">Preencha todos os campos</span>
                                )}
                            <Button 
                                type="submit" 
                                text={isSubmitting ? "REGISTRANDO..." : "REGISTRAR-SE"} 
                                disabled={isSubmitting} 
                                className="w-full bg-[#1B4A3A] text-white py-2 px-4 rounded-md cursor-pointer hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            </Button>
                        </div>
                        <span>Voltar para login</span>
                        <strong>
                            <Link href="/login"> Entre</Link>
                        </strong>
                    </form>
                )}
            </Formik>
        </main>
    )
}