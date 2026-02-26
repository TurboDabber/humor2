import express, { type Request, type Response } from 'express';
import cors from 'cors';
import multer, { type FileFilterCallback } from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import * as nodeCrypto from 'node:crypto';

const app = express();

const PORT = 3000;
const FRONTEND_ORIGIN = 'http://localhost:4200';

const uploadsDir = path.join(process.cwd(), 'uploads');

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${nodeCrypto.randomUUID()}-${safe}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter,
});

type RemainingItem = {
  id: string;
  filename: string;
  originalName: string;
};

type Session = {
  remaining: RemainingItem[];
};

const sessions = new Map<string, Session>();

function makeId(): string {
  return nodeCrypto.randomUUID();
}

app.post('/api/upload', upload.array('images', 50), (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) ?? [];

  if (files.length === 0) {
    return res.status(400).json({ message: 'No files' });
  }

  const sessionId = makeId();
  const remaining: RemainingItem[] = files.map((f) => ({
    id: makeId(),
    filename: f.filename,
    originalName: f.originalname,
  }));

  sessions.set(sessionId, { remaining });

  return res.json({ sessionId, total: remaining.length });
});

app.get('/api/sessions/:sessionId/next', (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  if (session.remaining.length === 0) {
    return res.json({ done: true, remaining: 0 });
  }

  const idx = Math.floor(Math.random() * session.remaining.length);
  const item = session.remaining[idx];

  session.remaining.splice(idx, 1);

  return res.json({
    done: false,
    remaining: session.remaining.length,
    image: {
      id: item.id,
      originalName: item.originalName,
      url: `http://localhost:${PORT}/uploads/${item.filename}`,
    },
  });
});

app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});
