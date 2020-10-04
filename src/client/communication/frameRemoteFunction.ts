export default function (remoteFunction: RemoteFunction) {
    return {
        Get: (...args: unknown[]) => {
            return remoteFunction.InvokeServer(...args);
        }
    };
};
