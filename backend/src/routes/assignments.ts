import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CsvService } from '../services/CsvService';
import { SecretSantaAssigner } from '../services/SecretSantaAssigner';

const router = Router();
const csvService = new CsvService();
const assigner = new SecretSantaAssigner();

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv' && !file.originalname.endsWith('.csv')) {
      cb(new Error('Only CSV files are allowed'));
    } else {
      cb(null, true);
    }
  },
});

/**
 * POST /api/assignments/generate
 * Generate secret santa assignments
 * Expects multipart form data with:
 * - employees: CSV file with employees
 * - previousAssignments: (optional) CSV file with previous year's assignments
 */
router.post(
  '/generate',
  upload.fields([
    { name: 'employees', maxCount: 1 },
    { name: 'previousAssignments', maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      if (!files || !files.employees || files.employees.length === 0) {
        return res.status(400).json({
          error: 'Employees CSV file is required',
        });
      }

      const employeesFile = files.employees[0];
      let previousAssignmentsFile = null;

      if (files.previousAssignments && files.previousAssignments.length > 0) {
        previousAssignmentsFile = files.previousAssignments[0];
      }

      // Parse employees
      const employees = await csvService.parseEmployeesFromCsv(employeesFile.path);

      // Parse previous assignments if provided
      let previousAssignments: any[] = [];
      if (previousAssignmentsFile) {
        previousAssignments = await csvService.parsePreviousAssignmentsFromCsv(
          previousAssignmentsFile.path
        );
      }

      // Generate assignments
      const assignments = assigner.assignSecretChildren(employees, previousAssignments);

      // Generate output filename
      const timestamp = Date.now();
      const outputFilename = `secret-santa-assignments-${timestamp}.csv`;
      const outputPath = path.join(uploadDir, outputFilename);

      // Write to CSV
      await csvService.writeAssignmentsToCsv(assignments, outputPath);

      // Return assignments and download link
      res.json({
        success: true,
        message: 'Secret Santa assignments generated successfully',
        assignmentCount: assignments.length,
        assignments: assignments.map((a) => a.toJSON()),
        downloadUrl: `/api/assignments/download/${outputFilename}`,
      });

      // Clean up uploaded files
      fs.unlink(employeesFile.path, () => {});
      if (previousAssignmentsFile) {
        fs.unlink(previousAssignmentsFile.path, () => {});
      }
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/assignments/download/:filename
 * Download the generated CSV file
 */
router.get('/download/:filename', (req: Request, res: Response, next: NextFunction) => {
  try {
    const filename = req.params.filename;

    // Sanitize filename to prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filepath = path.join(uploadDir, filename);

    // Verify file exists and is in the upload directory
    const realPath = fs.realpathSync(filepath);
    const realUploadDir = fs.realpathSync(uploadDir);

    if (!realPath.startsWith(realUploadDir)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Send the file
    res.download(filepath, filename);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Secret Santa API is running' });
});

export default router;
