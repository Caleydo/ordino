import { EPermission, Permission } from 'visyn_core/security';
import { INamedSet, ENamedSetType } from 'tdp_core';

export class DatasetUtils {
  /**
   * Creates the text for the `title` attribute of a NamedSet
   * @param namedSet NamedSet
   */
  static toNamedSetTitle(namedSet: INamedSet) {
    let title = `Name: ${namedSet.name}\nDescription: ${namedSet.description}`;
    if (namedSet.type === ENamedSetType.NAMEDSET) {
      const permission = Permission.decode(namedSet.permissions);
      title += `\nCreator: ${namedSet.creator}\nPublic: ${permission.others.has(EPermission.READ)}`;
    }

    return title;
  }
}
