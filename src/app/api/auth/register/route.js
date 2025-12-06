import User from "@/models/User";
import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username: nome, email, password } = await request.json(); 
    await connect();

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json(
        { message: "Email já está cadastrado" },
        { status: 409 } 
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nome, 
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return NextResponse.json(
      { message: "Usuário registrado com sucesso" },
      { status: 201 } 
    );
  } catch (error) {
    console.error("Erro no registro:", error); 

    return NextResponse.json(
      { message: "Erro interno ao cadastrar usuário." },
      { status: 500 }
    );
  }
}