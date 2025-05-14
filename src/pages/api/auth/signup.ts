import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcrypt";
import { prisma } from "lib/prisma