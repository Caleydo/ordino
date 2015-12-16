/**
 * Created by Samuel Gratzl on 16.12.2015
 */

import template = require('../clue/template');
import cmds = require('./cmds');
import cmode = require('../caleydo_provenance/mode');
import $ = require('jquery');

const elems = template.create(document.body, {
  app: 'Targid V2',
  application: '/targid2',
  id: 'targid2'
});

elems.jumpToStored();
