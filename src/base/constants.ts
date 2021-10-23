import {IOrdinoViewPluginDesc} from '../store/ordinoSlice';


export const views: IOrdinoViewPluginDesc[] = [
    {
        index: 0, // dummy index
        id: 'view_1',
        name: 'Expression',
        selection: 'multiple',
        group: {
            name: 'General',
            order: 10
        }
    },
    {
        index: 0,
        id: 'view_2',
        name: 'Dummy 1',
        selection: 'multiple',
        group: {
            name: 'Dummy group',
            order: 10
        }
    },
    {
        index: 0,
        id: 'view_3',
        name: 'Dummy 2',
        selection: 'multiple',
        group: {
            name: 'Dummy 2',
            order: 10
        }
    },
    {
        index: 0,
        id: 'view_4',
        name: 'Dummy 3',
        selection: 'multiple',
        group: {
            name: 'Dummy group 2',
            order: 10
        }
    },
    {
        index: 0,
        id: 'view_5',
        name: 'Dummy 4',
        selection: 'multiple',
        group: {
            name: 'Dummy group 3',
            order: 10
        }
    }
];
