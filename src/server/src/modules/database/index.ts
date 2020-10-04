import { DataStoreService } from "@rbxts/services";
import Config from "shared/config";
const Index = DataStoreService.GetDataStore(`Data-${Config.database.version}`);
type DatabaseResult = {
    level: number;
    kills: number;
    deaths: number;
    playedBefore: boolean;
};

export function get (key: string) {
    let retrievedData;

    const result = opcall(() => {
        retrievedData = Index.GetAsync(key) || Config.database.defaultPlayerData;
        return retrievedData;
    });

    if (!result.success) {
        error(`Failed to get data: ${result.error}`);
    } else {
        retrievedData = result.value as DatabaseResult;
        print(`Successfully retrieved data! User level: ${retrievedData.level}`);
    }

    return retrievedData;
}

export function set (key: string, value: object) {
    const saveResult = opcall(() => {
        Index.SetAsync(key, value);
    });

    if (saveResult.success) {
        print(`Successfully saved data for key: "${key}"!`);
        return true;
    } else {
        error(`Failed to save data for key: "${key}"! Error: ${saveResult.error}`);
        return false;
    }
}
