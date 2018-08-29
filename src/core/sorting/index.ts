import * as R from 'ramda';
import Logger from 'core/Logger';

export interface ISortSetting {
    columnId: string | number;
    direction: SortDirection;
}

export enum SortDirection {
    Ascending = 'asc',
    Descending = 'desc',
    None = 'none'
}

export type SortSettings = ISortSetting[];

export function updateSettings(
    settings: SortSettings,
    setting: ISortSetting
): SortSettings {
    Logger.trace('updateSettings', settings, setting);

    settings = R.clone(settings);

    if (setting.direction === SortDirection.None) {
        const currentIndex = R.findIndex(s => s.columnId === setting.columnId, settings);

        if (currentIndex !== -1) {
            settings.splice(currentIndex, 1);
        }
    } else {
        const currentSetting = R.find(s => s.columnId === setting.columnId, settings);

        if (currentSetting) {
            currentSetting.direction = setting.direction;
        } else {
            settings.push(setting);
        }
    }

    return settings;
}

export default (dataframe: any[], settings: SortSettings): any[] => {
    if (!settings.length) {
        return dataframe;
    }

    return R.sortWith(
        R.map(setting => {
            return setting.direction === SortDirection.Descending ?
                R.comparator((d1: any, d2: any) => {
                    const id = setting.columnId;

                    const prop1 = d1[id];
                    const prop2 = d2[id];

                    if (prop1 === undefined || prop1 === null) {
                        return false;
                    } else if (prop2 === undefined || prop2 === null) {
                        return true;
                    }

                    return prop1 > prop2;
                }) :
                R.comparator((d1: any, d2: any) => {
                    const id = setting.columnId;

                    const prop1 = d1[id];
                    const prop2 = d2[id];

                    if (prop1 === undefined || prop1 === null) {
                        return false;
                    } else if (prop2 === undefined || prop2 === null) {
                        return true;
                    }

                    return prop1 < prop2;
                });
        }, settings),
        dataframe
    );
};