from __future__ import absolute_import

from phovea_processing_queue.celery_app import app as celery_app

@celery_app.task
def sub(x, y):
  return float(x) - float(y)
