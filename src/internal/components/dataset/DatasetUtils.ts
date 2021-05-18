import {EPermission, Permission, UserSession} from "phovea_core";
import {INamedSet, ENamedSetType} from "tdp_core";

export class DatasetUtils {
    /**
     * Creates the text for the `title` attribute of a NamedSet
     * @param namedSet NamedSet
     */
    static toNamedSetTitle(namedSet: INamedSet) {
        console.log(namedSet)
        const me = UserSession.getInstance().currentUserNameOrAnonymous();

        let title = `Name: ${namedSet.name}\nDescription: ${namedSet.description}`

        if (namedSet.type === ENamedSetType.NAMEDSET) {
            const permission = Permission.decode(namedSet.permissions);
            title += `\nCreator: ${namedSet.creator}\nPublic: ${permission.others.has(EPermission.READ)}`
        }

        return title
    }
}