import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // Simple admin check (in production, use a role field in DB or specific email list)
  // For this demo, any authenticated user can see this endpoint if we don't strictly enforce 'ADMIN' role
  // But let's enforce it based on the schema we created (User has role field)

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
  });

  if (currentUser?.role !== 'ADMIN') {
      // For demo purposes, if I am the first user or just to allow testing, I might skip this.
      // But let's stick to the plan. I will seed an admin or allow self-promotion via DB.
      // Since I can't easily seed, I will allow "creeper@bet.com" to be admin or just return all users for now.
      // Actually, let's just check the role.
      if (currentUser?.role !== 'ADMIN') {
         return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
      }
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      balance: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  const transactions = await prisma.transaction.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { email: true } } }
  });

  return NextResponse.json({ users, transactions });
}
