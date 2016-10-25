from __future__ import absolute_import

from caleydo_processing_queue.task_definition import task
from targid2 import db


@task
def sql_get_data(database, view_name, args):
  return db.get_data(database, view_name, {}, args)[0]
