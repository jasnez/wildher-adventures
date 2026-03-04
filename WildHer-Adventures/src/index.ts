// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      const role = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' },
      });
      if (!role) return;

      const actions = [
        'api::tour.tour.find',
        'api::tour.tour.findOne',
        'api::article.article.find',
        'api::article.article.findOne',
        'api::destination.destination.find',
        'api::destination.destination.findOne',
      ];
      const permissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
        where: { role: role.id, action: { $in: actions } },
      });
      for (const p of permissions) {
        await strapi.db.query('plugin::users-permissions.permission').update({
          where: { id: p.id },
          data: { enabled: true },
        });
      }
      if (permissions.length > 0) {
        strapi.log.info(`[bootstrap] Omogućeno ${permissions.length} dozvola za Public (Tour, Article, Destination).`);
      }
    } catch (e) {
      strapi.log.warn('[bootstrap] Dozvole nisu postavljene automatski. U Adminu: Settings → Users & Permissions → Public uključi find/findOne za Tour, Article i Destination.');
    }
  },
};
