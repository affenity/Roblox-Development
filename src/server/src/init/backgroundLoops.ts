import * as rounds from "../modules/rounds";

export default function () {
// Game run loop
    coroutine.resume(coroutine.create(() => {
        while (true) {
            wait(1);
            if (rounds.checkCanStart()) {
                print("Can start");
                rounds.startRound();
            }
        }
    }));

}
