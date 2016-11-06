/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

import {register} from 'phovea_core/src/plugin';

/**
 * build a registry by registering all phovea modules
 */
//other modules
import 'phovea_clue/phovea_registry.js';
import 'phovea_vis_lineup/phovea_registry.js';
import 'phovea_data_mongo/phovea_registry.js';
import 'phovea_data_redis/phovea_registry.js';
//self
register('targid2',require('./phovea.js'));
