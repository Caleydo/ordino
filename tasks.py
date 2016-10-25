from __future__ import absolute_import

from caleydo_processing_queue.task_definition import task

@task
def sub(x, y):
  return float(x) - float(y)
