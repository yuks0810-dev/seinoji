import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tally = await prisma.tally.findMany();
      res.status(200).json(tally);
    } catch (error) {
      console.error('Error in GET /api/tally:', error);
      res.status(500).send('Internal Server Error');
    }
  } else if (req.method === 'POST') {
    const { stroke, memo } = req.body;
    try {
      const newTally = await prisma.tally.create({
        data: { stroke, memo },
      });
      res.status(201).json(newTally);
    } catch (error) {
      console.error('Error in POST /api/tally:', error);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
