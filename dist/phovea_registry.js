/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
import { PluginRegistry } from 'tdp_core';
import reg from './phovea';
/**
 * build a registry by registering all phovea modules
 */
// other modules
import 'tdp_core/dist/phovea_registry';
// self
PluginRegistry.getInstance().register('ordino', reg);
//# sourceMappingURL=phovea_registry.js.map