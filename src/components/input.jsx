'use client';
import { Field,ErrorMessage } from "formik";

export function Input({name,label,type,required,...props}){
  return (
    <div className="">
        <div className="flex flex-col capitalize mb-4">
            <div className="text-black">{label || name} <span className="text-red-500">{required && "*"}</span></div>
            <Field name={name} type={type} {...props} className="border rounded p-2"></Field>
            <div className="text-red-500 text-xs mt-1">
                <ErrorMessage name={name}></ErrorMessage>
            </div>
        </div>
    </div>
  );
}