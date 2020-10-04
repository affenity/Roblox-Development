export default function (remoteFunction: RemoteEvent) {
    return {
        Get: (...args: unknown[]) => {
            return remoteFunction.FireServer(...args);
        }
    };
};
