import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../../../../prisma/client";

const schema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = schema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            { error: validation.error.issues },
            { status: 400 }
        );
    }
    const user = await prisma.user.findUnique({
        where: {
            email: validation.data.email,
        },
    });
    if (user) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(validation.data.password, 10);
    const newUser = await prisma.user.create({
        data: {
            name: `${validation.data.firstName} ${validation.data.lastName}`,
            email: validation.data.email,
            hashedPassword: hashedPassword,
        },
    });

    // return NextResponse.json({message: "new user registered"}, { status: 201 });
    return NextResponse.json({email: newUser.email}, { status: 201 });
}
