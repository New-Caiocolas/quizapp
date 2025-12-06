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
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-full md:w-1/2 flex items-center flex-col justify-center p-8">
                <div>
                    <div className="flex flex-col items-left w-auto">
                            <h1 className="text-5xl text-black font-bold mb-2">Registro</h1>
                            <p className="text-md mb-2 text-gray-600">
                                Voltar para login?
                                <Link href="/login" className="text-green-800 font-bold ml-1 hover:underline">Entre</Link>
                            </p>
                    </div>
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
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
            <div id="lado_direito_login" className="hidden md:flex min-h-screen md:w-1/2 flex items-center justify-center bg-green-900 p-8">
                <img src="images/REGISTER.png" alt="Register Illustration" className="max-w-md h-auto" />
            </div>
        </main>
    )
}