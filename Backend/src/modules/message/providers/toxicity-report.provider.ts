import { Connection } from 'mongoose';
import { MONGO_DB_PROVIDER } from 'src/kernel';
import { ToxicityReportSchema } from '../schemas/toxicity-report.schema';

export const TOXICITY_REPORT_MODEL_PROVIDER = 'TOXICITY_REPORT_MODEL_PROVIDER';

export const toxicityReportProviders = [
  {
    provide: TOXICITY_REPORT_MODEL_PROVIDER,
    useFactory: (connection: Connection) => connection.model('ToxicityReport', ToxicityReportSchema),
    inject: [MONGO_DB_PROVIDER]
  }
];
