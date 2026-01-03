import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const { type, amount } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ message: "Valor inválido" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
  }

  try {
    let newBalance = user.balance;

    if (type === 'DEPOSIT') {
      newBalance += amount;
    } else if (type === 'WITHDRAW') {
      if (user.balance < amount) {
        return NextResponse.json({ message: "Saldo insuficiente" }, { status: 400 });
      }
      newBalance -= amount;
    } else {
        return NextResponse.json({ message: "Tipo de transação inválido" }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: newBalance },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          amount,
          type,
          status: 'COMPLETED',
        },
      }),
    ]);

    return NextResponse.json({ balance: newBalance });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao processar transação" }, { status: 500 });
  }
}
