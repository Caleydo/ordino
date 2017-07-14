import {IPlugin, IPluginDesc} from 'phovea_core/src/plugin';

export interface IScoreLoader {
  /**
   * unique id of this loader
   */
  readonly id: string;
  /**
   * name for the entry
   */
  readonly text: string;
  /**
   * id of the score implementation plugin
   */
  readonly scoreId: string;

  /**
   * @param extraArgs
   * @returns {Promise<any>} a promise of the score params
   */
  factory(extraArgs: object, count: number): Promise<object>;
}

export interface IScoreLoaderExtension {
  (desc: IPluginDesc, extraArgs: object): Promise<IScoreLoader[]>;
}

export interface IScoreLoaderExtensionDesc extends IPluginDesc {
  idtype: string;

  load(): Promise<IPlugin & IScoreLoaderExtension>;
}

/**
 * Wraps the ordinoScore such that the plugin is loaded and the score modal opened, when the factory function is called
 * @param ordinoScore
 * @returns {IScoreLoader}
 */
export default function wrap(ordinoScore: IPluginDesc): IScoreLoader {
  return {
    text: ordinoScore.name,
    id: ordinoScore.id,
    scoreId: ordinoScore.id,
    factory(extraArgs: object, count: number) {
      return ordinoScore.load().then((p) => Promise.resolve(p.factory(ordinoScore, extraArgs, count)));
    }
  };
}
