import { Request, Response } from 'express';
import { CardTemplateService } from '../services/card-template.service';
import { asyncHandler } from '../utils/async.handler';
import { ApiHandler } from '../utils/api.handler';

export class CardTemplateController {
    private cardTemplateService = new CardTemplateService();

    // Create new card template
    public createCardTemplate = asyncHandler(async (req: Request, res: Response) => {
        // Add user ID from authenticated user
        const templateData = {
            ...req.body,
            // @ts-ignore - req.user is set by auth middleware
            userId: req.user?.id
        };

        const template = await this.cardTemplateService.createCardTemplate(templateData);

        return ApiHandler.success(res, template, 'Card template created successfully', 201);
    });

    // Get all card templates with filtering
    public getAllCardTemplates = asyncHandler(async (req: Request, res: Response) => {
        const { skip, take, userId, isSystem } = req.query;

        const templates = await this.cardTemplateService.getAllCardTemplates({
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            userId: userId as string,
            isSystem: isSystem !== undefined ? isSystem === 'true' : undefined
        });

        return ApiHandler.success(res, templates, 'Card templates retrieved successfully');
    });

    // Get card template by ID
    public getCardTemplateById = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        const template = await this.cardTemplateService.getCardTemplateById(id);

        if (!template) {
            return ApiHandler.error(res, `Card template with ID ${id} not found`, 404);
        }

        return ApiHandler.success(res, template, 'Card template retrieved successfully');
    });

    // Update card template
    public updateCardTemplate = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const updateData = req.body;

        // Check if template exists
        const existingTemplate = await this.cardTemplateService.getCardTemplateById(id);
        if (!existingTemplate) {
            return ApiHandler.error(res, `Card template with ID ${id} not found`, 404);
        }

        // Optional: Check authorization
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user?.id;
        if (existingTemplate.userId && existingTemplate.userId !== userId && !existingTemplate.isSystem) {
            return ApiHandler.error(res, 'Not authorized to update this template', 403);
        }

        const updatedTemplate = await this.cardTemplateService.updateCardTemplate(id, updateData);

        return ApiHandler.success(res, updatedTemplate, 'Card template updated successfully');
    });

    // Delete card template
    public deleteCardTemplate = asyncHandler(async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        // Check if template exists
        const existingTemplate = await this.cardTemplateService.getCardTemplateById(id);
        if (!existingTemplate) {
            return ApiHandler.error(res, `Card template with ID ${id} not found`, 404);
        }

        // Optional: Check authorization
        // @ts-ignore - req.user is set by auth middleware
        const userId = req.user?.id;
        if (existingTemplate.userId && existingTemplate.userId !== userId && !existingTemplate.isSystem) {
            return ApiHandler.error(res, 'Not authorized to delete this template', 403);
        }

        await this.cardTemplateService.deleteCardTemplate(id);

        return ApiHandler.success(res, null, 'Card template deleted successfully');
    });

    // Create a system template
    public createSystemTemplate = asyncHandler(async (req: Request, res: Response) => {
        // @ts-ignore - req.user is set by auth middleware
        if (req.user?.role !== 'admin') {
            return ApiHandler.error(res, 'Only admins can create system templates', 403);
        }

        const templateData = {
            ...req.body,
            isSystem: true
        };

        const template = await this.cardTemplateService.createCardTemplate(templateData);

        return ApiHandler.success(res, template, 'System template created successfully', 201);
    });

    // Get all system templates
    public getSystemTemplates = asyncHandler(async (req: Request, res: Response) => {
        const { skip, take } = req.query;

        const templates = await this.cardTemplateService.getAllCardTemplates({
            skip: skip ? parseInt(skip as string) : undefined,
            take: take ? parseInt(take as string) : undefined,
            isSystem: true
        });

        return ApiHandler.success(res, templates, 'System templates retrieved successfully');
    });
}
