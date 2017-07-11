import {IPluginDesc} from 'phovea_core/src/plugin';

interface IScoreLoader {
  /**
   * name for the entry
   */
  readonly name: string;
  /**
   * id of the score implementation plugin
   */
  readonly id: string;

  /**
   * @param extraArgs
   * @returns {Promise<any>} a promise of the score params
   */
  factory(extraArgs: object): Promise<object>;
}

interface IScoreLoaderExtension {
  (desc: IPluginDesc, extraArgs: object): Promise<IScoreLoader[]>;
}

interface IScoreLoaderExtensionDesc extends IPluginDesc {
  idtype: string;
}

export function wrap(ordinoScore: IPluginDesc): IScoreLoader {
  return {
    name: ordinoScore.name,
    id: ordinoScore.id,
    factory(extraArgs: object) {
      return ordinoScore.load().then((p) => Promise.resolve(p.factory(ordinoScore, extraArgs)));
    }
  };
}
