from __future__ import absolute_import

from caleydo_processing_queue.queue import task

@task
def sub(x, y):
  return float(x) - float(y)
