###############################################################################
# Caleydo - Visualization for Molecular Biology - http://caleydo.org
# Copyright (c) The Caleydo Team. All rights reserved.
# Licensed under the new BSD license, available at http://caleydo.org/license
###############################################################################


def phovea(registry):
  """
  register extension points
  :param registry:
  """
  # generator-phovea:begin
  registry.append('namespace', 'targid2', 'targid2.proxy', {
   'namespace': '/api/targid/proxy'
  })

  registry.append('namespace', 'db_connector', 'targid2.sql', {
   'namespace': '/api/targid/db'
  })

  registry.append('namespace', 'targid_storage', 'targid2.storage', {
   'namespace': '/api/targid/storage'
  })

  registry.append('namespace', 'processing', 'targid2.processing', {
   'namespace': '/api/targid/processing'
  })

  registry.append('processing-task', 'targid_tasks', 'targid2.tasks', {})
  # generator-phovea:end
  pass


def phovea_config():
  """
  :return: file pointer to config file
  """
  from os import path
  here = path.abspath(path.dirname(__file__))
  config_file = path.join(here, 'config.json')
  return config_file if path.exists(config_file) else None
