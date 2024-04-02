const cron = require('node-cron');
import { CRON_JOB_EXPORT_REPORT_TIME, LIMIT_SIGHTS } from '@/config';
import SightService from './sight.service';
import { logger } from '@/utils/logger';
import EmailService from './email.service';
import { getFormattedDate } from '@/utils/util';
const jsoncsv = require('json-csv');

export class JobExportDataService {
  public static startExport() {
    const sightsService = new SightService();
    const emailService = new EmailService();

    // Schedule the job according to the specified time.
    cron.schedule(CRON_JOB_EXPORT_REPORT_TIME, async () => {
      try {
        const limit = typeof LIMIT_SIGHTS === 'string' ? parseInt(LIMIT_SIGHTS, 10) : LIMIT_SIGHTS;
        const recentSights = await sightsService.findAllRecentSights(limit);

        const options = {
          fields: [
            {
              name: 'animal',
              label: 'Nombre del animal',
            },
            {
              name: 'condition',
              label: 'Condición',
            },
            {
              name: 'province',
              label: 'Provincia',
            },
            {
              name: 'placeName',
              label: 'Lugar',
            },
            {
              name: 'location.longitude',
              label: 'Longitud',
            },
            {
              name: 'location.latitude',
              label: 'Latitud',
            },
            {
              name: 'description',
              label: 'Descripción',
            },
            {
              name: 'createdAt',
              label: 'Fecha de creación',
            },
          ],
        };
        const result = await jsoncsv.buffered(recentSights, options);
        emailService.sendSightsDbReport(result, `marandu-avistamientos-${getFormattedDate()}.csv`);
      } catch (error) {
        logger.error('Failed to export data:', error);
      }
    });
  }
}
