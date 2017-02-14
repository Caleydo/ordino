/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

//register all extensions in the registry following the given pattern
module.exports = function(registry) {
  //registry.push('extension-type', 'extension-id', function() { return System.import('./src/extension_impl'); }, {});
  // generator-phovea:begin

  registry.push('actionFactory', 'ordino', function() { return System.import('./src/Targid'); }, {
  'factory': 'createCmd',
  'creates': '(targidCreateView|targidRemoveView|targidReplaceView)'
 });

  registry.push('actionFactory', 'ordino', function() { return System.import('./src/LineUpCommands'); }, {
  'factory': 'createCmd',
  'creates': '(lineupAddRanking|lineupSetRankingSortCriteria|lineupSetColumn|lineupAddColumn)'
 });

  registry.push('actionCompressor', 'targidCreateRemoveCompressor', function() { return System.import('./src/Targid'); }, {
  'factory': 'compressCreateRemove',
  'matches': '(targidCreateView|targidRemoveView|targidReplaceView)'
 });

  registry.push('actionFactory', 'ordinoParameter', function() { return System.import('./src/View'); }, {
  'factory': 'createCmd',
  'creates': '(targidSetParameter|targidSetSelection)'
 });

  registry.push('actionCompressor', 'targidCompressSetParameter', function() { return System.import('./src/View'); }, {
  'factory': 'compressSetParameter',
  'matches': '(targidSetParameter)'
 });

  registry.push('actionCompressor', 'targidCompressSetSelection', function() { return System.import('./src/View'); }, {
  'factory': 'compressSetSelection',
  'matches': '(targidSetSelection)'
 });

  registry.push('targidStartMenuSection', 'targid_session_start', function() { return System.import('./src/SessionList'); }, {
  'name': 'Sessions',
  'cssClass': 'targidSessionData',
  'factory': 'create',
  'priority': 100
 });
  // generator-phovea:end
};

