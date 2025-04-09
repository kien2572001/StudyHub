import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CardTemplateFilter {
    skip?: number;
    take?: number;
    userId?: string;
    isSystem?: boolean;
    options?: {
        [key: string]: any;
    }
}

export class CardTemplateService {
    // Create a new card template
    async createCardTemplate(data: any) {
        return prisma.cardTemplate.create({
            data
        });
    }

    // Get all card templates with optional filtering
    async getAllCardTemplates(filter: CardTemplateFilter) {
        const { skip, take, userId, isSystem } = filter;

        const where: any = {};

        if (userId !== undefined) {
            where.userId = userId;
        }

        if (isSystem !== undefined) {
            where.isSystem = isSystem;
        }

        return prisma.cardTemplate.findMany({
            skip,
            take,
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    // Get a card template by ID
    async getCardTemplateById(id: number) {
        return prisma.cardTemplate.findUnique({
            where: { id }
        });
    }

    // Update a card template
    async updateCardTemplate(id: number, data: any) {
        return prisma.cardTemplate.update({
            where: { id },
            data
        });
    }

    // Delete a card template
    async deleteCardTemplate(id: number) {
        return prisma.cardTemplate.delete({
            where: { id }
        });
    }
}
