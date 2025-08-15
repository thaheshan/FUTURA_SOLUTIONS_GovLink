import * as express from 'express';
import { Request, Response } from 'express';
import { fileService } from '../../../services/storage/fileService';
import { authenticate } from '../../../middleware/auth/authenticate';
import { AuthenticatedRequest } from '../../../middleware/auth/authenticate';

const router = express.Router();

// Protected file download
router.get('/:fileId', authenticate, async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const user = (req as unknown as AuthenticatedRequest).user;
    
    const { stream, metadata } = await fileService.downloadFile(fileId, user.userId);
    
    res.set({
      'Content-Type': metadata.mimeType,
      'Content-Disposition': `attachment; filename="${metadata.originalName}"`,
      'Content-Length': metadata.size,
      'Cache-Control': 'private, max-age=3600'
    });
    
    stream.pipe(res);
  } catch (error: any) {
    res.status(404).json({ 
      error: 'File not found',
      message: error.message 
    });
  }
});

// Get file metadata
router.get('/:fileId/metadata', authenticate, async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const metadata = await fileService.getFileMetadata(fileId);
    
    res.json({
      success: true,
      metadata
    });
  } catch (error: any) {
    res.status(404).json({ 
      error: 'File not found',
      message: error.message 
    });
  }
});

// List user files
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const user = (req as unknown as AuthenticatedRequest).user;
    const { page = 1, limit = 20 } = req.query;
    
    const result = await fileService.listUserFiles(
      user.userId,
      Number(page),
      Number(limit)
    );
    
    res.json({
      success: true,
      ...result
    });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch files',
      message: error.message 
    });
  }
});

export default router;