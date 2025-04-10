import { Request, Response } from 'express';
import fileService from '../services/file.service';
import { asyncHandler } from '../utils/async.handler';
import { ApiHandler } from '../utils/api.handler';


export class FileController {
    /**
     * Tạo presigned URL để client upload file trực tiếp lên S3
     * @route POST /api/files/upload-url
     */
    public getUploadUrl = asyncHandler(async (req: Request, res: Response) => {
        const { fileName, fileType, folder } = req.body;

        // Validate input
        if (!fileName || !fileType) {
            return res.status(400).json({
                success: false,
                message: 'File name and file type are required'
            });
        }

        const uploadUrl = await fileService.createPresignedUrl(
            fileName,
            fileType,
            folder || 'media'
        );

        // Extract file key from URL
        const urlParts = uploadUrl.split('?')[0].split('/');
        const keyParts = urlParts[urlParts.length - 1].split('-');
        // Remove UUID from beginning to get original filename
        keyParts.shift();
        const originalFileName = keyParts.join('-');

        // Get full fileKey including folder
        const fileKey = `${folder || 'media'}/${urlParts[urlParts.length - 1]}`;

        return ApiHandler.success(res, {
            uploadUrl,
            fileKey,
            fileName: originalFileName,
            expiresIn: 'Expires in seconds defined in config'
        }, 'Upload URL created successfully');
    });

    /**
     * Lấy URL để đọc/xem file từ S3
     * @route GET /api/files/:fileKey
     */
    public getFileUrl = asyncHandler(async (req: Request, res: Response) => {
        const { fileKey } = req.params;

        if (!fileKey) {
            return res.status(400).json({
                success: false,
                message: 'File key is required'
            });
        }

        const readUrl = await fileService.createReadUrl(fileKey);

        return ApiHandler.success(res, {
            readUrl,
            fileKey
        }, 'Read URL created successfully');
    })
    /**
     * Xóa file từ S3
     * @route DELETE /api/files/:fileKey
     */
    public deleteFile = asyncHandler(async (req: Request, res: Response) => {
        const { fileKey } = req.params;

        if (!fileKey) {
            throw new Error('File key is required');
        }

        await fileService.deleteFile(fileKey);

        return ApiHandler.success(res, null, 'File deleted successfully');
    });
}