/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

//register all extensions in the registry following the given pattern
module.exports = function (registry) {
  //registry.push('extension-type', 'extension-id', function() { return System.import('./src/extension_impl'); }, {});
  // generator-phovea:begin

  registry.push('actionFactory', 'ordino', function () {
    return System.import('./src/cmds');
  }, {
    'factory': 'createCmd',
    'creates': '(targidCreateView|targidRemoveView|targidReplaceView|targidInitSession)'
  });

  registry.push('actionFactory', 'ordino', function() { return System.import('./src/lineup/cmds'); }, {
  'factory': 'createCmd',
  'creates': '(lineupAddRanking|lineupSetRankingSortCriteria|lineupSetColumn|lineupAddColumn)'
 });

  registry.push('actionCompressor', 'targidCreateRemoveCompressor', function () {
    return System.import('./src/cmds');
  }, {
    'factory': 'compressCreateRemove',
    'matches': '(targidCreateView|targidRemoveView|targidReplaceView)'
  });

  registry.push('actionFactory', 'ordinoScore', function() { return System.import('./src/lineup/scorecmds'); }, {
  'factory': 'createCmd',
  'creates': '(ordinoAddScore|ordinoRemoveScore)'
 });

  registry.push('actionCompressor', 'ordinoScoreCompressor', function() { return System.import('./src/lineup/scorecmds'); }, {
  'factory': 'compress',
  'matches': '(ordinoAddScore|ordinoRemoveScore)'
 });

  registry.push('actionFactory', 'ordinoParameter', function() { return System.import('./src/View'); }, {
  'factory': 'createCmd',
  'creates': '(targidSetParameter|targidSetSelection)'
 });

  registry.push('actionCompressor', 'targidCompressSetParameter', function () {
    return System.import('./src/View');
  }, {
    'factory': 'compressSetParameter',
    'matches': '(targidSetParameter)'
  });

  registry.push('actionCompressor', 'targidCompressSetSelection', function () {
    return System.import('./src/View');
  }, {
    'factory': 'compressSetSelection',
    'matches': '(targidSetSelection)'
  });

  registry.push('targidStartMenuSection', 'targid_temporary_session', function () {
    return System.import('./src/SessionList');
  }, {
    name: 'Temporary Sessions',
    cssClass: 'targidSessionTemporaryData',
    factory: 'createTemporary',
    priority: 90
  });

  registry.push('targidStartMenuSection', 'targid_persistent_session', function () {
    return System.import('./src/SessionList');
  }, {
    name: 'Persistent Sessions',
    cssClass: 'targidSessionPersistentData',
    factory: 'createPersistent',
    priority: 95
  });

  registry.push('idTypeDetector', 'gene_idtype_detector', function () {
    return System.import('./src/GeneIDTypeDetector');
  }, {
    'name': 'IDTypeDetector',
    'factory': 'geneIDTypeDetector',
    'idType': 'Ensembl'
  });

  // generator-phovea:end
};

